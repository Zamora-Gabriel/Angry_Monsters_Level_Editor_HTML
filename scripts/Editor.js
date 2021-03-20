// Copyright (C) 2021 Gabriel Zamora
'use strict';

//import { resolve } from "path";
import Request from './Request.js';

export default class Editor {

    constructor() {

        //set up fields to hold data
        //TODO: the level itself is in the DOM
        this.gameObjectList = [];

        this.offset = {
            x: 0,
            y: 0
        }

        // UPDATE INFORMATION = CALL GET FOR OBJECT LIST AND LEVEL LIST ON SERVER//
        $("#get-all-data").click(event => {
            this._resetSelectors();
            // Level List update
            this._populateLevelList()
                .then(gameLevels => {

                    // Shove all level names to Select level field
                    this._updateLevelList(gameLevels.__private__.payload);
                })
                .catch(error => { this._showErrorDialog(error) });
            // Object List update
            this._populateGameObjectList()
                .then(gameObjects => {

                    //Build Sidebar with gameObjects
                    this._updateObjectList(gameObjects.__private__.payload);

                })
                .catch(error => { this._showErrorDialog(error) });
        });

        //TODO: initialize all draggable stuff

        //TODO: Handle user save level event
    }


    run() {
        this._handleDraggables();
    }

    _showErrorDialog() {
        //TODO: build a dialog system for showing error messages
    }

    // RESET THE LEVEL'S AND OBJECT'S LISTS AS UPDATED//
    _resetSelectors() {
        const $levelSelect = $('#level-list');
        const $objectSelect = $('#object-select');

        $levelSelect.empty();
        $objectSelect.empty();
    }

    /*** LEVELS ***/

    _populateLevelList() {
        return new Promise((resolve, reject) => { //parameters are functions too
            //do some work

            let requestData = new Request();
            requestData.userid = $("#id-placeholder").val();

            $.post('/api/get_level_list', requestData)
                .then(theLevelList => JSON.parse(theLevelList))
                .then(LevelList => {
                    //if successfull resolve (data)
                    resolve(LevelList);
                })
                .catch(error => {
                    //if not successfull reject (error)
                    reject(error);
                })
        })
    }

    _updateLevelList(levelList) {
        //Fill the level list

        const $optionList = $('#level-list');
        levelList.forEach(item => {
            console.log(item.name);
            let $option = $(`<option value="${item.name}"> ${item.name}</option>`);
            $optionList.append($option);
        });
    }

    /*** OBJECTS ***/

    _updateObjectList(objectList) {
        //Fill the object select

        const $optionList = $('#object-select');
        objectList.forEach(item => {
            console.log(item.name);
            let $option = $(`<option value="${item.name}"> ${item.name}</option>`);
            $optionList.append($option);
            this._loadObjectsInSideBar(item.name)
                .then(gameObjects => {

                    //Build Sidebar with gameObjects
                    this._handleLoadObject(gameObjects.payload);

                })
                .catch(error => { this._showErrorDialog(error) });
        });
    }

    _populateGameObjectList() {
        return new Promise((resolve, reject) => { //parameters are functions too
            // Build request

            let requestData = new Request();
            requestData.userid = $("#id-placeholder").val();

            $.post('/api/get_object_list', requestData)
                .then(theObjectList => JSON.parse(theObjectList))
                .then(objectList => {
                    //if successfull resolve (data)
                    resolve(objectList);
                })
                .catch(error => {
                    //if not successfull reject (error)
                    reject(error);
                })
        })
    }

    _loadObjectsInSideBar(filename) {
        return new Promise((resolve, reject) => { //parameters are functions too
            // Build request


            // Build request

            let requestData = new Request();
            requestData.userid = $("#id-placeholder").val();
            requestData.name = filename;
            requestData.type = "object";

            $.post('/api/load', requestData)
                .then(theObjectList => JSON.parse(theObjectList))
                .then(objectList => {
                    //if successfull resolve (data)
                    resolve(objectList);
                })
                .catch(error => {
                    //if not successfull reject (error)
                    reject(error);
                })
        })
    }

    _handleLoadObject(data) {
        let dataParsed = JSON.parse(data);

        const $objectList = $('#object-list');
        console.log(dataParsed.name);
        // Unpack the payload and assign values
        let shape = dataParsed.shape;
        let texture = dataParsed.texture;
        let height = dataParsed.height;
        let width = dataParsed.width;
        //<div id="box-one" class="black-box draggable" draggable="true"></div>
        let $option = $(`<li name="${dataParsed.name}"><div class="${shape} ${texture}" style="height: ${height}, width: ${width}" draggable="true"></li>`);
        $objectList.append($option);
    }




    // END OF OBJECTS METHODS //

    _handleDraggables() {
        $(`#box-one`)
            .on('mouseover', event => {
                // Change cursor
            })
            .on('dragstart', event => {
                // get data to transfer
                let transferData = {
                    targetId: event.target.id,
                    gameParams: {}
                };

                // Attach transfer data to event
                event.originalEvent.dataTransfer.setData("text", JSON.stringify(transferData));
                event.originalEvent.dataTransfer.effectAllowed = "move";

                // Grab the offset
                this.$dragTarget = $(event.target);
                //let offset = {};
                this.offset.x = event.clientX - Math.floor(event.target.offsetLeft);
                this.offset.y = event.clientY - Math.floor(event.target.offsetTop);
                // Old z-index
                this.z = this.$dragTarget.css("zIndex");
                // let z = event.target.style.zIndex;

            })
            .on('mouseout', event => {
                // TODO: Change cursor back
            });

        $('#window-ed')
            .on('dragover', event => {
                event.preventDefault();

                console.log("hi2");
                //Update css for the dragTarget
                this.$dragTarget.css({
                    position: "absolute",
                    margin: "0px",
                    left: `${event.clientX - this.offset.x}px`,
                    top: `${event.clientY - this.offset.y}px`
                });
            })
            .on('drop', event => {
                event.preventDefault();

                //get embedded transferData
                let rawData = event.originalEvent.dataTransfer.getData("text");
                let transferData = JSON.parse(rawData);

                //Attach transferData.gameParams to something

                // Create a new element in right location

                let $el = $(`<div id="box-${id}" class="wood-box draggable" draggable="true"></div>`)
                $('#window-ed').addChild($el);

                $el.css(this.__csFrom(this.$dragTarget.css('left'), this.$dragTarget.css('top')));
            });
    }

    __csFrom(leftParam, topParam) {
        return {
            position: "absolute",
            margin: "0px",
            left: leftParam,
            top: topParam

        }
    }

    /*** SAVE LEVEL FUNCTIONS ***/

    _handleSaveLevel(event) {
        event.preventDefault();

        // Do form type things
        let params = $(event.target).serialize();

        //get form data as js object
        let request = $(event.target).serializeArray();
        let bodyData = {};
        request.forEach(element => {
            bodyData[element.name] = element.value;

        });

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
        $.post("/api/save", requestData, this._handleSaveResponse);
    }

    _handleSaveResponse(data) {
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

}