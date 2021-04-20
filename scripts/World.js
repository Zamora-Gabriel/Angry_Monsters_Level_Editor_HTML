// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora

'use strict';

import Physics from './libs/Physics.js';
import ContactListener from './ContactListener.js';
import EntityController from './EntityController.js';
import Game from './Game.js';

const TIMESTEP = 1 / 60;
const VELOCITY = 10;
const POSITION = 10;

// Variables
let world;
var ctx;
let ground;
let rightWall;
var canvas_width;
var canvas_height;
var canvas_height_m;

//box2d to canvas scale , therefor 1 metre of box2d = 20px of canvas :)
const scale = 20;


export default class World {
    constructor() {

        this.entityList = []; // List of game objects
        this.deleted = false; // flag to check if deleted
        this.deleteIndex = 0; // index of deleted object
        this.destroyedTargetValue = 0; // Value of the destroyed target

        world = this._createWorld();

        var canvas = $('#canvas');
        ctx = canvas.get(0).getContext('2d');

        //get internal dimensions of the canvas
        canvas_width = parseInt(canvas.attr('width'));
        canvas_height = parseInt(canvas.attr('height'));
        canvas_height_m = canvas_height / scale;
        this._addListener();
        //start update
        this.ammo = 10;
        this.update();
    }

    // Getters
    GetWorld() {
        return world;
    }

    // Delete entity from the game
    GetDeletedIndex() {
        if (this.deleted) {
            this.deleted = false;
            return this.deleteIndex;
        }

        return null;
    }

    GetTargetValue() {
        return this.destroyedTargetValue;
    }

    // Setters
    SetEntities(entList) {
        this.entityList = entList;
    }



    _addListener() {
        const listener = new Physics.Listener;

        listener.BeginContact = contact => {

            // Get the bodies involved in collision
            let aBody = contact.GetFixtureA().GetBody();
            let bBody = contact.GetFixtureB().GetBody();

            let thingA = aBody.GetUserData();
            let thingB = bBody.GetUserData();

            if ((thingA == null) || (thingB == null)) {
                console.log("Nothing collide");
                return;
            }

            if ((thingA.isBall == true) && (thingB.isTarget == true)) {
                console.log("Obstacle was hit by the ball");
                let targetId = thingB.domObj;
                console.log(targetId);
            };
            if ((thingA.isTarget == true) && (thingB.isBall == true)) {
                console.log("Obstacle was hit by the ball");
                let targetId = thingA.domObj;
                console.log(targetId);
            };

        };

        listener.PostSolve = (contact, impulse) => {

            // Get the bodies involved in the collisions
            let aBody = contact.GetFixtureA().GetBody();
            let bBody = contact.GetFixtureB().GetBody();

            let thingA = aBody.GetUserData();
            let thingB = bBody.GetUserData();

            if ((thingA.isBall == true) && (thingB.isTarget == true)) {
                console.log("Obstacle was hit by the ball");
                //GET THE target ID, then destroy the target  
                let targetId = thingB.domObj;
                this.FindTargetToDestroy(targetId, bBody);
            };
            if ((thingA.isTarget == true) && (thingB.isBall == true)) {
                console.log("Obstacle was hit by the ball");
                //GET THE target ID, then destroy the target  
                let targetId = thingA.domObj;
                this.FindTargetToDestroy(targetId, aBody);
            };
        };

        world.SetContactListener(listener);
    }

    _createWorld() {
        // Set gravity to - 10 m/s2
        var gravity = new Physics.Vec2(0, -10);

        let newWorld = new Physics.World(gravity, true);

        //setup debug draw
        var debugDraw = new Physics.DebugDraw();
        debugDraw.SetSprite(document.getElementById('canvas').getContext('2d'));
        debugDraw.SetDrawScale(scale);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);

        newWorld.SetDebugDraw(debugDraw);

        //create some objects
        ground = this._createBox(newWorld,
            34.75,
            0,
            69.5,
            1, {
                type: Physics.Body.b2_staticBody,
                'user_data': {
                    'fill_color': 'rgba(204,237,165,1)',
                    'border_color': '#7FE57F'
                }
            });
        rightWall = this._createBox(newWorld,
            69.5,
            15.5,
            1,
            31, {
                type: Physics.Body.b2_staticBody,
                'user_data': {
                    'fill_color': 'rgba(204,237,165,1)',
                    'border_color': '#7FE57F'
                }
            });

