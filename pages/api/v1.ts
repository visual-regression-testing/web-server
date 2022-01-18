import type { NextApiRequest, NextApiResponse } from 'next'

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {

    res.status(201).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    return getHandler(req, res);
};
