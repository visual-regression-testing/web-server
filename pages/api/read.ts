import type { NextApiRequest, NextApiResponse } from 'next'
import {ListObjectsOutput} from "@aws-sdk/client-s3";
import config from '@visual-regression-shared/config/config';
import { query } from '@visual-regression-shared/config/db'
import {s3ListObjects} from "@visual-regression-shared/shared/helpers/s3ListObjects";

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

const generateFolder = (...directories: string[]): string => {
    return directories.map(i => i + '/').join('');
}

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<TestInformation[] | void>
) {
    console.log('request to read images');
    const { project, baselineBranch, branch, build } = req.query as { project: string, baselineBranch: string, branch: string, build: string};

    if (!project || !baselineBranch || !branch || !build) {
        res.status(400).send();
    }

    let results: Test[] = [];

    try {
        // todo I have no idea if this properly sanitizes
        // todo it would be nice to make helper functions instead of just queries right here
        results = await query<Test[]>(
            `SELECT test_name FROM builds INNER JOIN projects ON builds.project_id = projects.id WHERE projects.name = ? AND baseline_branch = ? AND branch = ? AND build = ?;`,
            [project, baselineBranch, branch, build]
        )
    } catch(e) {
        // todo
    }

    let files: ListObjectsOutput = {};
    let filesMerged: string[] = [];

    try {
        // get the baseline image
        const baselineImages: ListObjectsOutput = await s3ListObjects(config.bucket, generateFolder(project, baselineBranch), {
            Delimiter: '/',
        });

        files = await s3ListObjects(config.bucket, generateFolder(project, baselineBranch, branch, build));
        // removes directories
        files.Contents = (files as any).Contents.filter((object: any) => object.Key.charAt(object.Key.length - 1) !== '/');

        // map the images together

        filesMerged = [...(baselineImages as any).Contents.map((object: any) => object.Key), ...(files as any).Contents.map((object: any) => object.Key)];
    } catch(e) {
        // todo
    }


    const testOutput: TestInformation[] = results.map(test => {
        // todo this isn't the greatest way of handling it but it might work for a while
        // todo this is limited to png
        const re = new RegExp(`${test.test_name}\.png$`);
        const images: string[] = filesMerged.filter(filename => filename.match(re));

        if (images.length !== 3) {
            // todo handle better
            console.error('bad error')
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