        return newWorld;
    }

    //Create standard boxes of given height , width at x,y
    _createBox(wd, x, y, width, height, options) {

        // Default settings for the box
        options = $.extend(true, {
            'density': 1.0,
            'friction': 1.0,
            'restitution': 0.5,

            'type': Physics.Body.b2_dynamicBody
        }, options);

        let body_def = new Physics.BodyDef();
        let fix_def = new Physics.FixtureDef();

        // Build Fixture
        fix_def.density = options.density;
        fix_def.friction = options.friction;
        fix_def.restitution = options.restitution;

        fix_def.shape = new Physics.PolygonShape();

        fix_def.shape.SetAsBox(width / 2, height / 2);

        // Build body
        body_def.position.Set(x, y);

        body_def.type = options.type;
        body_def.userData = options.user_data;

        // Create body
        let b = wd.CreateBody(body_def);
        let f = b.CreateFixture(fix_def);

        return b;
    }

    // Function to create a round ball, sphere like object
    _createBall(wd, x, y, radius, options) {
        let body_def = new Physics.BodyDef();
        let fix_def = new Physics.FixtureDef();

        fix_def.density = options.density || 1.0;
        fix_def.friction = 0.5;
        fix_def.restitution = 0.5;

        let shape = new Physics.CircleShape(radius);
        fix_def.shape = shape;

        body_def.position.Set(x, y);

        body_def.linearDamping = 0.0;
        body_def.angularDamping = 0.0;

        body_def.type = Physics.Body.b2_dynamicBody;
        body_def.userData = options.user_data;

        let b = wd.CreateBody(body_def);

        b.CreateFixture(fix_def);

        return b;
    }

    // Create a line
    drawline(startX, startY, endX, endY) {
        let start = new Physics.Vec2(startX, startY);
        let end = new Physics.Vec2(endX, endY);

        let fixDef = new Physics.FixtureDef();
        fixDef.shape = new Physics.PolygonShape();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = .5;
        fixDef.shape.SetAsArray([
            start,
            end
        ], 2);
        var bodyDef = new Physics.BodyDef();
        bodyDef.type = Physics.Body.b2_staticBody;
        bodyDef.position.Set(0, 0);
        var line = world.CreateBody(bodyDef)
        line.CreateFixture(fixDef);
        return line;
    }

    update() {
        var fps = 60;
        var timeStep = 1.0 / (fps * 0.8);

        //move the box2d world ahead
        world.Step(timeStep, 8, 3);
        world.ClearForces();


        //redraw the world
        //convert the canvas coordinate directions to cartesian coordinate direction by translating and scaling
        ctx.save();
        ctx.translate(0, canvas_height);
        ctx.scale(1, -1);
        world.DrawDebugData();
        ctx.restore();

        ctx.font = 'bold 20px arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText('SCORE : ', 85, 30);
        ctx.font = 'bold 20px arial';
        ctx.fillText('Ammo : ' + this.ammo, 100, 60);

        //call this function again after 1/60 seconds or 16.7ms
        setTimeout(this.update, 1000 / fps);
    }

    render(deltaTime) {
        this.entityList.forEach(entity => {
            entity.render(deltaTime);
        });
    }

    DestroyObject(body) {
        // Call destroy body function inside Box2D
        world.DestroyBody(body);
    }

    FindTargetToDestroy($id, body) {
        let index = 0;

        this.entityList.forEach(entity => {
            let entityData = entity.GetModel().GetUserData();
            if (entityData.domObj == $id) {
                // delete flag set to true
                this.deleted = true;

                // Get the value of the target collided
                this.SetTargetValue($id);

                // Remove the target's html counterpart
                $id.remove();

                // save the index to be deleted in-game
                this.deleteIndex = index;
                return;
            }
            index++;
        });

    }

    SetTargetValue($id) {
        // Get the value for the destroyed target
        this.destroyedTargetValue = $id.attr("data-score");
        console.log(`Scored: ${this.destroyedTargetValue}`);
    }

    updateScreen(ammo) {
        // TODO: Figure adding score
        this.ammo = ammo;
    }
}