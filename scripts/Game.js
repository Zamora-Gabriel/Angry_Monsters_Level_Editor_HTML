// Copyright (C) 2021 Gabriel Zamora
'use strict';

// Game state
const GAMESTATE = {
    SPLASH: 0,
    LOADING: 1,
    GAME: 2,
    RESULTS: 3
}

// USE check (GAMESTATE.LOADING)

export default class Game {
    constructor() {
        // load level
        // Build a world model
        // set up event handlers for user

        // aim cannon 
        // Fire cannon
        // Win/lose

        // Start listening
    }

    get STATE() {
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
    }

    render(dt) {
        // draw the DOM objects
        // Draw world
    }

    run(dt) {
        //run our main game Loop
        this.update();
        this.render();

        window.requestAnimationFrame(dt => { this.run(dt) })
    }
}