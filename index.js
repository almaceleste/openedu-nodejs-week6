import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';

import App from './app.js';

const app = App(express, bodyParser, fs, crypto, http);
console.log('app:', app);

app.listen(app.port, logParams);

function logParams() {
    console.log('port:', app.port);
    console.log('pid:', process.pid);
    console.log('stack:');
    app._router.stack.forEach((mw) => {
        switch (mw.name) {
            case 'bound dispatch':
                console.log(`\t${mw.name}:`, mw.route.path);
                break;
            case 'router':
                console.log(`\t${mw.name}:`);
                mw.handle.stack.forEach((r) =>
                    console.log(`\t\t`, r.route.path));
                break;
            default:
                console.log(`\t${mw.name}`);
                break;
        }
    });
    console.log('-------');
}