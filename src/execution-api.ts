import { operationsApi, operationalVersion } from './operations-api';
export const executionApi = {
  command(jobId: number, operation: string, values: unknown = {}, id?: number) {
    const table = operation.startsWith('task-') ? 'tasks' : operation.startsWith('followup-') ? 'followups' : 'qc_checks';
    return operationsApi.command<{id:number}>('/execution/command', { jobId, operation, values, ...(id ? {id} : {}), version: operationalVersion(id ? table : 'job_cards', id ?? jobId) });
  },
};

export async function runExecution(jobId: number, operation: string, values: unknown = {}, id?: number) {
  try { await executionApi.command(jobId, operation, values, id); return true; }
  catch (error) { window.alert(error instanceof Error ? error.message : 'Action failed'); return false; }
}
