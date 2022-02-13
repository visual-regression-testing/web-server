import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
    fs.writeFileSync('./tmp/logs/snapshot-finalize-get.log', req.body);

    res.status(200).send();
}

async function postHandler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
    // it returns it and has additional parameters
    const parsedBody = JSON.parse(req.body);
    const {snapshot} = req.query;

    fs.writeFileSync('./tmp/logs/snapshot-finalize-post.log', req.body);

    const newBodyResponse = Object.assign({}, parsedBody, {
        data: {
            ...parsedBody.data,
            id: snapshot, // todo not tested
        }
    })

    res.status(201).send(newBodyResponse);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {

    if (req.method === 'POST') {
        return postHandler(req, res);
    } else if (req.method === 'GET') {
        return getHandler(req, res);
    }

    res.status(405).send();
};
