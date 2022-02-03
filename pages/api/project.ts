import type { NextApiRequest, NextApiResponse } from 'next'
import { Project} from "../../shared/helpers/listProjectsOfUser";
import {Build, listBuildsOfProject} from "../../shared/helpers/listBuildsOfProject";
import {getProjectyId} from "../../shared/helpers/getProjectById";

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<{project: Project, builds: Build[]} | undefined>
) {
    const {id: projectId} = req.query as {id: string};
    const formattedProjectId: number = parseInt(projectId, 10);

    const project = await getProjectyId(formattedProjectId);
    const builds = await listBuildsOfProject(formattedProjectId);

    res.status(200).send({
        builds,
        project: (project as Project[])[0]
    } as { project: Project, builds: Build[]});
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
