// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora
'use strict';

import Request from './Request.js'
import EntityController from './EntityController.js'

var objectId = 0;

var targetId = 0;

// Levels to the game
export default class Level {
    constructor(world, name, user) {
        this.levelName = name;
        this.userName = user;
        this.controller = world;
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

            // TODO: change background after level is loaded


            return this.entityList;
        }
        // Error
        alert("Level couldn't be found on server");

        return this.entityList;
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
        let $option = $(`<div id="Cannon0" data-value="Cannon" class="rectangle cannon catapult draggable" 
         style="height: 200px; width: 200px; position: absolute; margin: 0px; left: 100px; 
         top: 500px;" draggable="true"></div>`);


        // Add it to the edit window
        $editArea.append($option);

        // Render cannon as square
        let thisItem = new EntityController(this.controller, $(`#Cannon0`), true, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
        this.entityList.push(thisItem);

    }

    __FillEditArea(entityLists) {
        let $editArea = $("#window-ed");


        // Fill objects
        entityLists.collidableList.forEach(item => {

            // Build the div object
            let $option = $(`<div id="Object${objectId}" data-value="${item.name}" class="${item.shape} ${item.texture} object draggable" 
            style="height: ${item.height}; width: ${item.width}; top: ${item.pos.y}; 
            left: ${item.pos.x}; position: absolute; margin: 0px;" draggable="true">`);

            // Add it to the edit window
            $editArea.append($option);

            let thisItem = new EntityController(this.controller, $(`#Object${objectId}`), false, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
            this.entityList.push(thisItem);

            objectId++;
        });

        // Fill targets
        entityLists.targetList.forEach(item => {

            // Build the div target
            let $option = $(`<div id="Target${targetId}" data-value="${item.name}" class="${item.shape} ${item.texture} target draggable" 
            style="height: ${item.height}; width: ${item.width}; top: ${item.pos.y}; 
            left: ${item.pos.x}; position: absolute; margin: 0px;" data-score="${item.valueTarget}" draggable="true">`);

            // Add it to the edit window
            $editArea.append($option);

            let thisItem = new EntityController(this.controller, $(`#Target${targetId}`), false, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
            this.entityList.push(thisItem)

            targetId++;
        });
    }

}