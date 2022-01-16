import type { NextApiRequest, NextApiResponse } from 'next'
import {s3ListObjects} from "../../shared/helpers/s3ListObjects";
import {ListObjectsOutput} from "@aws-sdk/client-s3";
import config from '../../config/config';

const generateFolder = (project: string, baselineBranch: string): string => {
    return `${project}/${baselineBranch}`;
}

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<ListObjectsOutput | void>
) {
    console.log('request to read images');

    const { project, baselineBranch, branch } = req.query as { project: string, baselineBranch: string, branch: string};

    try {
        const files = await s3ListObjects(config.bucket, generateFolder(project, baselineBranch));
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
