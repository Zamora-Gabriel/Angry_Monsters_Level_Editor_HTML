// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora
'use strict';

import Physics from './libs/Physics.js';

const TIMESTEP = 1 / 60;

const VELOCITY = 10;

const POSITION = 10;

const TWO_PI = 2 * Math.PI;

const RAD_2_DEG = 180 / Math.PI;

const SCALE = 20;

export default class EntityController {
    constructor(world, $el, isStatic) {

        let x = $el.position().left; // Hardcoded data, TODO: Check elements parameters
        let y = $el.position().top;
        let width = $el.width();
        let height = $el.height();

        this.controller = world;

        this.$view = $el // = $("#id-of-object")
        this.model = this._createModel(x, y, width, height, isStatic);
        this.userData = { domObj: $el, width: width, height: height };
        this.model.m_userData = this.userData;

        // Reset DOM object position for use with CSS3 positioning
        this.$view.css({ 'left': '0px', 'top': '0px' });
    }



    _createModel(x, y, width, height, isStatic, options) {

        //default setting
        options = $.extend(true, {
            'density': 1.0,
            'friction': 1.0,
            'restitution': 0.5
        }, options);

        var body_def = new Physics.BodyDef();

        // Set type
        body_def.type = Physics.Body.b2_dynamicBody;
        if (isStatic) {
            body_def.type = Physics.Body.b2_staticBody;
        }

        var fix_def = new Physics.FixtureDef();

        fix_def.density = options.density;
        fix_def.friction = options.friction;
        fix_def.restitution = options.restitution;

        fix_def.shape = new Physics.PolygonShape();

        fix_def.shape.SetAsBox(width / (2 * SCALE), height / (2 * SCALE));

        /*ERROR: Position setting*/
        body_def.position.Set(x / SCALE, y / SCALE);

        //body_def.type = options.type;
        body_def.userData = options.user_data;

        var body = this.controller.CreateBody(body_def);
        var fixture = body.CreateFixture(fix_def);

        return body;
    }

    render() {
        let mdl = this.model;
        let screenX = mdl.m_xf.position.x * SCALE;
        let screenY = mdl.m_xf.position.y * SCALE;

        // Calculate translation and rotation
        let x = Math.floor(screenX - mdl.m_userData.width);
        let y = Math.floor(screenY - mdl.m_userData.height);

        // Rotation
        let sweepN2Pi = this.model.m_sweep.a + TWO_PI;

        let sweepN2PIRadians = (sweepN2Pi % TWO_PI) * RAD_2_DEG;
        let rotDeg = Math.round(sweepN2PIRadians * 100) / 100;

        // Update transforms
        this.$view.css({ 'transform': `translate(${x}px, ${y}px) rotate(${rotDeg}deg)` });
    }
}