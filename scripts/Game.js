// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora 
// Based on Instructor Scott Henshaw's template
'use strict';

import EntityController from "./EntityController.js";
import Level from "./Level.js";

import World from "./World.js";

const GameState = {
    BEGIN: 0,
    WAIT: 1,
    SHOOT: 2,
    GAMEOVER: 3,
    WIN: 4
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
        this.score = 0;

        // level information
        this.ammo = 1;
        this.oneStar = 0;
        this.twoStar = 0;
        this.threeStar = 1;

        // Index to check what object will be deleted
        this.deleteIndex = 0;

        // Cannonball body
        this.cannonball;
        // Cannonball entity number
        this.cannonballIndex = 0;

        // State machine for the game
        this.gameState = GameState.BEGIN;

        // Mouse coordinates
        this.mouseCoordX = 0;
        this.mouseCoordY = 0;

        this.userID = 'pg20gabriel';
        this.levelName = userPickedLevel; //'TestLevel';

        this.currentLevel = new Level(this.gameWorld, this.levelName, 'pg20gabriel');
        this.currentLevel.load()
            .then(levelData => {

                this.entityList = this.currentLevel.handleLoadLevel(levelData);

                // Save level's entity list to the world's entity list
                this.__StoreEntitiesOnWorld();
                // save level Information in game
                this.StoreLevelInfoInGame(this.currentLevel.GetLevelInfo());

                this.run();
            });

        // add all UI handlers here
        $("#back-to-splash").on("click", event => {
            this._restart();
        });
    }

    _restart() {
        $('.splash-screen').show();
        $('.end-screen').hide();
    }

    StoreLevelInfoInGame(levelInfo) {
        // Save ammo for the level
        this.ammo = parseInt(levelInfo["ammo"], 10);


        // display starting ammo
        $(".ammo-text").text(`Remaining Ammo: ${this.ammo}`);

        // Save star values
        this.oneStar = parseInt(levelInfo["oneStar"], 10);
        this.twoStar = parseInt(levelInfo["twoStar"], 10);
        this.threeStar = parseInt(levelInfo["threeStar"], 10);
    }

    __StoreEntitiesOnWorld() {
        // Share entity list from the level to world
        this.world.SetEntities(this.entityList);
    }

    checkDelete() {
        // Check if there is an object to delete in order to remove it from the list
        this.deleteIndex = this.world.GetDeletedIndex();
        if (this.deleteIndex != null) {
            // Call destroy object within the world passing the body of the object
            this.world.DestroyObject(this.entityList[this.deleteIndex].GetModel());
            // Update Score
            this.__addScore(this.world.GetTargetValue());
            this.entityList.splice(this.deleteIndex, 1);
        }
    }

    __addScore(scoreVal) {
        this.score += parseInt(scoreVal);
        // Update score field
        $("#score-game").text(`Score: ${this.score}`);
    }

    // State machine for the game function
    checkState() {

        switch (this.gameState) {
            case GameState.BEGIN:
                console.log("Begin state");
                this.gameState = GameState.WAIT;
                break;
            case GameState.WAIT:
                if (this.ammo <= 0) {
                    // Game Over condition
                    this.gameState = GameState.GAMEOVER;
                }

                if (this.score >= this.threeStar) {
                    this.gameState = GameState.WIN;
                }
                break;
            case GameState.SHOOT:
                //Shooting state
                if (!this.cannonball.IsAwake()) {
                    console.log("cannonball is asleep");
                    this._eraseCannonBall();
                    this.gameState = GameState.WAIT;
                }
                break;
            case GameState.GAMEOVER:
                // prevent shooting
                gameOverFlag = true;
                this._GameOver();
                break;
            case GameState.WIN:
                // prevent shooting
                gameOverFlag = true;
                this._GameWin();
                break;
            default:
                break;
        }
    }

    update(deltaTime) {
        this.world.update(deltaTime);
    }

    render(deltaTime) {
        // Render objects and targets within the entity list inside world
        this.world.render(deltaTime);
    }

    run(timestep = 0) {

        let deltaTime = timestep - this.lastUpdate;

        $("#fireBttn").off().on("click", event => this.tryShoot());
        this.CheckMouse();
        this.checkState();
        this.checkDelete();
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

        // Pushing the bullet's physical body controller to the entity list
        this.entityList.push(bullet);

        // get the cannonball index
        this.cannonballIndex = this.entityList.length - 1;

        this.cannonball = this.entityList[this.cannonballIndex].GetModel();

        // Shoot cannonball
        this._Shoot();

        // Decrease the available ammo that user has to shoot
        this.ammo--;

        // Display remaining shots
        $(".ammo-text").text(`Remaining Ammo: ${this.ammo}`);
    }

    _Shoot() {
        this.entityList[this.cannonballIndex].AddImpulse(this.shootAngle);
    }

    CheckMouse() {
        // Change from $("#canvas") to $("#window-ed") to change from canvas to game screen detection
        // let $screen = $("#canvas");
        let $screen = $("#window-ed");

        $screen.off()
            .on("click", event => {
                clicked = true;

                // Get mouse coordinates substracting the area's offset
                this.mouseCoordX = event.pageX - $screen.offset().left;
                this.mouseCoordY = event.pageY - $screen.offset().top;

                // Translate to world coordinates
                let worldMouseX = (this.mouseCoordX) / SCALE;
                let worldMouseY = (-this.mouseCoordY + 620) / SCALE;

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

        this.world.updateScreen(this.ammo);

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

        console.log("Game over2");
        // hide game
        $('.game-screen').hide();
        $('.end-screen').show();
        $('#results-screen').text("Game Over");
        $('#score-results').text(`Final Score: ${this.score}`);

    }
    _GameWin() {
        // Endgame, go to score page

        console.log("Game win");
        // hide game
        $('.game-screen').hide();
        $('.end-screen').show();
        $('#results-screen').text("Congratulations You Won!");
        $('#score-results').text(`Final Score: ${this.score}`);

    }
}