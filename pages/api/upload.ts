import type { NextApiRequest, NextApiResponse } from 'next'
import {uploadToS3} from "../../shared/helpers/uploadToS3";

import configuration from '../../config/config';

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
    console.log('here to upload')
    await uploadToS3(req, configuration.bucket);
    res.status(201).send();
  } catch(e) {
    res.status(400).send();
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
