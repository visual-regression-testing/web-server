import Percy from "@percy/core";

(async() => {

    const percy = await Percy.start({
        loglevel: 'debug'
    });

    // todo cannot change this yet
    const test =
        `<html><head>
<title>My title</title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />
</head><body>hello world</body></html>`

    // https://docs.percy.io/docs/build-your-own-sdk
    await percy.snapshot({
        name: 'Snapshot 1',
        url: 'http://localhost:3000',
        // you can override the html and submit your own
        domSnapshot: test,
        clientInfo: 'my-sdk', // client info is the client that extends Percy like Cypress/Jest
        environmentInfo: 'my-lib', // usually package and package version
    })

    console.log('done!')
    await percy.stop();
})();
