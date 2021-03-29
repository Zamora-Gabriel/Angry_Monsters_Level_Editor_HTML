// Copyright (C) 2021 Gabriel Zamora
'use strict';

import Physics from './libs/Physics.js';

const TIMESTEP = 1 / 60;

const VELOCITY = 10;

const POSITION = 10;

export default class World {
    constructor($el) {

        let gravity = new Physics.vec2(0, Physics.GRAVITY);

        this.entityList = []; // List of game objects

        this.$view = $el;
        this.model = new Physics.World(gravity);
    }

    update() {
        this.model.step(TIMESTEP, VELOCITY, POSITION);
        this.model.clearForces();
    }

    render() {
        // How are we doing this

        this.entityList.forEach(gameObj => {
            gameObj.render();
        })

    }
}