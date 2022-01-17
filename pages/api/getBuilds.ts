import type { NextApiRequest, NextApiResponse } from 'next'
import {query} from "../../config/db";

export interface QueryResultBuild {
    baseline_branch: string;
    branch: string;
    build: number;
}

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<QueryResultBuild[] | void>
) {
    console.log('request to read images');
    const { project } = req.query as { project: string };

    let results;

    try {
        results = await query<QueryResultBuild[]>(
            `SELECT baseline_branch, branch, build, date_created FROM builds INNER JOIN projects ON builds.project_id = projects.id WHERE projects.name = ? ORDER BY builds.date_created LIMIT 1;`,
            [project]
        )
    } catch(e) {
        // todo
    }

    res.status(200).send(results);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<QueryResultBuild[] | void>
) {
    if(req.method === "GET") {
        return getHandler(req, res);
    }

    console.log('unsupported http method');
    res.status(405).send();
};
