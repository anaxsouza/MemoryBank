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
export declare function useStatus(url: string, interval: number): UseStatusReturn;
//# sourceMappingURL=use-status.d.ts.map