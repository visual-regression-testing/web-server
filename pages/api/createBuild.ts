import type { NextApiRequest, NextApiResponse } from 'next'
import {query} from "../../config/db";

export interface QueryResultBuild {
    baseline_branch: string;
    branch: string;
    build: number;
}

/**
 * @deprecated
 * @param branch
 * @param pullRequestNumber
 * @param targetBranch
 */
export const createBuild = async({ branch, pullRequestNumber, targetBranch, }: any) => {
    return query(`INSERT INTO builds (baseline_branch, branch, test_name) VALUES (? , ?, ?)`,
        [targetBranch, branch, 'tbd']);
}
