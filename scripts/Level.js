// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora
'use strict';

import Request from './Request.js'

// Levels to the game
export default class Level {
    constructor(name, user) {
        this.levelName = name;
        this.userName = user;

        this.entityList = [];
    }

    load() {
        return new Promise((resolve, reject) => {

            // get filename
            let filename = this.levelName;

            // Build request data
            let requestData = new Request();
            requestData.userid = this.userName;
            requestData.name = filename;
            requestData.type = "level";


            //send to server
            $.post("/api/load", requestData)
                .then(thisLevelData => JSON.parse(thisLevelData))
                .then(levelDataParsed => {
                    // if suceeded resolve
                    resolve(levelDataParsed);
                })
                .catch(error => {
                    //if not successfull reject (error)
                    reject(error);
                })
        })
    }

    handleLoadLevel(data) {

        if (data.error < 1) {
            //No error
            this.__loadLevelRetrieved(data.payload);

            // change background after level is loaded
            // $("#change-bkg").click();

            return;
        }
        // Error
        alert("Level couldn't be found on server");
    }


    __loadLevelRetrieved(payload) {

        payload = JSON.parse(payload);
        // Fill from submitted information
        this.__GetLevelInfo(payload);

        // Load cannon to level
        this.__LoadCannon(payload.catapult);

        // Fill for entityList
        this.__FillEditArea(payload.entityLists);

    }

    __GetLevelInfo(payload) {

        let name = payload.name;
        let bckg = payload.background;
        let ammo = payload.ammo;
        let oneStar = payload.star1;
        let twoStar = payload.star2;
        let threeStar = payload.star3;
    }

    __LoadCannon(cannon) {
        let $editArea = $("#window-ed");
        // Empty current edit area
        $editArea.empty();

        // Build Cannon object
        let $option = $(`<div data-value="Cannon" class="rectangle cannon catapult draggable" 
         style="height: 300px; width: 300px; position: absolute; margin: 0px; left: ${cannon.pos.x}; 
         top: ${cannon.pos.y};" draggable="true"></div>`);

        // Render cannon as square


        // Add it to the edit window
        $editArea.append($option);
    }

    __FillEditArea(entityLists) {
        let $editArea = $("#window-ed");


        // Fill objects
        entityLists.collidableList.forEach(item => {

            // Build the div object
            let $option = $(`<div data-value="${item.name}" class="${item.shape} ${item.texture} object draggable" 
            style="height: ${item.height}; width: ${item.width}; top: ${item.pos.y}; 
            left: ${item.pos.x}; position: absolute; margin: 0px;" draggable="true">`);

            // Add it to the edit window
            $editArea.append($option);
        });

        // Fill targets
        entityLists.targetList.forEach(item => {

            // Build the div target
            let $option = $(`<div data-value="${item.name}" class="${item.shape} ${item.texture} target draggable" 
            style="height: ${item.height}; width: ${item.width}; top: ${item.pos.y}; 
            left: ${item.pos.x}; position: absolute; margin: 0px;" data-score="${item.valueTarget}" draggable="true">`);

            // Add it to the edit window
            $editArea.append($option);
        });
    }

}