import AWS from "aws-sdk";
import {PassThrough} from "stream";
import formidable, {FileJSON} from "formidable";
import {NextApiRequest} from "next";

// todo can we do better than https://github.com/node-formidable/formidable/blob/master/examples/store-files-on-s3.js
export function uploadToS3(req: NextApiRequest, bucket: string): Promise<void> {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS params not set');
    }
    // todo can we do better than https://github.com/node-formidable/formidable/blob/master/examples/store-files-on-s3.js
    const s3Client = new AWS.S3();
    const acceptableMimeTypes = ['image/jpeg', 'image/png'];

    const uploadStream = (file: FileJSON) => {
        if (!file.originalFilename) {
            throw new Error('does not have original filename');
        }

        if (file.mimetype && acceptableMimeTypes.includes(file?.mimetype)) {
            throw new Error('File does not have correct Mime Type')
        }

        const pass = new PassThrough();
        s3Client.upload(
            {
                Bucket: bucket, // todo hardcode
                Key: file.originalFilename, // file.newFilename for generated filename without extension
                Body: pass,
                ACL: 'public-read'
            },
            (err: any, data: any) => {
                if (err !== null) {
                    // todo
                    console.error('error occurred on push to S3');
                }

                if (data) {
                    // todo success!
                    console.log('successfully uploaded', data);
                }
            },
        );

        return pass;
    };

    return new Promise((resolve, reject) => {
        const form = formidable({
            fileWriteStreamHandler: uploadStream as any,
        });

        form.parse(req, (err, fields, files) => {
            console.log('parsed', fields);
            resolve();
        });

        // form.on('field', (fieldName, fieldValue) => {
        //     console.log(fieldName, fieldValue);
        // });
    })
}
