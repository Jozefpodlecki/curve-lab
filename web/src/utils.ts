import { load } from "./api";
import { Session } from "./models";
import { VersionCheckResult } from "./types";

const SESSION_KEY = "session";

export async function checkSessionAndVersion(): Promise<VersionCheckResult | null> {
	const storedSession: Session | null = JSON.parse(localStorage.getItem(SESSION_KEY)!) || null;

	const result = await load();

	if (storedSession && result.id === storedSession.id) {
		return {
			type: "Latest",
		};
	}

	localStorage.setItem(SESSION_KEY, JSON.stringify(result));

    return null;
}