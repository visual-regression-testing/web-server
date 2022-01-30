import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
    // it returns it and has additional parameters
    const parsedBody = JSON.parse(req.body);

    fs.writeFileSync('./tmp/logs/snapshot-finalize.log', req.body);

    const newBodyResponse = Object.assign({}, parsedBody, {
        data: {
            ...parsedBody.data,
            id: '123', // todo generated ID
        }
    })

    res.status(201).send(newBodyResponse);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    return getHandler(req, res);
};
