import importlib.util
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('planner',Path(__file__).with_name('planner.py'))
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)


class PlannerTests(unittest.TestCase):
    def test_wrong_hash_fails_before_sqlite_open(self):
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/'not-source.sqlite';path.write_bytes(b'not a database')
            with self.assertRaisesRegex(ValueError,'hash'): p.plan(path)

    def test_naive_time_is_not_assigned_timezone(self):
        self.assertEqual(p.convert('2026-10-01 12:00:00','timestamptz'),('2026-10-01 12:00:00','TIMESTAMP_INTERPRETATION_REQUIRED'))

    def test_date_only_not_instant(self):
        self.assertEqual(p.date_kind('2026-10-01'),'DATE_ONLY')
        self.assertIsNotNone(p.convert('2026-10-01','timestamptz')[1])

    def test_offset_preserved(self):
        self.assertEqual(p.convert('2026-10-01T12:00:00+05:30','timestamptz'),('2026-10-01T12:00:00+05:30',None))

    def test_no_numeric_zero_nullification(self):
        self.assertEqual(p.convert(0,'bigint'),(0,None))
        self.assertEqual(p.convert(0.0,'numeric'),('0.0',None))

    def test_no_uuid_fabrication(self):
        self.assertEqual(p.convert(7,'uuid'),(None,'UUID_IDENTITY_MAPPING_REQUIRED'))

    def test_decimal_no_rounding(self):
        self.assertEqual(p.convert('1.1234567890123456789','numeric'),('1.1234567890123456789',None))

    def test_paise_conversion_never_rounds(self):
        self.assertEqual(p.exact_paise('12.34'),1234)
        self.assertIsNone(p.exact_paise('12.345'))

    def test_status_projection_is_explicit(self):
        self.assertEqual(p.STATUS_PROJECTIONS['tasks']['Started'],'IN_PROGRESS')
        self.assertNotIn('invoices',p.STATUS_PROJECTIONS)

    def test_financial_preserves_header_and_payment(self):
        rows={'invoices':[{'id':1,'invoice_no':'X','subtotal':200,'discount':1,'gst_amount':18,'total':217,'status':'Pending'}],
              'invoice_items':[{'invoice_id':1,'qty':1,'rate':100,'archived_at':None}],
              'payments':[{'id':2,'invoice_id':1,'amount':17,'voided_at':None}]}
        before=p.canonical(rows);r=p.financial(rows)[0]
        self.assertEqual(r['difference_stored_minus_lines'],'100')
        self.assertEqual(r['stored_total_minus_payments'],'200')
        self.assertEqual(before,p.canonical(rows))

    def test_full_manifest_deterministic_and_redacted(self):
        a=p.plan(p.ROOT/'public/workshopos-demo.sqlite');b=p.plan(p.ROOT/'public/workshopos-demo.sqlite')
        self.assertEqual(p.canonical(a),p.canonical(b))
        self.assertEqual(len(a['manifest']),3241)
        self.assertEqual(len(a['sentinels']),61)
        self.assertEqual(a['summary']['invoice_discrepancies'],51)
        self.assertEqual(a['summary']['ready_to_import_records'],0)
        users=[r for r in a['manifest'] if r['source_table']=='users']
        self.assertTrue(all(r['source_payload']['password'].startswith('[CREDENTIAL EXCLUDED') for r in users))

    def test_financial_values_match_prior_52_invoice_baseline(self):
        actual=p.plan(p.ROOT/'public/workshopos-demo.sqlite')['financial']
        prior={r['invoice_id']:r for r in p.load('stage2-financial-reconciliation.json.md')['invoices']}
        for r in actual:
            old=prior[r['id']]
            for a,b in [('stored_subtotal','stored_subtotal'),('line_subtotal','line_subtotal_exact'),('stored_tax','stored_tax'),('stored_total','stored_total')]:
                self.assertEqual(p.Decimal(str(r[a])),p.Decimal(str(old[b])))
            self.assertEqual(r['stored_status'],old['invoice_status'])


if __name__=='__main__':unittest.main()
