import api from "@/lib/axios";

// If you want to connect to a real backend later, use this:
export const aiApi = {
  getAlerts: async () => {
    // Simulating a call to the backend
    // In production, you would do: return api.get('/ai/alerts');
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, type: 'PREDICTION', severity: 'HIGH', message: 'CPU Spike Expected on Auth-Service in 15m', action: 'SCALE_UP' },
          { id: 2, type: 'ANOMALY', severity: 'MEDIUM', message: 'Unusual traffic pattern from IP 192.168.x.x', action: 'INVESTIGATE' },
          { id: 3, type: 'OPTIMIZATION', severity: 'LOW', message: 'Database index fragmentation detected', action: 'REINDEX' },
        ]);
      }, 500);
    });
  }
};