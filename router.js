import express from 'express';
import * as app from './app.js';

export { router as default };

const router = express.Router();
router
    .route('/code/')
    .get(app.code);

router
    .route('/sha1/:input/')
    .get(app.sha1);

router
    .route('/req/')
    .get((r) => {
        app.getData(r.query.addr, r.res);
    })
    .post((r) => {
        app.getData(r.body.addr, r.res);
    });

router
    .route('/insert/')
    .get((r) => {
        r.res.status(405).send('Method Not Allowed. Use method POST instead.');
    })
    .post(async (r) => {
        // r.res.send(JSON.stringify({
        //     login: r.body.login,
        //     password: r.body.password,
        //     url: r.body.URL
        // }));
        const record = await app.insertOne(
            r.body.login,
            r.body.password,
            r.body.URL
        );
        if (record.e) {
            r.res.send(`error: ${record}`);
        }
        else {
            r.res.send(`record ${record._id} created successful`);
        }
});
