// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora
'use strict';

import Physics from './libs/Physics.js';

const TIMESTEP = 1 / 60;

const VELOCITY = 10;

const POSITION = 10;

const TWO_PI = 2 * Math.PI;

const RAD_2_DEG = 180 / Math.PI;

const SCALE = 20;

const YOffset = 620; // Offset for the translation between Y coordinates in screen and physics World

export default class EntityController {
    constructor(world, $el, isKinematic, isRound, options) {

        let x = $el.position().left; // Hardcoded data, TODO: Check elements parameters
        let y = $el.position().top;
        let width = $el.width();
        let height = $el.height();
        this.model;

        this.CannonTransformed = false;
        this.controller = world;

        this.$view = $el // = $("#id-of-object")
        if (!isRound) {
            this.model = this._createModel(x, y, width, height, isKinematic, options);
        } else {
            this.model = this._createBall(x, y, options);
        }
        this.userData = { domObj: $el, width: width, height: height, isKinematic: isKinematic };
        this.model.m_userData = this.userData;

        // Reset DOM object position for use with CSS3 positioning
        this.$view.css({ 'left': '0px', 'top': '0px' });
    }

    GetModel() {
        return this.model;
    }

    _createModel(x, y, width, height, isKinematic, options) {

        //default setting
        options = $.extend(true, {
            'density': 1.0,
            'friction': 1.0,
            'restitution': 0.5
        }, options);

        var body_def = new Physics.BodyDef();

        // Set type
        body_def.type = Physics.Body.b2_dynamicBody;
        if (isKinematic) {
            body_def.type = Physics.Body.b2_kinematicBody;
        }

        var fix_def = new Physics.FixtureDef();

        fix_def.density = options.density;
        fix_def.friction = options.friction;
        fix_def.restitution = options.restitution;

        fix_def.shape = new Physics.PolygonShape();

        fix_def.shape.SetAsBox(width / (2 * SCALE), height / (2 * SCALE));

        /*Fixed offset*/
        body_def.position.Set(x / SCALE, (-y + YOffset) / SCALE);

        //body_def.type = options.type;
        body_def.userData = options.user_data;

        var body = this.controller.CreateBody(body_def);
        body.CreateFixture(fix_def);

        return body;
    }

    //Function to create a round ball, sphere like object
    _createBall(x, y, options) {
        let body_def = new Physics.BodyDef();
        let fix_def = new Physics.FixtureDef();
        let radius = 1.5;

        fix_def.density = options.density || 1.0;
        fix_def.friction = 0.5;
        fix_def.restitution = 0.5;

        let shape = new Physics.CircleShape(radius);
        fix_def.shape = shape;

        body_def.position.Set(x / SCALE, (-y + YOffset) / SCALE);

        body_def.linearDamping = 0.0;
        body_def.angularDamping = 0.0;

        body_def.type = Physics.Body.b2_dynamicBody;
        body_def.userData = options.user_data;

        let b = this.controller.CreateBody(body_def);
        b.CreateFixture(fix_def);

        return b;
    }

    render() {
        let mdl = this.model;
        let screenX = (mdl.m_xf.position.x * SCALE);
        let screenY = YOffset - (mdl.m_xf.position.y * SCALE);

        // Calculate translation and rotation
        let x = Math.floor(screenX - mdl.m_userData.width / 2);
        let y = Math.floor(screenY - mdl.m_userData.height / 2);

        // Rotation
        let sweepN2Pi = this.model.m_sweep.a + TWO_PI;

        let sweepN2PIRadians = (sweepN2Pi % TWO_PI) * RAD_2_DEG;
        let rotDeg = Math.round(sweepN2PIRadians * 100) / 100;

        if (mdl.m_userData.isKinematic == false) {
            // Update transforms
            this.$view.css({ 'transform': `translate(${x}px, ${y}px) rotate(${rotDeg}deg)` });
        } else {

            // Check if cannon has been transformed
            if (!this.CannonTransformed) {
                // Update transform for cannon
                this.$view.css({ 'transform': `translate(${x}px, ${y}px)` });
                this.CannonTransformed = true;
            }
        }
    }

    rotateCannon(wMouseX, wMouseY) {

        console.log("rotatecanon")
        let mdl = this.model;
        let screenX = (mdl.m_xf.position.x * SCALE);
        let screenY = YOffset - (mdl.m_xf.position.y * SCALE);

        // Calculate translation and rotation
        let x = Math.floor(screenX - mdl.m_userData.width / 2);
        let y = Math.floor(screenY - mdl.m_userData.height / 2);

        // Vector between mouse and cannon
        let newX = wMouseX - mdl.m_xf.position.x;
        let newY = wMouseY - mdl.m_xf.position.y;

        let angleInRadians = Math.atan2(newY, newX);

        // Normalize vector
        let directionX = Math.sqrt(newX);
        let directionY = Math.sqrt(newY);

        // Rotation
        mdl.SetAngle(angleInRadians);

        let sweepN2PIRadians = (-angleInRadians) * RAD_2_DEG;
        let rotDeg = Math.round(sweepN2PIRadians * 100) / 100;


        // Update transform for cannon
        this.$view.css({ 'transform': `translate(${x}px, ${y}px) rotate(${rotDeg}deg)` });
    }

    GetAngle() {
        return this.model.GetAngle();
    }

    AddImpulse() {
        // this.model.ApplyImpulse(Physics.Vec2,rotation);
    }
}