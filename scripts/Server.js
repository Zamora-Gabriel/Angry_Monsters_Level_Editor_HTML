// Copyright (C) 2021 Gabriel Zamora
'use strict';

import Express from 'express'
import Path from 'path'
const __dirname = Path.resolve();
import HTTP from 'http'
import FileSystem from 'fs-extra';
import Reply from './Reply.js';
import { fstat } from 'fs';

const PORT = 3000;

var userExists = false;

class Server {
    constructor() {
        this.title = "Angry Pigs";
        this.api = Express();
        this.api.use(Express.json())
            .use(Express.urlencoded({ extended: false }))
            .use(Express.static(Path.join(__dirname, '.')));

        //Get home page
        this.api.get('/', (request, response) => {
            response.send('index.html', { title: "Angry Pigs" });
        });

        this.api.get('/editor', (request, response) => {
            //Get editor pàge
            response.sendFile(Path.join(__dirname, 'editor.html'));
        });

        // GET LEVEL LIST //
        this.api.post('/api/get_level_list', (request, response) => {
            // let params = request.params; //Data attached in the url "/api/:name/:value"
            // let query = request.query; //Data attached as "?name=value&name?=val?"
            let data = request.body; //Data attached as a Json structure
            let reply = new Reply(1, "Don't use data");

            // Check if the user exists
            this.CheckUserId(data.userid);
            if (userExists == false) {
                reply.error(2, "User doesn't exist");
                response.send(reply.serialize());
                return;
            };

            let result = {
                payload: []
            }

            // Open some file
            let folder = "./data/Levels";

            // iterator
            let i = 0;

            // Search inside the folder for the file names
            FileSystem.readdirSync(`${folder}`).forEach(element => {
                result.payload[i] = { name: `${element.replace(".json",'')}`, filename: `${element}` };
                i++;
            });

            reply.payload = result.payload;
            reply.error(0, "No Error");
            response.send(reply.ok().serialize())
        });


        // GET OBJECT LIST //
        this.api.post('/api/get_object_list', (request, response) => {
            // let params = request.params; //Data attached in the url "/api/:name/:value"
            // let query = request.query; //Data attached as "?name=value&name?=val?"
            let data = request.body; //Data attached as a Json structure
            let reply = new Reply(1, "Don't use data");

            // Check if the user exists
            this.CheckUserId(data.userid);
            if (userExists == false) {
                reply.error(2, "User doesn't exist");
                response.send(reply.serialize());
                return;
            };

            let result = {
                payload: []
            }

            // Open some file
            let folder = "./data/library";

            // iterator
            let i = 0;

            // Search inside the folder for the file names
            FileSystem.readdirSync(`${folder}`).forEach(element => {
                if (element != "target") {
                    result.payload[i] = { name: `${element.replace(".json",'')}`, filename: `${element}`, type: "object" };
                    i++;
                }
            });

            // Search for targets
            folder += "/target";

            // Search inside the folder for the file names
            FileSystem.readdirSync(`${folder}`).forEach(element => {
                result.payload[i] = { name: `${element.replace(".json",'')}`, filename: `${element}`, type: "target" };
                i++;
            });

            reply.payload = result.payload;
            reply.error(0, "No Error");
            response.send(reply.ok().serialize());
        });


        // SAVE //
        this.api.post('/api/save', (request, response) => {

            // When called $.post('/api/save', {data to save})

            let parameters = request.body;

            let isNew = true;

            let reply = new Reply(1, "Don't use data");

            // Check if the user exists
            this.CheckUserId(parameters.userid);
            if (userExists == false) {
                reply.error(2, "User doesn't exist");
                response.send(reply.serialize());
                return;
            };

            // Open some file
            let folder = "./data";
            if (parameters.type == "object" || parameters.type == "target") {
                folder += "/library";
                if (parameters.type == "target") {
                    folder += "/target";
                }
            } else {
                folder += "/Levels";
            }



            // Search inside the folder for the file names
            FileSystem.readdirSync(`${folder}`).forEach(element => {
                if (parameters.name + ".json" == element) {
                    // The name of the file is being repeated, turn to false the new flag
                    isNew = false;
                }
            });

            // Return error as file already exists, ask user in handler if wants to overwrite
            if (isNew == false && parameters.rewrite == "false") {

                reply.error(3, "Overwrite error");

                response.send(reply.serialize());
            } else {
                FileSystem.writeFile(`${folder}/${parameters.name}.json`, parameters.payload);
                response.send(reply.ok().serialize());
            }
        });


        // LOAD //
        this.api.post('/api/load', (request, response) => {

            // When called $.post('/api/load', {data to load})

            let parameters = request.body;

            /*"userid": "valid vfs username", // eg pg15student
            "name": "filename", // name of entity, no spaces, no extension
            "type": "object" | "level", // one of these two key strings*/

            // Check if the user exists
            this.CheckUserId(parameters.userid);
            if (userExists == false) {
                reply.error(2, "User doesn't exist");
                response.send(reply.serialize());
                return;
            };

            let reply = new Reply(1, "Don't use data");

            // Open some file
            let folder = "./data";
            if (parameters.type == "object" || parameters.type == "target") {
                folder += "/library";
                if (parameters.type == "target") {
                    folder += "/target";
                }
            } else {
                folder += "/Levels";
            }

            try {
                let fileData = FileSystem.readFileSync(`${folder}/${parameters.name}.json`, `utf8`)
                    // If data is fine, add to the reply's payload
                reply.payload = fileData;

                response.send(reply.ok().serialize());
            } catch {
                reply.error(1, "No data");
                response.send(reply.serialize());
            }
        });




        this.run();
    }

    CheckUserId(userid) {
        // Open some file
        let folder = "./data/Users";

        // Search inside the folder for the file names
        FileSystem.readdirSync(`${folder}`).forEach(element => {
            if (userid + ".json" == element) {
                // User found
                userExists = true;
                return;
            }
            userExists = false;
        });
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