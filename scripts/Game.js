// Copyright (C) 2021 Gabriel Zamora
'use strict';

import World from './World.js'
import Physics from './libs/Physics.js';

export default class Game {
    constructor() {
        // load level
        // Build a world model
        this.world = new World($("#window-ed"));

        this.entityList = []; // List of game objects
        // set up event handlers for user
        /* aim cannon 
        // Fire cannon
        // Win/lose*/

        // Start listening
    }

    static get STATE() {
        // Game state
        return {
            SPLASH: 0,
            LOADING: 1,
            GAME: 2,
            RESULTS: 3
        }
        // use check (Game.STATE.LOADING)
    }

    update(dt) {
        // if game over or not started get out
        if (this.gameState != Game.STATE.GAME) {
            return;
        }

        // Update special things (pig cannon balls, birds, etc.)

        // Update the world
        this.world.update();
    }

    render(dt) {
        // draw the DOM objects

        this.entityList.forEach(entity =>
            entity.render()
        );

        // Draw world
        this.world.render();
    }

    run(dt) {
        //run our main game Loop
        this.gameState = 2;
        this.update();
        this.render();


        window.requestAnimationFrame(dt => { this.run(dt) })
    }
}