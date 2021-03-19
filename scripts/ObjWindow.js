// Copyright (C) 2021 Gabriel Zamora
'use strict';


import Request from './Request.js';

// Overwrite flag for saving
var overwriteSave = false;

export default class ObjWindow {

    constructor() {
        // Get submit button click from the object editor
        $("#object-form").on("submit", event => this.handleSubmitFormObj(event));

        // Get submit button click from the target editor
        $("#target-form").on("submit", event => this.handleSubmitFormTarget(event));
    }


    /***OBJECT EDITOR FUNCTIONS***/
    handleSubmitFormObj(event) {
        event.preventDefault();

        // Do form type things
        let params = $(event.target).serialize();

        //get form data as js object
        let request = $(event.target).serializeArray();
        let bodyData = {};
        request.forEach(element => {
            bodyData[element.name] = element.value;

        });
        //let requestData = JSON.stringify(bodyData);

        let requestData = new Request();
        requestData.payload = JSON.stringify(bodyData);
        requestData.type = "object";
        requestData.name = bodyData.name;

        // Check overwrite flag
        if (overwriteSave == true) {
            requestData.rewrite = true;
            overwriteSave = false;
        }

        //send to server
        $.post("/api/save", requestData, this.handleServerResponseObj);

        //ok
        //$.post("/api", bodyData, this.handleServerResponse);

        //ok
        //$.post("/api", params, this.handleServerResponse);

    }

    handleServerResponseObj(data) {
        let assert = true;
        let dataParsed = JSON.parse(data);
        if (dataParsed.error == 1) {
            if (confirm(' A file with your suggested name was found... Do you want to overwrite the file?')) {
                console.log("yes");
                overwriteSave = true;
                //send to server
                $("#object-form").submit();
            }
        } else {
            alert("Successfully saved file");
        }
    }

    checkbttn() {

        // Get the object editor modal
        let modal = $("#object_modal");

        // Get the button that opens the modal
        let btn = $("#create-obj-bttn");

        // Open Modal
        btn.click(event => {
            modal.addClass("visible");
        });

        // To close object editor
        let span = $("#obj_win_close");

        // When the "x" in the modal is clicked, close the modal
        span.click(event => {
            modal.removeClass("visible");
        });

        this.checkObjectPrevbttn();

    }

    checkObjectPrevbttn() {

        // Check the preview button

        let previewObj = $("#prev-obj-bttn");

        previewObj.click(event => {
            event.preventDefault();

            let texture = $("#obj-texture :selected").text();
            let shape = $("#obj-shape option:selected").text();

            let editor = $("#preview-obj");
            // Reset classes
            editor.removeAttr("class");

            // Add new classes
            editor.addClass(`${texture}`);
            editor.addClass(`${shape}`);
        });
    }


    /***TARGET EDITOR FUNCTIONS***/

    handleSubmitFormTarget(event) {
        event.preventDefault();

        // Do form type things
        let params = $(event.target).serialize();

        //get form data as js object
        let request = $(event.target).serializeArray();
        let bodyData = {};
        request.forEach(element => {
            bodyData[element.name] = element.value;

        });
        //let requestData = JSON.stringify(bodyData);

        let requestData = new Request();
        requestData.payload = JSON.stringify(bodyData);
        requestData.type = "object";
        requestData.name = bodyData.name;

        // Check overwrite flag
        if (overwriteSave == true) {
            requestData.rewrite = true;
            overwriteSave = false;
        }

        //send to server
        $.post("/api/save", requestData, this.handleServerResponseTarget);

    }

    handleServerResponseTarget(data) {
        let dataParsed = JSON.parse(data);
        if (dataParsed.error == 1) {
            if (confirm(' A file with your suggested name was found... Do you want to overwrite the file?')) {
                console.log("yes");
                overwriteSave = true;
                //send to server
                $("#target-form").submit();
            }
        } else {
            alert("Successfully saved file");
        }
    }

    checkbttnForTarget() {
        // Get the object editor modal
        let modal = $("#target_modal");

        // Get the button that opens the modal
        let btn = $("#create-target-bttn");

        // Open Modal
        btn.click(event => {
            modal.addClass("visible");
        });

        // To close object editor
        let span = $("#target_win_close");

        // When the "x" in the modal is clicked, close the modal
        span.click(event => {
            modal.removeClass("visible");
        });

        this.checkTargetPrevbttn();
    }

    checkTargetPrevbttn() {

        // Check the preview button

        let previewObj = $("#prev-tar-bttn");

        previewObj.click(event => {
            event.preventDefault();

            let texture = $("#target-texture :selected").text();
            let shape = $("#target-shape option:selected").text();

            let editor = $("#preview-tar");
            // Reset classes
            editor.removeAttr("class");

            // Add new classes
            editor.addClass(`${texture}`);
            editor.addClass(`${shape}`);
        });
    }
}