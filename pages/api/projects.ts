import type { NextApiRequest, NextApiResponse } from 'next'
import {listProjectsOfUser, Project} from "@visual-regression-shared/shared/helpers/listProjectsOfUser";

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const {email} = req.query as {email: string};
    // const projects = await listProjectsOfUser(email);

    res.status(200).send({
        test: process.env.MYSQL_DATABASE
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Project[]>
) {
    if(req.method === "GET") {
        return getHandler(req, res);
    }

    console.log('unsupported http method');
    res.status(405).send([]);
};
