// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";

import {PassThrough} from "stream";
import AWS from 'aws-sdk';

// do not delete
export const config = {
  api: {
    bodyParser: false
  }
};

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  // todo can we do better than https://github.com/node-formidable/formidable/blob/master/examples/store-files-on-s3.js
  const s3Client = new AWS.S3();

  const uploadStream = (file: any) => {
    const pass = new PassThrough();
    s3Client.upload(
        {
          Bucket: 'visual-regression-testing-test', // todo hardcode
          Key: file.originalFilename, // file.newFilename for generated filename without extension
          Body: pass,
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

  await new Promise((resolve, reject) => {
      const form = formidable({
          fileWriteStreamHandler: uploadStream as any,
      });

      form.parse(req, (callback) => {
          console.log(callback)
          res.status(201).send();
      });
  })

  res.status(400).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
  if(req.method === "POST") {
    return postHandler(req, res);
  }

  console.log('unsupported http method')
  res.status(405).send();
};
