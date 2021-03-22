// Copyright (C) 2021 Gabriel Zamora
'use strict';

// FOR FUTURE IMPLEMENTATION, DEMO FROM CLASS //

export default class App {

    constructor() {
        //TODO set up fields to hold data

        //Set up event handler for form submit
        $("#fav-form").on('submit', event => this.handleSubmitForm(event));
    }

    handleSubmitForm(event) {
        event.preventDefault();

        // Do form type things
        let params = $(event.target).serialize();

        //get form data as js object
        let request = $(event.target).serializeArray();
        let bodyData = {};
        request.forEach(element => {
            bodyData[element.name] = element.value;

        });
        let requestData = JSON.stringify(bodyData);

        //send to server
        $.post("/api", requestData, this.handleServerResponse);

        //ok
        //$.post("/api", bodyData, this.handleServerResponse);

        //ok
        //$.post("/api", params, this.handleServerResponse);

    }

    handleServerResponse(data) {}

    run() {}
}