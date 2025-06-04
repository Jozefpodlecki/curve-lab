import { LoadResult } from "@/models";
import { invoke } from "@tauri-apps/api/core";

export async function load(): Promise<LoadResult> {
    return invoke("load");
}