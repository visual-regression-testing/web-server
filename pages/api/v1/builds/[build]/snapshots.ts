import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";

interface Resource {
    type: string;
    id: string;
    attributes: {
        'resource-url': string;
        'is-root': boolean;
        'mimetype': string;
    };
}

interface CreateSnapshot {
    data: {
        type: string; // 'snapshots',
        attributes: {
            name: string | null; // name || null,
            widths: unknown | null; // widths || null,  todo pretty sure it's an array of number
            'minimum-height': number | null; // minHeight || null,
            'enable-javascript': boolean | null; // enableJavaScript || null
        },
        relationships: {
            resources: {
                data: Resource[];
            };
        }
    }
}

// todo not right, it includes CreateSnapshot - how to have overlapping interfaces

interface CreateSnapshotOutput2 {
    "data": {
        "type": "snapshots",
        "id": "866690723" | "123", // build id
        "attributes": {
            "name": "Snapshot 1",
            "review-state": null,
            "review-state-reason": null,
            "fingerprint": null,
            "total-open-comments": 0,
            "is-reintroduced": false,
            "enable-javascript": false
        },
        "links": {
            "self": "/api/v1/snapshots/866690723"
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
                    "related": "/api/v1/snapshots/866690723/latest-changed-ancestor"
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
                    "self": "/api/v1/snapshots/866690723/relationships/missing-resources",
                    "related": "/api/v1/snapshots/866690723/missing-resources"
                },
                "data": [
                    {
                        "type": "resources",
                        "id": "ec905d26fb30ef0cffdc5f5daec42a930efdbcb715eb9d793441896d719e69be" // resource id to get HTML
                    }
                ]
            }
        }
    },
    "included": [
        {
            "type": "resources",
            "id": "5bb1c26218c6838a56bc1f0c99a1a5c2977ff2f013e248ef77b9e7267ecb1c54",
            "links": {
                "self": "/api/v1/resources/5bb1c26218c6838a56bc1f0c99a1a5c2977ff2f013e248ef77b9e7267ecb1c54"
            }
        }
    ]
}

async function getHandler(
    req: NextApiRequest,
    res: NextApiResponse<CreateSnapshotOutput2>
) {

    console.log('builds [build] snapshots called', req.url);
    // console.log(req.body)

    // it returns it and has additional parameters
    const parsedBody: CreateSnapshot = JSON.parse(req.body);

    fs.writeFileSync('test2.log', req.body);

    // test code
    const newBodyResponse: CreateSnapshotOutput2 =  {
        "data": {
            "type": "snapshots",
            "id": "123", // hack // todo
            "attributes": {
                "name": "Snapshot 1",
                "review-state": null,
                "review-state-reason": null,
                "fingerprint": null,
                "total-open-comments": 0,
                "is-reintroduced": false,
                "enable-javascript": false
            },
            "links": {
                "self": "/api/v1/snapshots/866690723"
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
                        "related": "/api/v1/snapshots/866690723/latest-changed-ancestor"
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
                        "self": "/api/v1/snapshots/866690723/relationships/missing-resources",
                        "related": "/api/v1/snapshots/866690723/missing-resources"
                    },
                    "data": [
                        {
                            "type": "resources",
                            "id": "ec905d26fb30ef0cffdc5f5daec42a930efdbcb715eb9d793441896d719e69be"
                        }
                    ]
                }
            }
        },
        "included": [
            {
                "type": "resources",
                "id": "5bb1c26218c6838a56bc1f0c99a1a5c2977ff2f013e248ef77b9e7267ecb1c54",
                "links": {
                    "self": "/api/v1/resources/5bb1c26218c6838a56bc1f0c99a1a5c2977ff2f013e248ef77b9e7267ecb1c54"
                }
            }
        ]
    }

    res.status(201).send(newBodyResponse);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CreateSnapshotOutput2>
) {
    return getHandler(req, res);
};
