import AWS from "aws-sdk";
import {ListObjectsOutput} from "@aws-sdk/client-s3";

export async function readS3Files(bucket: string, folder: string = ''): Promise<ListObjectsOutput> {
    const s3 = new AWS.S3();

    console.log(folder)
    const params = {
        Bucket: bucket,
        // Delimiter: '/' + folder,
        Prefix: folder + '/',
        // Prefix: 's/5469b2f5b4292d22522e84e0/ms.files/'
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
