import type { NextApiRequest, NextApiResponse } from 'next'
import { Project} from "@visual-regression-shared/shared/helpers/listProjectsOfUser";
import {Build, listBuildsOfProject} from "@visual-regression-shared/shared/helpers/listBuildsOfProject";
import {getProjectyId} from "@visual-regression-shared/shared/helpers/getProjectById";

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const {id: projectId} = req.query as {id: string};
    const formattedProjectId: number = parseInt(projectId, 10);

    // const project = await getProjectyId(formattedProjectId);
    // const builds = await listBuildsOfProject(formattedProjectId);

    res.status(200).send({
        builds: [],
        project: projectId
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{project: Project, builds: Build[]} | undefined>
) {
    if(req.method === "GET") {
        return getHandler(req, res);
    }

    console.log('unsupported http method');
    res.status(405).send(undefined);
};
