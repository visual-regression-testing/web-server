import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";

async function postHandler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    fs.writeFileSync('./tmp/logs/build-finalize.log', req.body);
    res.status(201).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    if (req.method === 'POST') {
        return postHandler(req, res);
    }

    res.status(405);
};
