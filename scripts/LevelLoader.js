// Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class LevelLoader {
    constructor() {}

    loadLevel(payload) {

        payload = JSON.parse(payload);
        // Fill from submitted information
        this.__FillSubmitArea(payload);

        // Load cannon to level
        this.__LoadCannon(payload.catapult);

        // Fill for entityList
        this.__FillEditArea(payload.entityLists);

    }

    __FillSubmitArea(payload) {

        $("#levName").val(payload.name);
        $("#background-list").val(`${payload.background}`).change();
        $("#maxShot").val(payload.ammo);
        $("#oneStar").val(payload.star1);
        $("#twoStar").val(payload.star2);
        $("#threeStar").val(payload.star3);
    }

    __LoadCannon(cannon) {
        let $editArea = $("#window-ed");
        // Empty current edit area
        $editArea.empty();

        // Build Cannon object
        let $option = $(`<div data-value="Cannon" class="rectangle cannon catapult draggable" 
         style="height: 300px; width: 300px; position: absolute; margin: 0px; left: ${cannon.pos.x}; 
         top: ${cannon.pos.y};" draggable="true"></div>`);

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
            left: ${item.pos.x}; position: absolute; margin: 0px;" draggable="true">`);

            // Add it to the edit window
            $editArea.append($option);
        });
    }

}