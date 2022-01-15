// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";

import {PassThrough} from "stream";
import AWS from 'aws-sdk';
import {uploadToS3} from "../../shared/helpers/uploadToS3";
import {readS3Files} from "../../shared/helpers/readS3Files";

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
  console.log('request to upload image');

  try {
    await uploadToS3(req, 'visual-regression-testing-test');
    res.status(201).send();
  } catch(e) {
    // todo
  }


  res.status(400).send();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
  if(req.method === "POST") {
    return postHandler(req, res);
  }

  console.log('unsupported http method');
  res.status(405).send();
};
