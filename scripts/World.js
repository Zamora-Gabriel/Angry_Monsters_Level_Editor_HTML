// Copyright (C) 2021 Gabriel Zamora
'use strict';

import Physics from './libs/Physics.js';

const TIMESTEP = 1 / 60;

const VELOCITY = 10;

const POSITION = 10;

const SCALE = 100; // 100px = 1 meter

export default class World {
    constructor($el) {

        let gravity = new Physics.Vec2(0, Physics.GRAVITY);

        this.entityList = []; // List of game objects

        this.$view = $el; // Game area

        const w = this.$view.width();
        const h = this.$view.height();

        console.log(`width is: ${w}, height is: ${h}`); // Debug get height and width

        this.model = new Physics.World(gravity);

        this.addListener()
    }

    addListener() {
        const listener = new Physics.Listener();

        // Functions box2d calls
        listener.BeginContact = contact => {
            // OnCollide equivalent
            /* Example of JSON object for settingthe user data
            // On level object taking level object and build it on load
            userData = {
                isBird: false,
                isPig: true,
                $el: ${'#jquery-element'},
                elName: ""
            }
            */
            // Get Item A
            let itemA = contact.GetFixtureA().GetBody().GetUserData();

            // Get Item B
            let itemB = contact.GetFixtureB().GetBody().GetUserData();

            console.log(itemA.isBird, itemB.isPig)

        };
        listener.EndContact = contact => {
            // Things are no longer touching
        };

        listener.PreSolve = (contact, oldManifold) => {
            // Called after collision but before physics happens
        };

        listener.PostSolve = (contact, impulse) => {
            // Called after collision after physics
            // Place stuff here...
        };

        this.model.SetContactListener(listener);
    }

    initialize() {
        this._createGround();
    }

    update() {
        this.model.Step(TIMESTEP, VELOCITY, POSITION);
        this.model.ClearForces();
        // Delete entities

    }

    render() {
        // How are we doing this

        this.entityList.forEach(gameObj => {
            gameObj.render();
        })

    }


    _createGround(width, height) {
        let ground = new Physics.FixtureDef();


        ground.shape = new Physics.PolygonShape();

        ground.shape.SetAsBox(10, 1);

        let bodyDef = new Physics.BodyDef();
        bodyDef.type = Physics.Body.b2_staticBody;
    }
}