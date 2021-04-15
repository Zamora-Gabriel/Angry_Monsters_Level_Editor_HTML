// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora

'use strict';

import Physics from './libs/Physics.js';

import EntityController from './EntityController.js';

const TIMESTEP = 1 / 60;
const VELOCITY = 10;
const POSITION = 10;
var world;
var ctx;
var ground;
var canvas_width;
var canvas_height;
var canvas_height_m;
var mouse_pressed = false;
var mouse_joint = false;
var mouse_x, mouse_y;

//box2d to canvas scale , therefor 1 metre of box2d = 30px of canvas :)
var scale = 20;

var entityList = []; // List of game objects


export default class World {
    constructor() {

        world = createWorld();


        var canvas = $('#canvas');
        ctx = canvas.get(0).getContext('2d');

        //get internal dimensions of the canvas
        canvas_width = parseInt(canvas.attr('width'));
        canvas_height = parseInt(canvas.attr('height'));
        canvas_height_m = canvas_height / scale;

        //If mouse is moving over the thing
        $(canvas).mousemove(function(e) {
            var p = get_real(new Physics.Vec2(e.pageX / scale, e.pageY / scale))

            // var p = new Physics.Vec2(Physics.Vec2(e.pageX/scale, e.pageY/scale) + 0, 
            // canvas_height_m - Physics.Vec2(e.pageX/scale, e.pageY/scale));

            mouse_x = p.x;
            mouse_y = p.y;

            if (mouse_pressed && !mouse_joint) {
                var body = GetBodyAtMouse();

                if (body) {
                    //if joint exists then create
                    var def = new Physics.MouseJointDef();

                    def.bodyA = ground;
                    def.bodyB = body;
                    def.target = p;

                    def.collideConnected = true;
                    def.maxForce = 1000 * body.GetMass();
                    def.dampingRatio = 0;

                    mouse_joint = world.CreateJoint(def);

                    body.SetAwake(true);
                }
            } else {
                //nothing
            }

            if (mouse_joint) {
                mouse_joint.SetTarget(p);
            }
        });

        $(canvas).mousedown(function() {
            //flag to indicate if mouse is pressed or not
            mouse_pressed = true;
        });

        /*
        When mouse button is release, mark pressed as false and delete the mouse joint if it exists
        */
        $(canvas).mouseup(function() {
            mouse_pressed = false;

            if (mouse_joint) {
                world.DestroyJoint(mouse_joint);
                mouse_joint = false;
            }
        });

        //start stepping
        step();
    }
}


function createWorld() {
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
    ground = createBox(world, 34.75, 1, 69.5, 1, { type: Physics.Body.b2_staticBody, 'user_data': { 'fill_color': 'rgba(204,237,165,1)', 'border_color': '#7FE57F' } });
    // createBox(world, 36.50, 3.80, 1, 1, { 'user_data': { 'border_color': '#555' } });
    // createBox(world, 38.50, 3.80, 1, 1, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
    //createBall(world, 38.50, 3.80, 1, { 'user_data': { 'fill_color': 'rgba(204,100,0,0.3)', 'border_color': '#555' } });
    //createBall(world, 1, 3.80, 1, { 'user_data': { 'fill_color': 'rgba(204,100,0,0.3)', 'border_color': '#555' } });
    draw_object();

    return world;
}
//Function to create a round ball, sphere like object
function createBall(world, x, y, radius, options) {
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

//Create standard boxes of given height , width at x,y
function createBox(world, x, y, width, height, options) {
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

function draw_object() {
    //create some objects (DEBUG Purposes)
    let thisItem = new EntityController(world, $("#CannonX"), false, { 'user_data': { 'fill_color': 'rgba(204,0,165,0.3)', 'border_color': '#555' } });
    entityList[0] = thisItem;
}

/*
Draw a world
this method is called in a loop to redraw the world
*/
function draw_world(world, context) {
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
}

function GetBodyAtMouse(includeStatic) {
    var mouse_p = new Physics.Vec2(mouse_x, mouse_y);

    var aabb = new Physics.AABB();
    aabb.lowerBound.Set(mouse_x - 0.001, mouse_y - 0.001);
    aabb.upperBound.Set(mouse_x + 0.001, mouse_y + 0.001);

    var body = null;

    // Query the world for overlapping shapes.
    function GetBodyCallback(fixture) {
        var shape = fixture.GetShape();

        if (fixture.GetBody().GetType() != Physics.Body.b2_staticBody || includeStatic) {
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);

            if (inside) {
                body = fixture.GetBody();
                return false;
            }
        }

        return true;
    }

    world.QueryAABB(GetBodyCallback, aabb);
    return body;
}

function get_real(p) {
    return new Physics.Vec2(p.x + 0, canvas_height_m - p.y);
}

function step() {
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

    entityList[0].render();
    //call this function again after 1/60 seconds or 16.7ms
    setTimeout(step, 1000 / fps);
}