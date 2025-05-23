use chrono::NaiveDate;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadResult {
    pub app_name: String,
    pub github_link: String,
    pub version: String,
    pub loaded_on: DateTime<Utc>,
}
