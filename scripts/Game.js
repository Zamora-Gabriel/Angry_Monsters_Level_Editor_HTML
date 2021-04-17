// Copyright (C) 2019 Scott Henshaw
'use strict';

import EntityController from "./EntityController.js";
import Level from "./Level.js";

import World from "./World.js";

const GameState = {
    BEGIN: 0,
    WAIT: 1,
    SHOOT: 2,
    COOLDOWN: 3
}

const SCALE = 20;

const RAD_2_DEG = 180 / Math.PI;

let clicked = false;
let wasObjectAdded = false;

export default class Game {

    constructor(userPickedLevel) {
        // put all the UI and setup here
        this.lastUpdate = 0;
        this.entityList = [];
        this.world = new World();

        // State machine for the game
        this.gameState = GameState.BEGIN;

        // Mouse coordinates
        this.mouseCoordX = 0;
        this.mouseCoordY = 0;

        // TODO: Find a way for user to change level or user id
        this.userID = 'pg20gabriel';
        this.levelName =userPickedLevel; //'TestLevel';

        this.currentLevel = new Level(this.world.GetWorld(), this.levelName, 'pg20gabriel');
        this.currentLevel.load()
            .then(levelData => {

                this.entityList = this.currentLevel.handleLoadLevel(levelData);
                this.run();
            });

        // add all UI handlers here
        $("#back-to-splash").on("click", event => {
            $('.splash-screen').show();
        });
    }


   


    checkState() {
        if (this.gameState == GameState.BEGIN) {
            console.log("Begin state");
            this.gameState = GameState.WAIT;
        }

        if (this.gameState == GameState.WAIT) {
            if (this._printMouseCoord()) {
                // Wait for shooting state
            }

            /*if () {
                this.gameState = GameState.SHOOT;
            }*/
        }

        if (this.gameState == GameState.SHOOT) {
            //this.Shoot();
            this.gameState = GameState.COOLDOWN;
        }
    }

    update(deltaTime) {
        this.world.update(deltaTime);
    }

    render(deltaTime) {

        //this.world.render(deltaTime);
        this.entityList.forEach(entity => {
            entity.render(deltaTime);
        });
    }

    run(timestep = 0) {

        let deltaTime = timestep - this.lastUpdate;

        $("#fireBttn").on("click", event => this._instantiateObject());
        this.CheckMouse();
        this.checkState();
        this.update(deltaTime);
        this.render(deltaTime);

        window.requestAnimationFrame(timestep => this.run(timestep / 100));
    }

    _printMouseCoord() {
        /*if (ammo == 0) {
            return false;
        }*/
        const position = $("Cannon0").position();

        if (clicked == true) {
            // TODO: shoot angle
            //console.log(`Mouse x is: ${this.mouseCoordX}, Mouse Y is: ${this.mouseCoordY}`);
        }
    }

    _instantiateObject() {

        if (!wasObjectAdded) {

            // Get aim coordinates for the shooting
            let yCoordinates = $("#Aiming").offset().top - 100;
            let xCoordinates = $("#Aiming").offset().left;

            // get angle from the cannon
            let rotationInRad = this.entityList[0].GetAngle();

            let rotationInDeg = rotationInRad * RAD_2_DEG;

            // Create new cannonball
            let $option = $(`<div id="CannonBall" data-value="Cannonball" class="round ball object draggable" 
            style="height: 70px; width: 70px; top: ${yCoordinates}px; 
            left: ${xCoordinates}px; position: absolute; margin: 0px;" draggable="true">`);

            // Add it to the edit window
            $("#window-ed").append($option);

            let newEntity = new EntityController(this.world.GetWorld(), $(`#CannonBall`), true, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
            this.entityList.push(newEntity);
            wasObjectAdded = true;
        }
    }

    CheckMouse() {
        $("#canvas")
            .on("mousedown", event => {
                clicked = true;

                // Get mouse coordinates substracting the area's offset
                this.mouseCoordX = event.pageX - $("#canvas").offset().left;
                this.mouseCoordY = event.pageY - $("#canvas").offset().top;

                // Translate to world coordinates
                let worldMouseX = (this.mouseCoordX) / SCALE;
                let worldMouseY = (-this.mouseCoordY + 620) / SCALE;

                // DEBUG: Get Cannon's position
                let cannonX = $("#Cannon0").position().left / 2;
                let cannonY = $("#Cannon0").position().top / 2;

                let worldCannonX = (cannonX) / SCALE;
                let worldCannonY = (-cannonY + 620) / SCALE;

                let x = Math.floor(worldCannonX - $("#Cannon0").width() / 2);
                let y = Math.floor(worldCannonY - $("#Cannon0").height() / 2);

                // Line, debug purposes
                this.world.drawline(x, y, worldMouseX, worldMouseY);

                // Rotation of the cannon
                this.entityList[0].rotateCannon(worldMouseX, worldMouseY);
            })
            .on("mouseup", event => {
                clicked = false;
            });
    }
}