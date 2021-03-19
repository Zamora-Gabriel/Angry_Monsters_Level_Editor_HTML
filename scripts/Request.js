// Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class Request {
    constructor(error = 0, errorMsg = "No Error") {
        this.userid = "", // eg pg15student
            this.name = "", // name of entity, no spaces, no extension
            this.type = "", // one of these two key strings
            this.payload = {}, // actual data in JSON format
            this.rewrite = false
    }

    /* //Response expected
    "name": "requested entity name",
    "payload": "JSONString" // actual data in JSON format 
    "bytes": "actual bytes read",
    "error": 0*/

    ok() {

        // Set to values representing true
        this.error = 0; // Error is false
        this.errorMsg = "No Error"

        return this;

    }

    error(code = 0, msg = "No Error") {

        this.error = code;
        this.errorMsg = msg;

        return this
    }
}