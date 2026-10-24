"""Run existing finance tests with the pending invoice required by DB guards."""
import runpy

suite = runpy.run_path('/slice/test_financial_workflows.py')
# The workflow suite settles/voids every native invoice it creates. The independent
# database suite's INSERT...SELECT negative check needs a native unpaid invoice.
# Create it through the existing API, never by bypassing business validation.
job = suite['new_job']()
invoice = suite['ok'](suite['send'](f'/jobs/{job}/invoice', suite['draft'](job)))
assert invoice['totals']['total'] > 1
runpy.run_path('/slice/test_financial_database.py')
