
export type VersionCheckResult = {
    type: "Checking";
    text: string;
} | {
    type: "Latest"
} | {
    type: "NewVersion"
    version: string;
}