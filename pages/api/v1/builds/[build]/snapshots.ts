import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";
import {createSnapshot} from "../../../../../shared/helpers/createSnapshot";
import {InsertResponse} from "../../../../../config/db";

interface CreateSnapshotRequest {
    "data": {
        "type": "snapshots",
        "attributes": {
            "name": string, // "Snapshot 1" // is the test name
            "widths": [number, number] // [375,1280],
            "minimum-height": number // 1024,
            "enable-javascript": null
        },
        "relationships": {
            "resources": {
                "data": [
                    {
                        "type": "resources",
                        "id": "1500a3af7cb0f90700bd4da0e6dc57420e8e7717d2575bc3e69a84530d1332cb",
                        "attributes": {
                            "resource-url": "http://localhost:3000/",
                            "is-root": true,
                            "mimetype": "text/html"
                        }
                    },
                    {
                        "type": "resources",
                        "id": "393ff5f609a837205f4f1551a333993c95dfe3e18d0f621f97b7555bc9e0d900",
                        "attributes": {
                            "resource-url": "/percy.1643583104917.log",
                            "is-root": null,
                            "mimetype": "text/plain"
                        }
                    }
                ]
            }
        }
    }
}

// todo not right, it includes CreateSnapshot - how to have overlapping interfaces

interface CreateSnapshotOutput2 {
    "data": {
        "type": "snapshots",
        "id": number,
        "attributes": {
            "name": string;
            "review-state": null,
            "review-state-reason": null,
            "fingerprint": null,
            "total-open-comments": 0,
            "is-reintroduced": false,
            "enable-javascript": false
        },
        "links": {
            "self": string;
        },
        "relationships": {
            "build": {
                "data": {
                    "type": "builds",
                    "id": "15336003" // is this build ID?
                }
            },
            "latest-changed-ancestor": {
                "links": {
                    "related": string;
                }
            },
            "screenshots": {},
            "comparisons": {
                "data": [
                    {
                        "type": "comparisons",
                        "id": "1424400220"
                    },
                    {
                        "type": "comparisons",
                        "id": "1424400221"
                    }
                ]
            },
            "missing-resources": {
                "links": {
                    "self": string;
                    "related": string;
                },
                "data": [
                    {
                        "type": "resources",
                        "id": "1500a3af7cb0f90700bd4da0e6dc57420e8e7717d2575bc3e69a84530d1332cb" // resource id to get HTML
                    }
                ]
            }
        }
    },
    "included": [
        {
            "type": "resources",
            "id": string;
            "links": {
                "self": string;
            }
        }
    ]
}

async function postHandler(
    req: NextApiRequest,
    res: NextApiResponse<CreateSnapshotOutput2 | undefined>
) {
    fs.writeFileSync('tmp/logs/build-snapshots.log', req.body)

    // it returns it and has additional parameters
    const parsedBody: CreateSnapshotRequest = JSON.parse(req.body);
    let createdSnapshotId: number = 0;

    try {
        const snapshotCreatedResponse: InsertResponse = await createSnapshot(req.body);
        createdSnapshotId = snapshotCreatedResponse.insertId;
    } catch(e) {
        res.status(400).send(undefined);
    }

    // test code
    // todo this is pretty hacky still
    const newBodyResponse: CreateSnapshotOutput2 =  {
        "data": {
            "type": "snapshots",
            "id": createdSnapshotId,
            "attributes": {
                "name": parsedBody.data.attributes.name,
                "review-state": null,
                "review-state-reason": null,
                "fingerprint": null,
                "total-open-comments": 0,
                "is-reintroduced": false,
                "enable-javascript": false
            },
            "links": {
                "self": `/api/v1/snapshots/${createdSnapshotId}`
            },
            "relationships": {
                "build": {
                    "data": {
                        "type": "builds",
                        "id": "15336003"
                    }
                },
                "latest-changed-ancestor": {
                    "links": {
                        "related": `/api/v1/snapshots/${createdSnapshotId}/latest-changed-ancestor`
                    }
                },
                "screenshots": {},
                "comparisons": {
                    "data": [
                        {
                            "type": "comparisons",
                            "id": "1424400220"
                        },
                        {
                            "type": "comparisons",
                            "id": "1424400221"
                        }
                    ]
                },
                "missing-resources": {
                    "links": {
                        "self": `/api/v1/snapshots/${createdSnapshotId}/relationships/missing-resources`,
                        "related": `/api/v1/snapshots/${createdSnapshotId}/missing-resources`
                    },
                    "data": [
                        {
                            "type": "resources",
                            "id": parsedBody.data.relationships.resources.data[0].id
                        }
                    ]
                }
            }
        },
        "included": [
            {
                "type": "resources",
                "id": parsedBody.data.relationships.resources.data[0].id,
                "links": {
                    "self": `/api/v1/resources/${parsedBody.data.relationships.resources.data[0].id}`
                }
            }
        ]
    }

    res.status(201).send(newBodyResponse);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CreateSnapshotOutput2 | undefined>
) {
    if (req.method === 'POST') {
        return postHandler(req, res);
    }

    res.status(405);
};
