import { operationsApi, operationalVersion } from './operations-api';
import type { BookingInput, BookingCheckInInput } from './db';

export const bookingApi = {
  create(values: BookingInput) { return operationsApi.command('/bookings/command', { operation: 'create', values }); },
  capacity(bookingDate: string, serviceWork: number, generalCheckupFollowup: number) {
    return operationsApi.command('/bookings/command', { operation: 'capacity', values: { bookingDate, serviceWork, generalCheckupFollowup } });
  },
  change(id: number, operation: string, values: unknown = {}) {
    return operationsApi.command('/bookings/' + id + '/command', { operation, version: operationalVersion('bookings', id), values });
  },
  checkIn(id: number, values: BookingCheckInInput) {
    return operationsApi.command<{ jobId: number; job_no: string }>('/bookings/' + id + '/command', { operation: 'check-in', version: operationalVersion('bookings', id), values });
  },
};
