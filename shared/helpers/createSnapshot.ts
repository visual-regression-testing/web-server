import {query} from "../../config/db";

export async function createSnapshot(metadata: Object): Promise<undefined> {
    try {
        return query(
            `INSERT INTO snapshots (metadata) VALUES (?)`,
            [JSON.stringify(metadata)]
        )
    } catch(e) {
        // todo
    }
}
