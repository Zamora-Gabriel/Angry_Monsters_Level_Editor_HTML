// Copyright (C) 2021 Gabriel Zamora
'use strict';

import { resolve } from "path";

export default class Editor {

    constructor() {

        //set up fields to hold data
        //TODO: the level itself is in the DOM
        this.gameObjectList = [];

        //Fetch the list of levels
        this._populateLevelList();

        //fetch list of GameObjects
        this._populateGameObjectList()
            .then(gameObjects => {

                //Build Sidebar with gameObjects
            })
            .catch(error => { this._showErrorDialog(error) });
        /*
        
        ideally 

        this.gameObjectList = new GameObjectList();
        this.gameObjectList.populate();

        */
        //TODO: initialize all draggable stuff

        //TODO: Handle user save events
    }


    run() {}

    _showErrorDialog() {
        //TODO: build a dialog system for showing error messages
    }

    _populateLevelList() {
        //Text a message to server
        $.post('/api/get_level_list', { type: 'level' })
            .then(theLevelList => JSON.parse(theLevelList))
            .then(levelData => {
                //populate the pulldown in the form
                let tempList = [{ level_1: "stuff" }, { level_2: "stuff2" }];
                this._updateLevelList(tempList);
            });
    }

    _updateLevelList(levelList) {
        //Do some fancy jquert to fill the level list

        const $optionList = $('#level-list');
        levelList.forEach(item => {
            let $option = $(`<option value>="${item}"> ${item}</option>`);
            $optionList.append($option);
        });
    }

    _populateGameObjectList() {
        return new Promise((resolve, reject) => { //parameters are functions too
            //do some work
            $.post('/api/get_object_list', { type: 'object' })
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
}