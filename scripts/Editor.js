// Copyright (C) 2021 Gabriel Zamora
'use strict';

//import { resolve } from "path";
import Request from './Request.js';
import LevelPackager from './LevelPackager.js';

// Check if object is inside the list to rise the flag (For draggables)
var cloneflag = 0;

// Overwrite flag
var overwriteSave = false;

export default class Editor {

    constructor() {

        //set up fields to hold data
        //TODO: the level itself is in the DOM
        this.gameObjectList = [];
        this.$dragTarget;
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
                    if (gameLevels.error != 0) {
                        this._showErrorDialog(gameLevels.error);
                        return;
                    }
                    // Shove all level names to Select level field
                    this._updateLevelList(gameLevels.payload);
                })
                .catch(error => { this._showErrorDialog(error) });
            // Object List update
            this._populateGameObjectList()
                .then(gameObjects => {
                    if (gameObjects.error != 0) {
                        this._showErrorDialog(gameObjects.error);
                        return;
                    }
                    //Build Sidebar with gameObjects
                    this._updateObjectList(gameObjects.payload);

                })
                .catch(error => { this._showErrorDialog(error) });
        });

    }


    run() {
        this._handleDraggables();
        //Handle user save level event
        // Get submit button click from the object editor
        $("#Details-form").on("submit", event => this._handleSaveLevel(event));
    }

    _showErrorDialog(error) {
        // Not found user error
        if (error == 2) { alert("User is not found in the server"); }

        // Load error
        alert("Data couldn't be loaded");
    }

    // RESET THE LEVEL'S AND OBJECT'S LISTS AS UPDATED//
    _resetSelectors() {
        const $levelSelect = $('#level-list');
        const $objectList = $('#object-list');

        $levelSelect.empty();
        $objectList.empty();
    }

    /*** LEVELS ***/

    _populateLevelList() {
        return new Promise((resolve, reject) => {

            // Build request
            let requestData = new Request();

            // Get user id
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
            // Debug names
            // console.log(item.name);
            let $option = $(`<option value="${item.name}"> ${item.name}</option>`);
            $optionList.append($option);
        });
    }

    /*** OBJECTS ***/

    _updateObjectList(objectList) {
        //Fill the object select

        objectList.forEach(item => {
            // Debug names
            // console.log(item.name);
            this._loadObjectsInSideBar(item)
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

    _loadObjectsInSideBar(gameObj) {
        return new Promise((resolve, reject) => { //parameters are functions too
            // Build request

            let filename = gameObj.name;
            // Build request

            let requestData = new Request();
            requestData.userid = $("#id-placeholder").val();
            requestData.name = filename;
            requestData.type = gameObj.type;

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

        // Unpack the payload and assign values
        let shape = dataParsed.shape;
        let texture = dataParsed.texture;
        let height = dataParsed.height;
        let width = dataParsed.width;
        let type = "target";
        //<div id="box-one" class="black-box draggable" draggable="true"></div>
        if (dataParsed.type == "Collidable") {
            type = "object";
        }
        let $option = $(`<li id="${dataParsed.name}"><div data-value="${dataParsed.name}" class="${shape} ${texture} ${type} draggable" 
        style="height: ${height}px; width: ${width}px;" draggable="true"></li>`);
        $objectList.append($option);
    }


    // END OF OBJECTS METHODS //

    _handleDraggables() {
        let left = 0;
        let top = 0;

        $(document)
            // Delegate for dynamic objects
            .on('mouseover', ".draggable", event => {
                // Change cursor
            })
            .on('dragstart', '.draggable', event => {
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
                let parentId = this.$dragTarget.parent().attr("id");
                if (this.$dragTarget.attr('data-value') == parentId) {
                    cloneflag = 1;
                } else {
                    cloneflag = 0;
                }

                //let offset = {};
                this.offset.x = event.clientX - Math.floor(event.target.offsetLeft);
                this.offset.y = event.clientY - Math.floor(event.target.offsetTop);
                // Old z-index
                this.z = this.$dragTarget.css("zIndex");
                // let z = event.target.style.zIndex;

            })
            .on('mouseout', '.dragabble', event => {
                // TODO: Change cursor back
            });

        $('#window-ed').on('dragover', (event) => {
            event.preventDefault();
            // set the cursor different, allow the drop to occur.
            left = `${event.clientX-this.offset.x}px`;
            top = `${event.clientY-this.offset.y}px`;
            //this.$dragTarget.css(this.__csFrom(left, top));
        });


        $('#window-ed').on('drop', (event) => {
            event.preventDefault();

            // Get item 
            let $el = $(this.$dragTarget);

            let value = this.$dragTarget.attr('data-value');

            if (cloneflag != 0) {
                this.$dragTarget.clone().appendTo(`#${value}`);
            }

            // Drop item
            $('#window-ed').append($el);
            $el.css(this.__csFrom(left, top));
        });

    }

    __csFrom(leftParam, topParam) {
        // Style for the draggable in editor window
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

        let Level = new LevelPackager();
        Level.buildLevel(bodyData);

        let requestData = new Request();
        requestData.userid = $("#id-placeholder").val();

        // Transform payload to JSONString
        requestData.payload = Level.serialize();
        requestData.type = "level";
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