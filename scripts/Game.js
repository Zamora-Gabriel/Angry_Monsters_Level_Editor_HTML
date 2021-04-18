// Copyright (C) 2019 Scott Henshaw
'use strict';

import EntityController from "./EntityController.js";
import Level from "./Level.js";

import World from "./World.js";

const GameState = {
    BEGIN: 0,
    WAIT: 1,
    SHOOT: 2,
    GAMEOVER: 3
}

const SCALE = 20;

const RAD_2_DEG = 180 / Math.PI;

let clicked = false;
let ballAlive = false;
let gameOverFlag = false;

export default class Game {

    constructor(userPickedLevel) {
        // put all the UI and setup here
        this.lastUpdate = 0;
        this.entityList = [];
        this.world = new World();
        this.gameWorld = this.world.GetWorld();
        this.shootAngle = 0;

        // level information
        this.ammo = 0;
        this.oneStar = 0;
        this.twoStar = 0;
        this.threeStar = 0;

        // Cannonball body
        this.cannonball;
        // Cannonball entity number
        this.cannonballIndex = 0;

        // State machine for the game
        this.gameState = GameState.BEGIN;


        // Mouse coordinates
        this.mouseCoordX = 0;
        this.mouseCoordY = 0;

        // TODO: Find a way for user to change level or user id
        this.userID = 'pg20gabriel';
        this.levelName = userPickedLevel; //'TestLevel';

        this.currentLevel = new Level(this.gameWorld, this.levelName, 'pg20gabriel');
        this.currentLevel.load()
            .then(levelData => {

                this.entityList = this.currentLevel.handleLoadLevel(levelData);

                // save level Information in game
                this.StoreLevelInfoInGame(this.currentLevel.GetLevelInfo());

                this.run();
            });

        // add all UI handlers here
        $("#back-to-splash").on("click", event => {
            $('.splash-screen').show();
        });
    }

    StoreLevelInfoInGame(levelInfo) {
        // Save ammo for the level
        this.ammo = parseInt(levelInfo["ammo"], 10);

        // Save star values
        this.oneStar = parseInt(levelInfo["oneStar"], 10);
        this.twoStar = parseInt(levelInfo["twoStar"], 10);
        this.threeStar = parseInt(levelInfo["threeStar"], 10);
    }

    checkState() {
        if (this.gameState == GameState.BEGIN) {
            console.log("Begin state");
            this.gameState = GameState.WAIT;
        }

        if (this.gameState == GameState.WAIT) {

            if (this.ammo < 0) {
                // Game Over condition
                this.gameState = GameState.GAMEOVER;
            }
        }

        if (this.gameState == GameState.SHOOT) {
            //this.Shoot();
            if (!this.cannonball.IsAwake()) {
                console.log("cannonball is asleep");
                this._eraseCannonBall();
                this.gameState = GameState.WAIT;
            }
        }

        if (this.gameState == GameState.GAMEOVER) {
            // TODO: game over screen
            // prevent shooting
            gameOverFlag = true;
            this._GameOver();
        }
    }

    update(deltaTime) {
        this.world.update(deltaTime);
    }

    render(deltaTime) {

        // Render objects and targets within the entity list
        this.entityList.forEach(entity => {
            entity.render(deltaTime);
        });
    }

    run(timestep = 0) {

        let deltaTime = timestep - this.lastUpdate;

        $("#fireBttn").off().on("click", event => this.tryShoot());
        this.CheckMouse();
        this.checkState();
        this.update(deltaTime);
        this.render(deltaTime);

        window.requestAnimationFrame(timestep => this.run(timestep / 100));
    }

    tryShoot() {
        // Check if cannonball is still alive
        if (!ballAlive && !gameOverFlag) {
            this._instantiateObject();
        }
    }

    _instantiateObject() {

        console.log("fire");
        //   Change game state to shooting and set flag to let know there's already a ball in the game screen
        this.gameState = GameState.SHOOT;
        ballAlive = true;

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

        // Make a new entitycontroller for the bullet
        let bullet = new EntityController(this.world.GetWorld(), $(`#CannonBall`),
            false,
            true, {
                'user_data': {
                    'fill_color': 'rgba(204,0,165,0.3)',
                    'border_color': '#555'
                }
            });


        /*let testBullet = this.world._createBall(this.world.GetWorld(),
            60,
            80,
            2,
            2, { 'user_data': { 'fill_color': 'rgba(255,255,255,1)', 'border_color': '#555' } });
        */
        this.entityList.push(bullet);

        // get the cannonball index
        this.cannonballIndex = this.entityList.length - 1;

        this.cannonball = this.entityList[this.cannonballIndex].GetModel();

        // Shoot cannonball
        this._Shoot();

        // Decrease the available ammo that user has to shoot
        this.ammo--;
        console.log(`${this.ammo} Shots left`);
    }

    _Shoot() {
        this.entityList[this.cannonballIndex].AddImpulse(this.shootAngle);
    }

    CheckMouse() {
        // Change from $("#canvas") to $("#window-ed") to change from canvas to game screen detection
        let $screen = $("#canvas");
        // let $screen = $("#window-ed");

        $screen.off()
            .on("click", event => {
                clicked = true;

                // Get mouse coordinates substracting the area's offset
                this.mouseCoordX = event.pageX - $screen.offset().left;
                this.mouseCoordY = event.pageY - $screen.offset().top;

                // Translate to world coordinates
                let worldMouseX = (this.mouseCoordX) / SCALE;
                let worldMouseY = (-this.mouseCoordY + 620) / SCALE;

                // DEBUG: Get Cannon's position
                let cannonX = $("#Cannon0").position().left / 2;
                let cannonY = $("#Cannon0").position().top / 2;

                let worldCannonX = (cannonX) / SCALE;
                let worldCannonY = (-cannonY + 620) / SCALE;


                console.log("MOUSECoord x, y:", this.mouseCoordX, this.mouseCoordY);
                console.log("CANNONCoordx, y", cannonX, cannonY);
                console.log("worldCannon x, y:", worldCannonX, worldCannonY);
                console.log("worldMouse x, y:", worldMouseX, worldMouseY);
                let x = Math.floor(worldCannonX - $("#Cannon0").width() / 2);
                let y = Math.floor(worldCannonY - $("#Cannon0").height() / 2);

                // Line, debug purposes
                // this.world.drawline(x, y, worldMouseX, worldMouseY);

                // Rotation of the cannon
                this.shootAngle = this.entityList[0].rotateCannon(worldMouseX, worldMouseY);
            })
            .on("mouseup", event => {
                clicked = false;
            });
    }

    // Erase the cannonBall
    _eraseCannonBall() {
        // Destroy cannonball on the physics world
        this.world.DestroyObject(this.cannonball);

        // de-reference cannonball
        this.cannonball = null;

        // pop it from the entity list
        this.entityList.pop();

        // Set its alive flag to false
        ballAlive = false;

        // remove the Cannonball div from the game
        $("#CannonBall").remove();
    }

    _GameOver() {
        // Endgame, go to score page
        $(".play-now-btn").on('click', event => {
            console.log("CLICKED");
            const game = new Game();
            // hide game
            $('.game-screen').hide();
            game.run();

        });
    }
}