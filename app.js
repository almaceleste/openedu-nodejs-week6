export default function App(express, bodyParser, fs, crypto, http) {
    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
    };
    const app = express();
    app.port = process.env.PORT || 3000;

    const router = express.Router();
    router
        .route('/sha1/:input/')
        .get(sha1);

    router
        .route('/req/:addr/')
        .get((r) => {
            getData(r.params.addr, r.res);
        });

    router
        .route('/req/')
        .get((r) => {
            getData(r.query.addr, r.res);
        })
        .post((r) => {
            getData(r.body.addr, r.res);
        });

    app
        .use(cors)
        .use(bodyParser.urlencoded({ extended: true }))
        .use('/', router)
        .get('/code/', code)
        .use(finalhandler);

    return app;
    // functions

    function cors(req, res, next) {
        res.status(200).set(CORS);
        next();
    }

    function code(req, res) {
        // console.log('code:', import.meta.url);
        res.send(
            // fs.readFileSync('./app.js')
            fs.readFileSync(import.meta.url.substring(7))
        );
    }

    function sha1(r) {
        const sha1 = crypto.createHash('sha1');
        sha1.update(r.params.input);
        r.res.send(sha1.digest('base64'));
    }

    function getData(url, res) {
        http.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => {
                console.log('http:', data);
                res
                    .set({
                        Accept: 'text/plain',
                    })
                    .send(data);
            });
        });
    }

    function finalhandler(req, res) {
        res.send('hessian');
    }
}

// export { App as default };