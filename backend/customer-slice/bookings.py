"""Approved advance bookings, with atomic reception check-in and scoped audit."""
from datetime import date, datetime, timezone
from fastapi import APIRouter, Request
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from sqlalchemy import text
from api import fail, TENANT, BRANCH
from operations import command, row, mutable, insert, update_fields, Intake, create_intake

router = APIRouter(prefix='/api/v1/bookings')
ACTIVE = ('BOOKED','CONFIRMED','RESCHEDULED')
TABLES = ('bookings','booking_events','booking_call_logs','booking_capacity_limits','booking_capacity_overrides')


class BookingInput(BaseModel):
    model_config = ConfigDict(extra='forbid')
    customerId: int | None = None
    vehicleId: int | None = None
    customerName: str
    mobile: str
    customerType: str = 'Individual'
    vehicleNo: str
    make: str
    model: str
    color: str = ''
    requestedWork: str
    serviceType: str
    bookingDate: date
    arrivalWindow: str = ''
    capacityOverrideReason: str = ''


class Change(BaseModel):
    model_config = ConfigDict(extra='forbid')
    operation: str
    version: int | None = None
    values: dict = Field(default_factory=dict)


def require(u):
    if u['role'] not in ('admin','reception'): fail('Booking changes are not permitted for this role.',403)


def validate(c,d):
    for k in ('customerName','mobile','vehicleNo','make','model','requestedWork'):
        if not d[k].strip(): fail('Customer, vehicle, and requested work are required for a booking.',422)
    if d['bookingDate'] < datetime.now(timezone.utc).date(): fail('A booking date cannot be in the past.',422)
    if d['arrivalWindow'] not in ('','Morning','Afternoon','Evening'): fail('Choose a valid arrival window.',422)
    if d['serviceType'] not in ('Service Work','General Checkup / Follow-up'): fail('Choose a valid booking service type.',422)
    if d['customerId']:
        customer = row(c,'customers',d['customerId'])
        if customer['archived_at']: fail('Customer is archived.',422)
    if d['vehicleId']:
        vehicle = row(c,'vehicles',d['vehicleId'])
        if vehicle['archived_at'] or vehicle['customer_id'] != d['customerId']: fail('Selected vehicle does not belong to the customer.',422)


def capacity(c,u,d,excluding=0):
    configured = c.execute(text('SELECT * FROM booking_capacity_limits WHERE booking_date=:d'),{'d':d['bookingDate']}).mappings().first()
    field = 'service_work_capacity' if d['serviceType']=='Service Work' else 'general_checkup_followup_capacity'
    limit = configured[field] if configured else (8 if d['serviceType']=='Service Work' else 4)
    count = c.scalar(text("SELECT count(*) FROM bookings WHERE booking_date=:d AND service_type=:s AND status IN ('BOOKED','CONFIRMED','RESCHEDULED') AND id<>:id"),{'d':d['bookingDate'],'s':d['serviceType'],'id':excluding})
    count += c.scalar(text("SELECT count(*) FROM slice_historical_bookings WHERE source_table='bookings' AND values->>'booking_date'=:d AND values->>'service_type'=:s AND values->>'status' IN ('Booked','Confirmed','Rescheduled')"),{'d':str(d['bookingDate']),'s':d['serviceType']})
    if count < limit: return False
    if u['role']!='admin': fail(f"{d['serviceType']} is fully booked ({limit} advance bookings).",409)
    if not d['capacityOverrideReason'].strip(): fail('An Admin override reason is required for a full booking service type.',422)
    return True


def event(c,u,b,kind,note='',previous=None):
    insert(c,'booking_events',dict(booking_id=b['id'],kind=kind,actor_id=u['profile_id'],at=datetime.now(timezone.utc).isoformat(),note=note,previous_booking_date=previous,booking_date=str(b['booking_date'])))


def values(d):
    mapping = dict(customerId='customer_id',vehicleId='vehicle_id',customerName='customer_name',mobile='mobile',customerType='customer_type',vehicleNo='vehicle_no',make='make',model='model',color='color',requestedWork='requested_work',serviceType='service_type',bookingDate='booking_date',arrivalWindow='arrival_window')
    out = {target:d[source].strip() if isinstance(d[source],str) else d[source] for source,target in mapping.items()}
    out['vehicle_no']=out['vehicle_no'].upper()
    out['customer_type']=out['customer_type'] or 'Individual'
    return out


