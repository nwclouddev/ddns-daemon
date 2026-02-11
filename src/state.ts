export interface ServiceState {
  lastCheck: string | null;
  currentWanIp: string | null;
  currentDnsIp: string | null;
  lastUpdate: string | null;
  lastError: string | null;
  updateCount: number;
}

export const state: ServiceState = {
  lastCheck: null,
  currentWanIp: null,
  currentDnsIp: null,
  lastUpdate: null,
  lastError: null,
  updateCount: 0,
};
