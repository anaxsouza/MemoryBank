import { useState, useEffect, useCallback } from 'react';

export interface HealthResponse {
  ok: boolean;
  namespace: string;
  port: number;
  llm_provider: string;
  encoder_provider: string;
  llm_model_id?: string;
  encoder_model_id?: string;
  version: string;
}

export interface NamespaceInfo {
  name: string;
  db_path: string;
  db_size_bytes: number;
}

export interface MemoryStats {
  total_count: number;
  earliest_timestamp?: string;
  latest_timestamp?: string;
  unique_tags: string[];
  unique_keywords: string[];
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface IngestStats {
  turns_by_status: StatusCount[];
}

export interface StatusData {
  health: HealthResponse;
  namespace: NamespaceInfo;
  memories: MemoryStats;
  ingest: IngestStats;
}

export interface UseStatusReturn {
  data: StatusData | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useStatus(url: string, interval: number): UseStatusReturn {
  const [data, setData] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${url}/api/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = (await response.json()) as StatusData;
      setData(result);
      setIsConnected(true);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
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
