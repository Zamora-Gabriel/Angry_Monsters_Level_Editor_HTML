// Copyright (C) 2021 Gabriel Zamora
'use strict';

import Express from 'express'
import Path from 'path'
const __dirname = Path.resolve();
import HTTP from 'http'
import FileSystem from 'fs-extra';
import Reply from './Reply.js'

const PORT = 3000;

class Server {
    constructor() {
        this.title = "Angry Pigs";
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

        this.api.post('/api/get_level_list', (request, response) => {
            // FileSystem
        });

        this.api.post('/api/get_object_list', (request, response) => {});

        this.api.post('/api/save', (request, response) => {});

        this.api.post('/api/load', (request, response) => {

            // When called $.post('/api/load', {data to load})

            let parameters = request.body;

            /*"userid": "valid vfs username", // eg pg15student
            "name": "filename", // name of entity, no spaces, no extension
            "type": "object" | "level", // one of these two key strings*/

            let reply = new Reply(1, "Don't use data");

            // Open some file
            let folder = "./data";
            if (parameters.type == "object") {
                folder += "/library";
            }
            let fileData = FileSystem.readFile(`${folder}/${paramenters.name}.json`, `utf8`)
                .then(fileData => {
                    // If data is fine, add to the reply
                    reply.payload = fileData;
                })
                .catch(err => {
                    reply.error(1, "No data");
                })

            response.send(reply.ok().serialize());

        });

        this.api.post('/api', (request, response) => {

            let assert = true;
            let params = request.params; //Data attached in the url "/api/:name/:value"
            let query = request.query; //Data attached as "?name=value&name?=val?"
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
            let query = request.query; //Data attached as "?name=value&name?=val?"
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