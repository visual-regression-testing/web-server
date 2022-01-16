import AWS from "aws-sdk";
import {ListObjectsOutput} from "@aws-sdk/client-s3";

export async function s3ListObjectsButNotRecursively(bucket: string, folder: string = ''): Promise<ListObjectsOutput> {
    const s3 = new AWS.S3();
    const params = {
        Bucket: bucket,
        Delimiter: '/',
        Prefix: folder,
    }

    return new Promise((resolve, reject) => {
        s3.listObjects(params, (err, data) => {
            if (err) {
                reject(err);
            }

            if (data) {
                resolve(data);
            }
        });
    });
}
