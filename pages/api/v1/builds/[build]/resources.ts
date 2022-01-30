import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    console.log('####### handle request')

    const t = JSON.parse(req.body);

    fs.writeFileSync('resources.log', req.body);


    res.status(201).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    return getHandler(req, res);
};
