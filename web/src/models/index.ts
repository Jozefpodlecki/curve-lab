
export interface LoadResult {
    id: string;
    appName: string,
    rustVersion: string,
    githubLink: string,
    version: string,
	loadedOn: string;
}

export interface Session {
    id: string;
    version: string,
	loadedOn: string;
}