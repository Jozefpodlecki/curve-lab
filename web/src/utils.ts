import { load } from "./api";
import { Session, VersionCheckResult } from "./models";

const SESSION_KEY = "session";

export function updateSession(session: Session) {
	localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSessionFromLocalStorage(): Session | null {
	return JSON.parse(localStorage.getItem(SESSION_KEY)!) || null
}

export async function getSession(): Promise<Session> {
	const session = await load();

    return session;
}

export function getUpdateCheckCached(): VersionCheckResult {

	const threshold = 10 * 60 * 1000; 
	const session = getSessionFromLocalStorage();

	if(session) {
		const now = new Date();
		const updatedOn = new Date(session.updatedOn)
		const diff = now.getTime() - updatedOn.getTime();

		if(diff > threshold) {
			return { type: "Checking", text: "Checking for updates" }
		}
		else {
			return session.updateCheckResult;
		}
	}

	return { type: "Checking", text: "Checking for updates" };
}