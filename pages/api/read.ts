import type { NextApiRequest, NextApiResponse } from 'next'
import {readS3Files} from "../../shared/helpers/readS3Files";
import {ListObjectsOutput} from "@aws-sdk/client-s3";
import config from '../../config/config';

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<ListObjectsOutput | void>
) {
    console.log('request to read images');

    try {
        const files = await readS3Files(config.bucket);
        res.status(200).send(files);
    } catch(e) {
        // todo
    }

    res.status(400).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ListObjectsOutput | void>
) {
    if(req.method === "GET") {
        return getHandler(req, res);
    }

    console.log('unsupported http method');
    res.status(405).send();
};
