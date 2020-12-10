import { Router } from 'express';
import * as app from './app.js';
import * as puppet from './puppet.js';

export { router as default };

const router = Router();
router
    .route('/code/')
    .get(app.code);

router
    .route('/sha1/:input/')
    .get(app.sha1);

router
    .route('/req/')
    .get(async (r) => {
        const data = await app.getData(r.query.addr);
        app.sendData(r.res, data);
    })
    .post(async (r) => {
        const data = await app.getData(r.body.addr);
        app.sendData(r.res, data);
    });

router
    .route('/insert/')
    .get((r) => app.notAllowed(r.res))
    .post(async (r) => {
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

router
    .route('/render/')
    .get((r) => app.notAllowed(r.res))
    .post(async (r) => {
        const view = await app.getData(r.query.addr);
        const data = {
            login: "hessian",
            random2: r.body.random2,
            random3: r.body.random3
        };
        r.res.send(app.render(view, data));
    });

router
    .route('/test/')
    .get(async (r) => {
        puppet.args.button = '#bt';
        puppet.args.input = '#inp';
        const result = await puppet.test(r.query.URL);
        r.res
            .set({Accept: 'text/plain'})
            .send(result);
    });
