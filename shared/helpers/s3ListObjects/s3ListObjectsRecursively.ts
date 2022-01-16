import AWS from "aws-sdk";
import {ListObjectsOutput} from "@aws-sdk/client-s3";

export async function s3ListObjectsRecursively(bucket: string, folder: string = ''): Promise<ListObjectsOutput> {
    const s3 = new AWS.S3();
    const params = {
        Bucket: bucket,
        // Delimiter: '/' + folder,
        Prefix: folder,
        // Prefix: 's/5469b2f5b4292d22522e84e0/ms.files/'
    }

    console.log(folder + '/')

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
