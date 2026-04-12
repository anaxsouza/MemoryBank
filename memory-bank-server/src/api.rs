use axum::extract::{State};
use axum::response::Json;
use serde::Serialize;
use std::path::PathBuf;
use std::sync::Arc;

use crate::db::MemoryDb;
use crate::http_server::HealthResponse;
use crate::ingest::IngestService;

/// Shared application state for API handlers
#[derive(Clone)]
pub struct ApiState {
    pub health: HealthResponse,
    pub db: Arc<MemoryDb>,
    pub ingest: IngestService,
    pub db_path: PathBuf,
}

/// Full status response combining health, namespace info, memory stats, and ingest stats
#[derive(Debug, Serialize)]
pub struct StatusResponse {
    pub health: HealthResponse,
    pub namespace: NamespaceInfo,
    pub memories: MemoryStats,
    pub ingest: IngestStats,
}

#[derive(Debug, Serialize)]
pub struct NamespaceInfo {
    pub name: String,
    pub db_path: String,
    pub db_size_bytes: u64,
}

#[derive(Debug, Serialize)]
pub struct MemoryStats {
    pub total_count: i64,
    pub earliest_timestamp: Option<String>,
    pub latest_timestamp: Option<String>,
    pub unique_tags: Vec<String>,
    pub unique_keywords: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct IngestStats {
    pub turns_by_status: Vec<StatusCount>,
}

#[derive(Debug, Serialize)]
pub struct StatusCount {
    pub status: String,
    pub count: i64,
}

/// GET /api/status - Returns comprehensive server status
pub async fn handle_status(State(state): State<ApiState>) -> Json<StatusResponse> {
    let db_size = state.db.db_file_size(&state.db_path).unwrap_or(0);
    let total_count = state.db.count_memories().await.unwrap_or(0);
    let timestamp_range = state.db.memory_timestamp_range().await.unwrap_or(None);
    let unique_tags = state.db.unique_tags().await.unwrap_or_default();
    let unique_keywords = state.db.unique_keywords().await.unwrap_or_default();
    let turns_by_status = state.ingest.count_turns_by_status().await.unwrap_or_default();

    let (earliest_timestamp, latest_timestamp) = timestamp_range.unzip();
    let namespace_name = state.health.namespace.clone();

    let response = StatusResponse {
        health: state.health,
        namespace: NamespaceInfo {
            name: namespace_name,
            db_path: state.db_path.display().to_string(),
            db_size_bytes: db_size,
        },
        memories: MemoryStats {
            total_count,
            earliest_timestamp,
            latest_timestamp,
            unique_tags,
            unique_keywords,
        },
        ingest: IngestStats {
            turns_by_status: turns_by_status
                .into_iter()
                .map(|(status, count)| StatusCount { status, count })
                .collect(),
        },
    };

    Json(response)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn status_response_serializes_correctly() {
        let response = StatusResponse {
            health: HealthResponse {
                ok: true,
                namespace: "default".to_string(),
                port: 3737,
                llm_provider: "anthropic".to_string(),
                encoder_provider: "fast-embed".to_string(),
                llm_model_id: Some("Anthropic::claude-sonnet-4-6".to_string()),
                encoder_model_id: Some("FastEmbed::default".to_string()),
                version: "0.2.0",
            },
            namespace: NamespaceInfo {
                name: "default".to_string(),
                db_path: "/tmp/memory.db".to_string(),
                db_size_bytes: 81920,
            },
            memories: MemoryStats {
                total_count: 42,
                earliest_timestamp: Some("2026-04-01T00:00:00Z".to_string()),
                latest_timestamp: Some("2026-04-11T23:59:59Z".to_string()),
                unique_tags: vec!["project".to_string(), "rust".to_string()],
                unique_keywords: vec!["memory-bank".to_string()],
            },
            ingest: IngestStats {
                turns_by_status: vec![
                    StatusCount { status: "stored".to_string(), count: 38 },
                    StatusCount { status: "processing".to_string(), count: 1 },
                    StatusCount { status: "open".to_string(), count: 3 },
                ],
            },
        };

        let json = serde_json::to_string(&response).expect("serialize");
        assert!(json.contains("\"namespace\":\"default\""));
        assert!(json.contains("\"total_count\":42"));
        assert!(json.contains("\"stored\""));
    }
}
