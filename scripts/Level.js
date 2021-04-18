// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora
'use strict';

import Request from './Request.js'
import EntityController from './EntityController.js'

let objectId = 0;

let targetId = 0;

// Levels to the game
export default class Level {
    constructor(world, name, user) {
        this.levelName = name;
        this.userName = user;
        this.controller = world;
        this.entityList = [];
        this.levelInformation = {};
    }

    GetLevelInfo() {
        // get the level information
        return this.levelInformation;
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

            // Change background after level is loaded
            this.__changeBckg(data.payload);

            return this.entityList;
        }
        // Error
        alert("Level couldn't be found on server");

        return this.entityList;
    }

    __changeBckg(payload) {
        // Parse to JSON the payload
        payload = JSON.parse(payload);

        // get the background
        console.log(`${payload.background}`);

        // Get edit-window's classes
        let $editWin = $("#window-ed");
        let classList = $editWin.attr("class");
        let classArr = classList.split(/\s+/);

        // Change background
        $editWin.removeClass(classArr[1]);
        $editWin.addClass(payload.background);
    }


    __loadLevelRetrieved(payload) {

        payload = JSON.parse(payload);
        // Fill from submitted information
        this.__GetLevelInfo(payload);

        // Load cannon to level
        this.__LoadCannon();

        // Fill for entityList
        this.__FillEditArea(payload.entityLists);

    }

    __GetLevelInfo(payload) {

        this.levelInformation["name"] = payload.name;
        this.levelInformation["ammo"] = payload.ammo;
        this.levelInformation["oneStar"] = payload.star1;
        this.levelInformation["twoStar"] = payload.star2;
        this.levelInformation["threeStar"] = payload.star3;
    }

    __LoadCannon() {
        let $editArea = $("#window-ed");
        // Empty current edit area
        $editArea.empty();

        // Build Cannon object
        let $option = $(`<div id="Cannon0" data-value="Cannon" class="rectangle cannon catapult draggable" 
         style="height: 200px; width: 200px; position: absolute; margin: 0px; left: 100px; 
         top: 500px;" draggable="true"><div id="Aiming" class="round brachy" style="position: absolute; width: 50px; height: 50px;
         left: 250px; top: 0px;"></div>`);


        // Add it to the edit window
        $editArea.append($option);

        // Render cannon as square
        let thisItem = new EntityController(this.controller, $(`#Cannon0`), true, false, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
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

            let thisItem = new EntityController(this.controller, $(`#Object${objectId}`), false, false, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
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

            let thisItem = new EntityController(this.controller, $(`#Target${targetId}`), false, false, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
            this.entityList.push(thisItem)

            targetId++;
        });
    }

}