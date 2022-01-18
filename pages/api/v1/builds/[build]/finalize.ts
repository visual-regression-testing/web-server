import type { NextApiRequest, NextApiResponse } from 'next'

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {

    console.log('builds [build] finalize called');
    console.log(req.body, req.query);
    res.status(201).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    return getHandler(req, res);
};
