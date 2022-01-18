import type { NextApiRequest, NextApiResponse } from 'next'

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
    console.log('snapshots finalized called')
    console.log(req.body, req.query);
    // it returns it and has additional parameters
    const parsedBody = JSON.parse(req.body);

    console.log('^^^^', parsedBody)

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
