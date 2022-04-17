import type { NextApiRequest, NextApiResponse } from 'next'
import { Project} from "@visual-regression-shared/shared/helpers/listProjectsOfUser";
import { getProjectyId } from './shared/src/shared/helpers/getProjectById';
import { listBuildsOfProject } from './shared/src/shared/helpers/listBuildsOfProject';

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<{project: Project, builds: any[]} | undefined>
) {
    const {id: projectId} = req.query as {id: string};
    const formattedProjectId: number = parseInt(projectId, 10);

    const project = await getProjectyId(formattedProjectId);
    // const builds = await listBuildsOfProject(formattedProjectId);

    res.status(200).send({
        builds: [],
        project,
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{project: Project, builds: any[]} | undefined>
) {
    if(req.method === "GET") {
        return getHandler(req, res);
    }

    console.log('unsupported http method');
    res.status(405).send(undefined);
};
