import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";
import {checkAuth} from "../../../../shared/helpers/authorization/checkAuth";
import {createBuildByPercyToken} from "../../../../shared/helpers/createBuildByPercyToken";
import {getProjectByPercytToken} from "../../../../shared/helpers/getProjectByPercyToken";
import {Project} from "../../../../shared/helpers/listProjectsOfUser";

interface CreateBuildInput {
    data: {
        type: 'builds'; // 'builds',
        attributes: {
            branch: string; // this.env.git.branch,
            'target-branch': string; // this.env.target.branch,
            'target-commit-sha': string; // this.env.target.commit,
            'commit-sha': string; // this.env.git.sha,
            'commit-committed-at': string; // this.env.git.committedAt,
            'commit-author-name': string; // this.env.git.authorName,
            'commit-author-email': string; // this.env.git.authorEmail,
            'commit-committer-name': string; // this.env.git.committerName,
            'commit-committer-email': string; // this.env.git.committerEmail,
            'commit-message': string; // this.env.git.message,
            'pull-request-number': string; // this.env.pullRequest,
            'parallel-nonce': string; // this.env.parallel.nonce,
            'parallel-total-shards': string; // this.env.parallel.total,
            partial: string; // this.env.partial
        },
        relationships: unknown; // todo
    }
}

// todo not right
interface CreatedBuildOutput {
    data: {
        type: 'builds'; // todo is this returned in PErcy as well???
        id: number; // buildNumber
        attributes: {
             branch: string; // 'master',
            'build-number': number; // 116,
            partial: boolean; // false,
            'web-url': string; // 'https://percy.io/617adf68/admin-ui-test/builds/15071284',
            'commit-html-url': null; // null,
            'branch-html-url': null; // null,
            'pull-request-html-url': null; // null,
            state: string; // 'pending',
            'review-state': null; // null,
            'review-state-reason': null; // null,
            'is-pull-request': boolean; // false,
            'pull-request-number': null; // null,
            'pull-request-title': null; // null,
            'user-agent': string; // 'Percy/v1 @percy/client/1.0.0-beta.73 (node/v14.17.5)',
            'total-snapshots': null; // null,
            'total-snapshots-requesting-changes': number; // 0,
            'total-snapshots-unreviewed': null; // null,
            'total-comparisons': null; // null,
            'total-comparisons-finished': null; // null,
            'total-comparisons-diff': null; // null,
            'total-open-comments': number; // 0,
            'failure-reason': null; // null,
            'failure-details': null; // null,
            'parallel-nonce': null; // null,
            'parallel-total-shards': null; // null,
            'finished-at': null; // null,
            'approved-at': null; // null,
            'created-at': string; // '2022-01-18T02:24:08.000Z',
            'updated-at': string; // '2022-01-18T02:24:08.000Z'
        },
        relationships: unknown; // todo
    }
}

interface Error {
    message: string;
}

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<CreatedBuildOutput | Error>
) {
    // todo check for authorization header, although the Percy CLI checks for us
    const percyToken = checkAuth(req.headers.authorization as string);

    // todo common error handling
    if (!percyToken) {
        res.status(401).send({
            message: 'No authorization token',
        })
    }

    // it returns it and has additional parameters
    const parsedBody: CreateBuildInput = JSON.parse(req.body);

    fs.writeFileSync('./tmp/logs/build.log', req.body);

    const build: [{  id: number }] = await createBuildByPercyToken(percyToken);
    const project: [Project] | undefined = await getProjectByPercytToken(percyToken);

    // const response = await createBuildByPercyToken({
    //     branch: parsedBody.data.attributes.branch,
    //     pullRequestNumber: parsedBody.data.attributes['pull-request-number'],
    //     targetBranch: parsedBody.data.attributes["target-branch"]
    // });
    //
    // console.log(response);

    // todo proper output values, these were taken from Percy and are somewhat valid

    const newBodyResponse: CreatedBuildOutput = {
        data: {
            ...parsedBody.data, // todo correct?
            id: build[0].id, // this is the endpoint id, because we use the build number right now as the same thing, we'll use it here too
            attributes: {
                branch: 'master',
                'build-number': build[0].id, // todo generate id
                partial: false,
                // todo this the url of the build that's output to the UI
                // todo hardcoded to localhost
                'web-url': `http://localhost:3000/project/${(project as [Project])[0].id}/build/${build[0].id}`,
                'commit-html-url': null,
                'branch-html-url': null,
                'pull-request-html-url': null,
                state: 'pending',
                'review-state': null,
                'review-state-reason': null,
                'is-pull-request': false,
                'pull-request-number': null,
                'pull-request-title': null,
                'user-agent': 'Percy/v1 @percy/client/1.0.0-beta.73 (node/v14.17.5)',
                'total-snapshots': null,
                'total-snapshots-requesting-changes': 0,
                'total-snapshots-unreviewed': null,
                'total-comparisons': null,
                'total-comparisons-finished': null,
                'total-comparisons-diff': null,
                'total-open-comments': 0,
                'failure-reason': null,
                'failure-details': null,
                'parallel-nonce': null,
                'parallel-total-shards': null,
                'finished-at': null,
                'approved-at': null,
                'created-at': '2022-01-18T02:58:30.000Z',
                'updated-at': '2022-01-18T02:58:30.000Z'
            }
        },
    };

    res.status(201).send(newBodyResponse);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CreatedBuildOutput | Error>
) {
    return getHandler(req, res);
};
