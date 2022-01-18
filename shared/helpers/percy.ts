import Percy from "@percy/core";

(async() => {

    const percy = await Percy.start({
        loglevel: 'debug'
    });

    // todo cannot change this yet
    const test =
        `<html><head></head><body>works</body></html>`

    console.log('NOW TAKE SNAPSHOT')
    await percy.snapshot({
        name: 'Snapshot 1',
        url: 'http://localhost:3000',
        // you can override the html and submit your own
        domSnapshot: test,
        clientInfo: 'my-sdk',
        environmentInfo: 'my-lib',
    })

    console.log('done!')
    await percy.stop();
})();
