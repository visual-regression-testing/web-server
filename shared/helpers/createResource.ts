import {query} from "../../config/db";

export async function createResource(hashId: string, base64Content: string): Promise<undefined> {
    try {
        return query(
            `INSERT INTO resources (hash_id, base64_content) VALUES (?, ?)`,
            [hashId, base64Content]
        )
    } catch(e) {
        // todo
    }
}
