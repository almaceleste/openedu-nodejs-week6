import x from 'express';
import m from 'mongoose';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';

import router from './router.js';
import UserModel from './models/User.js';

export { App as default, code, sha1, getData, insertOne };

const headers = 'Content-Type, Accept, Access-Control-Allow-Headers,\
    login, password, URL';
const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': headers,
    'Access-Control-Expose-Headers': headers,
};
const User = UserModel();
// application
function App(express, bodyParser, fs, crypto, http) {
    const app = x();
    // const app = express();
    app.port = process.env.PORT || 3000;

    app
        .use(cors)
        .use(bodyParser.urlencoded({ extended: true }))
        .use('/', router)
        .get('/dummy-path/', (r) => {
        })
        .use(finalhandler);

    return app;
}

// functions: local
function cors(req, res, next) {
    res.status(200).set(CORS);
    next();
}

function finalhandler(req, res) {
    res.send('hessian');
}

// functions: export
function code(req, res) {
    fs.readFile(import.meta.url.substring(7), (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404)
                    .end('NOT FOUND');
            }
            else {
                res.status(500).end('error:', err);
            }
        }
        else {
            res.end(data);
        }
    });
}

function sha1(r) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(r.params.input);
    r.res.send(sha1.digest('hex'));
}

function getData(url, res) {
    http.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
            res
                .set({
                    'Content-Type': 'text/plain; charset=utf-8',
                })
                .end(data);
        });
    });
}

// functions: mongodb
async function connect(url) {
    // connect mongodb
    try {
        await m.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log('mongoose:', error.codeName, error.message);
        return error;
    }
}

async function insertOne(login, password, url) {
    // connect mongodb
    try {
        await connect(url);
        const user = new User({ login, password });
        return await user.save();
    } catch (error) {
        console.log('mongoose:', error.codeName, error.message);
        return error;
    }
}

