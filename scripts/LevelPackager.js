// Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class LevelPackager {
    constructor() {
        // level wrapper
        this.level = {
            id: "",
            name: "",
            ammo: "",
            background: "",
            catapult: {},
            star1: "",
            star2: "",
            star3: "",
            entityLists: {
                collidableList: [],
                targetList: []
            }
        }
    }

    buildLevel(submittedInfo) {

        // Fill from submitted information
        this.__FillSubmitted(submittedInfo);

        // Fill for entityList
        this.__FillEntity();


    }

    __FillSubmitted(submittedInfo) {
        this.level.name = submittedInfo.name;
        this.level.background = submittedInfo.background;
        this.level.ammo = submittedInfo.ammo;
        this.level.star1 = submittedInfo.scoreStar1;
        this.level.star2 = submittedInfo.scoreStar2;
        this.level.star3 = submittedInfo.scoreStar3;
    }

    __FillEntity() {
        $("#window-ed > .draggable").each((index, elem) => {
            let $item = $(elem);

            // Divide classes to an Array and assign them to their specific field
            let classList = $item.attr("class");
            let classArr = classList.split(/\s+/);

            // Get Type
            if (classArr[2] == "target") {
                this.level.entityLists.targetList.push(this.__PackObject($item));
            } else if (classArr[2] == "object") {
                this.level.entityLists.collidableList.push(this.__PackObject($item));
            } else {
                //It is the catapult
                this.level.catapult["pos"] = this.__savePosition($item);
            }
        });
    }

    // Pack the array that goes inside a target or entity list
    __PackObject($item) {

        let packed = {};

        let entity = {};

        // Name of the object
        entity["name"] = $item.attr("data-value");

        // Divide classes to an Array and assign them to their specific field
        let classList = $item.attr("class");
        let classArr = classList.split(/\s+/);
        entity["shape"] = classArr[0];
        entity["texture"] = classArr[1];

        // Get css properties
        entity["height"] = $item.css("height");
        entity["width"] = $item.css("width");

        packed = entity;
        // Get and save position (x,y) of the element
        let pos = {};
        pos = this.__savePosition($item);
        //let strpos = JSON.stringify(pos);
        packed["pos"] = pos;
        return packed;
    }

    __savePosition($item) {
        let x = $item.css("left");
        let y = $item.css("top");
        let position = {};
        position["x"] = `${x}`;
        position["y"] = `${y}`;
        return position;
    }

    serialize() {

        return JSON.stringify(this.level);
    }
}