import {query} from '../../config/db';
import {Project} from './listProjectsOfUser';

export async function getProjectyId(projectId: number): Promise<any> {

    return `${process.env.GITHUB_ID} + ${process.env.MYSQL_PORT}`;

    try {
        return query<Project[]>(
            'SELECT name FROM projects WHERE id = ?',
            [projectId]
        );
    } catch(e) {
        // todo
    }
}