@router.post('/command')
def booking_command(value:Change,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        require(u)
        if replay: return replay
        if value.operation=='capacity':
            d=value.values
            if u['role']!='admin': fail('Only Admin can change daily booking capacity.',403)
            if set(d)!= {'bookingDate','serviceWork','generalCheckupFollowup'}: fail('Invalid capacity fields.',422)
            try: day=date.fromisoformat(d['bookingDate'])
            except (ValueError,TypeError): fail('Enter a valid booking date.',422)
            if any(type(d[k]) is not int or d[k]<0 for k in ('serviceWork','generalCheckupFollowup')): fail('Booking capacities must be whole numbers of zero or more.',422)
            c.execute(text('INSERT INTO booking_capacity_limits(tenant_id,branch_id,booking_date,service_work_capacity,general_checkup_followup_capacity,capacity,set_by,updated_by) VALUES(:t,:b,:d,:sw,:gc,:total,:p,:a) ON CONFLICT(tenant_id,branch_id,booking_date) DO UPDATE SET service_work_capacity=excluded.service_work_capacity,general_checkup_followup_capacity=excluded.general_checkup_followup_capacity,capacity=excluded.capacity,set_by=excluded.set_by,updated_by=excluded.updated_by,updated_at=now(),version=booking_capacity_limits.version+1'),dict(t=TENANT,b=BRANCH,d=day,sw=d['serviceWork'],gc=d['generalCheckupFollowup'],total=d['serviceWork']+d['generalCheckupFollowup'],p=u['profile_id'],a=u['user_id']))
            return save({'saved':True})
        if value.operation!='create': fail('Unknown booking operation.',422)
        d=parse(BookingInput,value.values)
        validate(c,d); override=capacity(c,u,d)
        b=insert(c,'bookings',dict(**values(d),status='BOOKED',ui_status='Booked',slice_booking=True,created_by=u['user_id'],updated_by=u['user_id']))
        event(c,u,b,'Booked')
        if override: record_override(c,u,b,d)
        return save({'id':b['id']})


def record_override(c,u,b,d):
    insert(c,'booking_capacity_overrides',dict(booking_id=b['id'],booking_date=str(d['bookingDate']),reason=d['capacityOverrideReason'].strip(),approved_by=u['profile_id'],approved_at=datetime.now(timezone.utc).isoformat()))


@router.post('/{booking_id}/command')
def change_booking(booking_id:int,value:Change,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        require(u)
        if replay: return replay
        if c.scalar(text("SELECT EXISTS(SELECT 1 FROM slice_historical_bookings WHERE source_table='bookings' AND (values->>'id')::bigint=:id)"),{'id':booking_id}): fail('Historical booking is preserved read-only pending actor policy.',409)
        b=row(c,'bookings',booking_id); mutable(b,value.version)
        if not b['slice_booking']: fail('This booking requires compatibility review.',409)
        if b['status'] not in ACTIVE: fail(f"A {b['ui_status']} booking cannot be changed.",409)
        op=value.operation; d=value.values; now=datetime.now(timezone.utc)
        fields={'updated_at':now,'updated_by':u['user_id']}
        if op=='check-in':
            allowed={'odoReading','fuelLevelValue','fuelLevelUnit','keys','accessories','requestedWork','damageMarks'}
            if set(d)-allowed: fail('Invalid check-in fields.',422)
            unit=d.get('fuelLevelUnit',''); fuel=d.get('fuelLevelValue','')
            if not isinstance(fuel,str) or not fuel.strip() or unit not in ('bars','%','litres','Other'): fail('Enter the fuel level or battery percentage.',422)
            incoming=dict(customerId=b['customer_id'],vehicleId=b['vehicle_id'],customerName=b['customer_name'],mobile=b['mobile'],customerType=b['customer_type'],vehicleNo=b['vehicle_no'],make=b['make'],model=b['model'],color=b['color'],km=d.get('odoReading'),fuel=fuel.strip() if unit=='Other' else fuel.strip()+' '+unit,serviceType=b['service_type'],**d)
            result=create_intake(c,u,parse(Intake,incoming))
            fields.update(customer_id=result['customer_id'],vehicle_id=result['vehicle_id'],visit_id=result['visit_id'],job_card_id=result['id'],arrived_at=now,status='ARRIVED',ui_status='Arrived')
            update_fields(c,'bookings',b['id'],fields); event(c,u,b,'Arrived','Checked in at reception')
            return save(dict(result,jobId=result['id'],visitId=result['visit_id']))
        if op=='call':
            note=d.get('note','').strip()
            if not note: fail('A call note is required.',422)
            insert(c,'booking_call_logs',dict(booking_id=b['id'],note=note,called_by=u['profile_id'],called_at=now.isoformat()))
        elif op in ('update','reschedule'):
            if op=='reschedule':
                note=d.get('note','').strip()
                if not note: fail('A reschedule reason is required.',422)
                incoming={k:b[v] for k,v in dict(customerId='customer_id',vehicleId='vehicle_id',customerName='customer_name',mobile='mobile',customerType='customer_type',vehicleNo='vehicle_no',make='make',model='model',color='color',requestedWork='requested_work',serviceType='service_type').items()}
                incoming.update(bookingDate=d.get('bookingDate'),arrivalWindow=d.get('arrivalWindow',''),capacityOverrideReason=d.get('capacityOverrideReason',''))
                d=parse(BookingInput,incoming)
                if d['bookingDate']==b['booking_date'] and d['arrivalWindow']==b['arrival_window']: fail('Choose a different date or arrival window when rescheduling.',422)
                fields.update(status='RESCHEDULED',ui_status='Rescheduled',rescheduled_at=now.isoformat(),reschedule_reason=note)
            else: d=parse(BookingInput,d)
            validate(c,d); override=capacity(c,u,d,b['id']); fields.update(values(d))
            if override: record_override(c,u,b,d)
            if op=='reschedule': event(c,u,dict(b,booking_date=d['bookingDate']),'Rescheduled',note,str(b['booking_date']))
        elif op in ('confirm','cancel','no-show'):
            status,label,stem={'confirm':('CONFIRMED','Confirmed','confirmed'),'cancel':('CANCELLED','Cancelled','cancelled'),'no-show':('NO_SHOW','No-show','no_show')}[op]
            if op=='confirm' and b['status'] not in ('BOOKED','RESCHEDULED'): fail('This booking cannot be confirmed.',409)
            note=d.get('note','').strip()
            if op!='confirm' and not note: fail('A reason is required.',422)
            fields.update(status=status,ui_status=label,**{stem+'_at':now.isoformat()})
            if op!='confirm': fields['cancellation_reason' if op=='cancel' else 'no_show_reason']=note
            event(c,u,b,label,note)
        else: fail('Unknown booking operation.',422)
        update_fields(c,'bookings',b['id'],fields)
        return save({'id':b['id']})


def projection(c):
    actors={str(r['platform_user_id']):r['id'] for r in c.execute(text('SELECT id,platform_user_id FROM workshop_user_profiles')).mappings() if r['platform_user_id']}
    result={}
    for table in TABLES:
        rows=[]
        for raw in c.execute(text('SELECT * FROM '+table)).mappings():
            r={k:v.isoformat() if isinstance(v,(datetime,date)) else v for k,v in raw.items() if k not in ('tenant_id','branch_id','updated_by','slice_booking')}
            if table=='bookings': r['status']=r.pop('ui_status'); r['created_by']=actors.get(str(r['created_by']))
            rows.append(r)
        if table in ('bookings','booking_events'):
            rows += [dict(r['values'],version=1) for r in c.execute(text('SELECT values FROM slice_historical_bookings WHERE source_table=:t'),{'t':table}).mappings()]
        result[table]=rows
    return result


def parse(model,values):
    try: return model.model_validate(values).model_dump()
    except ValidationError: fail("Invalid booking fields.",422)
