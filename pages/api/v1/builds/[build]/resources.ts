import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import {createResource} from "../../../../../shared/helpers/createResource";

interface ResourceBody {
    "data": {
        "type": "resources",
        // sha256 hash of base64-content
        "id": string; // "2c0c04f85894ff1c80b6126fa5aff7b8576e700d814c43b30e2485949872719f",
        "attributes":
            {
                // base64 of content
                "base64-content": string; // "PGh0bWw+PGhlYWQ+PC9oZWFkPjxib2R5PmhlbGxvIHdvcmxkPC9ib2R5PjwvaHRtbD4="
            }
    }
}

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    fs.writeFileSync(`./tmp/logs/resources-${new Date().getTime()}.log`, req.body);
    const parsedBody: ResourceBody = JSON.parse(req.body);

    try {
        await createResource(parsedBody.data.id, parsedBody.data.attributes["base64-content"]);
        res.status(201).send();
    } catch(e) {
        res.status(401).send();
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse< void>
) {
    return getHandler(req, res);
};
