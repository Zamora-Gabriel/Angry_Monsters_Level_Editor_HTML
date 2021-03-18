// Copyright (C) 2021 Gabriel Zamora
'use strict';

//import { resolve } from "path";

export default class Editor {

    constructor() {

        //set up fields to hold data
        //TODO: the level itself is in the DOM
        this.gameObjectList = [];

        this.offset = {
            x: 0,
            y: 0
        }

        //Fetch the list of levels
        this._populateLevelList();

        //fetch list of GameObjects
        this._populateGameObjectList()
            .then(gameObjects => {

                //Build Sidebar with gameObjects
            })
            .catch(error => { this._showErrorDialog(error) });

        //TODO: initialize all draggable stuff

        //TODO: Handle user save events
    }


    run() {
        this._handleDraggables();
    }

    _showErrorDialog() {
        //TODO: build a dialog system for showing error messages
    }

    _populateLevelList() {
        //Text a message to server
        $.post('/api/get_level_list', { type: 'level' })
            .then(theLevelList => JSON.parse(theLevelList))
            .then(levelData => {
                //populate the pulldown in the form
                let tempList = [{ name: "level_1" }, { name: "level_2" }];
                this._updateLevelList(tempList);
            });
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
}