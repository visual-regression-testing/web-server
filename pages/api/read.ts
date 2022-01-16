import type { NextApiRequest, NextApiResponse } from 'next'
import {s3ListObjects} from "../../shared/helpers/s3ListObjects";
import {ListObjectsOutput} from "@aws-sdk/client-s3";
import config from '../../config/config';
import { query } from '../../config/db'

interface Test {
    // project: string;
    // baseline_branch: string;
    // branch: string;
    // build: string; // todo number
    test_name: string;
}

export interface TestInformation {
    buildInformation: Test,
    images: [string, string, string];
}

const generateFolder = (project: string, baselineBranch: string): string => {
    return `${project}/${baselineBranch}`;
}

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<TestInformation[] | void>
) {
    console.log('request to read images');
    const { project, baselineBranch, branch } = req.query as { project: string, baselineBranch: string, branch: string};

    if (!project || !baselineBranch || !branch) {
        res.status(400).send();
    }

    let results: Test[] = [];

    try {
        // todo I have no idea if this properly sanitizes
        // todo it would be nice to make helper functions instead of just queries right here
        results = await query<Test[]>(
            `SELECT test_name FROM builds WHERE project = ? AND baseline_branch = ? AND branch = ?`,
            [project, baselineBranch, branch]
        )
    } catch(e) {
        // todo
    }

    let files: ListObjectsOutput = {};

    try {
         files = await s3ListObjects(config.bucket, generateFolder(project, baselineBranch));
         files.Contents = (files as any).Contents.filter((object: any) => object.Key.charAt(object.Key.length - 1) !== '/');


         console.log(files.Contents)
    } catch(e) {
        // todo
    }


    const testOutput: TestInformation[] = results.map(test => {
        // todo this isn't the greatest way of handling it but it might work for a while
        const images: string[] = (files as any).Contents.filter((object: any) => object.Key.match(/$/)).map((object: any) => object.Key);

        console.log(images)
        if (images.length > 3) {
            // todo handle
            console.error('bad')
            res.status(500).send();
        }

        return {
            buildInformation: test,
            images: images as [string, string, string],
        }
    });

    res.status(200).send(testOutput);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TestInformation[] | void>
) {
    if(req.method === "GET") {
        return getHandler(req, res);
    }

    console.log('unsupported http method');
    res.status(405).send();
};
