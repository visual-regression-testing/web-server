import type { NextApiRequest, NextApiResponse } from 'next'

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    console.log('uploading resources');
    console.log(JSON.parse(req.body));

    res.status(201).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    console.log('handle request')
    return getHandler(req, res);
};
