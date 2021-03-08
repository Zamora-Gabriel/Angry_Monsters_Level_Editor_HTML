// Copyright (C) 2021 Gabriel Zamora
'use strict';

import Express from 'express'
import Path from 'path'
const __dirname = Path.resolve();
import HTTP from 'http'
import { Console } from 'node:console';

const PORT = 3000;

class Server {
    constructor() {
        this.api = Express();
        this.api.use(Express.json())
            .use(Express.urlencoded({ extended: false }))
            .use(Express.static(Path.join(__dirname, '.')));

        //Get home page
        this.api.get('/', (request, response) => {
            response.send('index.html');
        });

        this.api.get('/editor', (request, response) => {
            //Get editor pàge
            response.sendFile(Path.join(__dirname, 'editor.html'));
        });

        this.api.post('/api', (request, response) => {
            let assert = true;
            let params = request.params; //Data attached in the url "/api/:name/:value"
            let query = request.query; //Data attached as "?name=valkue&name?=val?"
            let data = request.body; //Data attached as a Json structure

            //pull info from request

            let food = data['fav-food'];
            let bev = data['fav-beverage'];
            let takeOut = data['fav-take-out']

            //do something



            //respond
        });


        this.api.post('/api/get_level_list', (request, response) => {
            let params = request.params; //Data attached in the url "/api/:name/:value"
            let query = request.query; //Data attached as "?name=valkue&name?=val?"
            let data = request.body; //Data attached as a Json structure

            let result = {
                error: 0,
                payload: ["data_1"]
            }
            response.send(JSON.stringify(result));
        })

        this.run();
    }


    run() {

        this.api.set('port', PORT);

        this.listener = HTTP.createServer(this.api);
        this.listener.listen(PORT);

        this.listener.on('listening', event => {

            let addr = this.listener.address();
            let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
            //Conditional  (expr ? val if true : val if fale)
            console.log(`Listening on ${bind}`);
        })
    }
}

const server = new Server();