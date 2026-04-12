import { useState, useEffect, useCallback } from 'react';
export function useStatus(url, interval) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(`${url}/api/status`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = (await response.json());
            setData(result);
            setIsConnected(true);
            setError(null);
            setLastUpdated(new Date());
        }
        catch (err) {
            setIsConnected(false);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        finally {
            setIsLoading(false);
        }
    }, [url]);
    useEffect(() => {
        // Initial fetch
        fetchStatus();
        // Set up polling interval
        const timer = setInterval(fetchStatus, interval * 1000);
        return () => clearInterval(timer);
    }, [fetchStatus, interval]);
    return {
        data,
        isLoading,
        isConnected,
        error,
        lastUpdated,
    };
}
//# sourceMappingURL=use-status.js.map