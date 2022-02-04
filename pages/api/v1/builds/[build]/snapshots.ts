import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";

interface CreateSnapshotRequest {
    "data": {
        "type": "snapshots",
        "attributes": {
            "name": string, // "Snapshot 1"
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
        "id": "123", // build id I believe
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
                    "id": "15336003" // is this build ID?
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
                        "id": "1500a3af7cb0f90700bd4da0e6dc57420e8e7717d2575bc3e69a84530d1332cb" // resource id to get HTML
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
    fs.writeFileSync('tmp/logs/build-snapshots.log', req.body)

    // it returns it and has additional parameters
    const parsedBody: CreateSnapshotRequest = JSON.parse(req.body);

    // test code
    // todo this is pretty hacky still
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
                            "id": parsedBody.data.relationships.resources.data[0].id
                        }
                    ]
                }
            }
        },
        "included": [
            {
                "type": "resources",
                "id": "5bb1c26218c6838a56bc1f0c99a1a5c2977ff2f013e248ef77b9e7267ecb1c54", // todo is this the other resource?
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
