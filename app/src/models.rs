use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub struct AppContext {
    pub id: Uuid,
    pub app_name: String,
    pub github_link: String,
    pub version: String,
    pub loaded_on: DateTime<Utc>,
}

#[derive(Debug, Default, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadResult {
    pub id: Uuid,
    pub app_name: String,
    pub github_link: String,
    pub version: String,
    pub loaded_on: DateTime<Utc>,
}
