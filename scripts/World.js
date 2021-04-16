// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora

'use strict';

import Physics from './libs/Physics.js';

import EntityController from './EntityController.js';

const TIMESTEP = 1 / 60;
const VELOCITY = 10;
const POSITION = 10;

// TODO: change this variables, maybe place them on the constructor?
var world;
var ctx;
var ground;
var canvas_width;
var canvas_height;
var canvas_height_m;

//box2d to canvas scale , therefor 1 metre of box2d = 20px of canvas :)
var scale = 20;

var entityList = []; // List of game objects


export default class World {
    constructor() {

        world = this._createWorld();

        var canvas = $('#canvas');
        ctx = canvas.get(0).getContext('2d');

        //get internal dimensions of the canvas
        canvas_width = parseInt(canvas.attr('width'));
        canvas_height = parseInt(canvas.attr('height'));
        canvas_height_m = canvas_height / scale;

        //start update
        this.update();
    }

    GetWorld() {
        return world;
    }

    _createWorld() {
        //Gravity vector x, y - 10 m/s2 - thats earth!!
        var gravity = new Physics.Vec2(0, -10);

        world = new Physics.World(gravity, true);

        //setup debug draw
        var debugDraw = new Physics.DebugDraw();
        debugDraw.SetSprite(document.getElementById('canvas').getContext('2d'));
        debugDraw.SetDrawScale(scale);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);

        world.SetDebugDraw(debugDraw);

        //create some objects
        ground = this._createBox(world, 34.75, 0, 69.5, 1, { type: Physics.Body.b2_staticBody, 'user_data': { 'fill_color': 'rgba(204,237,165,1)', 'border_color': '#7FE57F' } });
        //this.createBox(world, 36.50, 3.80, 1, 1, { 'user_data': { 'border_color': '#555' } });
        //this.createBox(world, 38.50, 3.80, 1, 1, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
        //this.createBall(world, 38.50, 3.80, 1, { 'user_data': { 'fill_color': 'rgba(204,100,0,0.3)', 'border_color': '#555' } });
        //this.createBall(world, 1, 3.80, 1, { 'user_data': { 'fill_color': 'rgba(204,100,0,0.3)', 'border_color': '#555' } });
        this._draw_object();

        return world;
    }
    _draw_object() {
        //create some objects (DEBUG Purposes)
        let thisItem = new EntityController(world, $("#CannonX"), false, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
        entityList[0] = thisItem;
    }

    //Create standard boxes of given height , width at x,y
    _createBox(world, x, y, width, height, options) {
            //default setting
            options = $.extend(true, {
                'density': 1.0,
                'friction': 1.0,
                'restitution': 0.5,

                'type': Physics.Body.b2_dynamicBody
            }, options);

            var body_def = new Physics.BodyDef();
            var fix_def = new Physics.FixtureDef();

            fix_def.density = options.density;
            fix_def.friction = options.friction;
            fix_def.restitution = options.restitution;

            fix_def.shape = new Physics.PolygonShape();

            fix_def.shape.SetAsBox(width / 2, height / 2);

            body_def.position.Set(x, y);

            body_def.type = options.type;
            body_def.userData = options.user_data;

            var b = world.CreateBody(body_def);
            var f = b.CreateFixture(fix_def);

            return b;
        }
        //Function to create a round ball, sphere like object
    _createBall(world, x, y, radius, options) {
        var body_def = new Physics.BodyDef();
        var fix_def = new Physics.FixtureDef();

        fix_def.density = options.density || 1.0;
        fix_def.friction = 0.5;
        fix_def.restitution = 0.5;

        var shape = new Physics.CircleShape(radius);
        fix_def.shape = shape;

        body_def.position.Set(x, y);

        body_def.linearDamping = 0.0;
        body_def.angularDamping = 0.0;

        body_def.type = Physics.Body.b2_dynamicBody;
        body_def.userData = options.user_data;

        var b = world.CreateBody(body_def);
        b.CreateFixture(fix_def);

        return b;
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

        ctx.font = 'bold 18px arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText('Box2d MouseJoint example in Javascript', canvas_width / 2, 20);
        ctx.font = 'bold 14px arial';
        ctx.fillText('Click on any object and drag it', canvas_width / 2, 40);

        //call this function again after 1/60 seconds or 16.7ms
        setTimeout(this.update, 1000 / fps);
    }
}