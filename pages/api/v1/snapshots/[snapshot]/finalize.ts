import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";
import {useRouter} from "next/router";

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
    // it returns it and has additional parameters
    const parsedBody = JSON.parse(req.body);
    const router = useRouter();
    const {snapshot} = router.query;

    fs.writeFileSync('./tmp/logs/snapshot-finalize.log', req.body);

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
    return getHandler(req, res);
};
