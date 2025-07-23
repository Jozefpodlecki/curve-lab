use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tauri_plugin_updater::Update;
use uuid::Uuid;

pub struct AppContext {
    pub id: Uuid,
    pub app_name: String,
    pub github_link: String,
    pub version: String,
    pub loaded_on: DateTime<Utc>,
    pub updated_on: DateTime<Utc>,
    pub update_check_result: UpdateCheckResult,
    pub updater: Option<Update>
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type", content = "version")]
pub enum UpdateCheckResult {
    Checking,
    Latest,
    NewVersionOptional(String),
    NewVersion(String)
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadResult {
    pub id: Uuid,
    pub app_name: String,
    pub github_link: String,
    pub version: String,
    pub loaded_on: DateTime<Utc>,
    pub update_check_result: UpdateCheckResult
}
