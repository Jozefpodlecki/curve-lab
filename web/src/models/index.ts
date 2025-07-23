export type VersionCheckResult = {
    type: "Checking";
    text: string;
} | {
    type: "Latest"
} | {
    type: "NewVersion" | "NewVersionOptional"
    version: string;
}

export interface LoadResult {
    id: string;
    appName: string,
    rustVersion: string,
    githubLink: string,
    version: string,
	loadedOn: string;
    updatedOn: string;
    updateCheckResult: VersionCheckResult
}

export interface Session {
    id: string;
    version: string,
	loadedOn: string;
    updatedOn: string;
    updateCheckResult: VersionCheckResult
}