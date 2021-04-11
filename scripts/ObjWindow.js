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

        // Get load button click from the object editor
        $("#load-obj-bttn").on("click", event => this._LoadObject(event));

        // Get load button click from the target editor
        $("#load-tar-bttn").on("click", event => this._LoadTarget(event));
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
        bodyData["type"] = "Collidable";
        let requestData = new Request();
        requestData.userid = $("#id-placeholder").val();

        // Transform payload to JSONString
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
    }

    handleServerResponseObj(data) {
        let assert = true;
        let dataParsed = JSON.parse(data);

        if (dataParsed.error == 3) {

            // Overwriting error
            if (confirm(' A file with your suggested name was found... Do you want to overwrite the file?')) {
                overwriteSave = true;
                // Submit and save to server even if overwritting an existing file
                $("#object-form").submit();
            }
        } else if (dataParsed.error == 2) {
            // Not found user error
            alert("User is not found in the server");
        } else if (dataParsed.error == 0) {
            // Saved
            alert("Successfully saved file");
        } else {
            // File System error
            alert("Data couldn't be saved");
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

    // LOAD OBJECT METHODS //
    _LoadObject(event) {
        event.preventDefault();

        // get filename
        let filename = $("#objName").val();

        // Build request data
        let requestData = new Request();
        requestData.userid = $("#id-placeholder").val();
        requestData.name = filename;
        requestData.type = "object";

        //send to server
        $.post("/api/load", requestData, this._HandleLoadObject);

    }

    _HandleLoadObject(data) {
        let dataParsed = JSON.parse(data);

        if (dataParsed.error < 1) {
            //No error
            let payload = JSON.parse(dataParsed.payload);
            $("#objName").val(payload.name);
            $("#obj-shape").val(`${payload.shape}`).change();
            $("#obj-texture").val(`${payload.texture}`).change();
            $("#objHeight").val(payload.height);
            $("#objWidth").val(payload.width);
            $("#objMass").val(payload.mass);

            return;
        }
        // Error
        alert("Object couldn't be found on server");
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

        bodyData["type"] = "Target";

        let requestData = new Request();
        requestData.userid = $("#id-placeholder").val();
        requestData.payload = JSON.stringify(bodyData);
        requestData.type = "target";
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
        if (dataParsed.error == 3) {

            // Overwriting error
            if (confirm(' A file with your suggested name was found... Do you want to overwrite the file?')) {
                overwriteSave = true;
                // Submit and save to server even if overwritting an existing file
                $("#target-form").submit();
            }
        } else if (dataParsed.error == 2) {
            // Not found user error
            alert("User is not found in the server");
        } else if (dataParsed.error == 0) {
            // Saved
            alert("Successfully saved file");
        } else {
            // File System error
            alert("Target couldn't be saved");
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

    // LOAD TARGET METHODS //
    _LoadTarget(event) {
        event.preventDefault();

        // get filename
        let filename = $("#tarName").val();

        // Build request data
        let requestData = new Request();
        requestData.userid = $("#id-placeholder").val();
        requestData.name = filename;
        requestData.type = "target";

        //send to server
        $.post("/api/load", requestData, this._HandleLoadObject);

    }

    _HandleLoadObject(data) {
        let dataParsed = JSON.parse(data);

        if (dataParsed.error < 1) {
            //No error
            let payload = JSON.parse(dataParsed.payload);
            $("#tarName").val(payload.name);
            $("#target-shape").val(`${payload.shape}`).change();
            $("#target-texture").val(`${payload.texture}`).change();
            $("#tarHeight").val(payload.height);
            $("#tarWidth").val(payload.width);
            $("#tarVal").val(payload.valueTarget);
            $("#tarMass").val(payload.mass);

            return;
        }
        // Error
        alert("Object couldn't be found on server");
    }
}