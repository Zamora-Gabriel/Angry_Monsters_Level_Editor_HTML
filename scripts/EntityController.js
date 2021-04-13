// Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora
'use strict';

import Physics from './libs/Physics.js';

const TIMESTEP = 1 / 60;

const VELOCITY = 10;

const POSITION = 10;

const TWO_PI = 2 * Math.PI;

const RAD_2_DEG = 180 / Math.PI;

const SCALE = 100; // 100px = 1 meter

export default class EntityController {
    constructor(world, $el, isStatic) {

        let x = y = width = height = 0;

        this.controller = world;

        this.$view = $el;
        this.model = this._createModel(x, y, width, height, isStatic);
        this.userData = { domObj: $el, width: width, height: height };

        // Reset DOM object position for use with CSS3 positioning
        this.$view.css({ 'left': '0px', 'top': '0px' });
    }

    _createModel(x, y, width, height) {

        // Body definition
        let bodyDef = new Physics.BodyDef();
        // Set type
        bodyDef.type = Physics.Body.b2_dynamicBody;
        bodyDef.position.x = x / SCALE;
        bodyDef.position.y = y / SCALE;

        // Fixture definition
        let fixDef = new Physics.FixtureDef;
        fixDef.shape = new Physics.PolygonShape;

        fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
        fixDef.density = 4.0; // density * area = mass
        fixDef.friction = 0.7; // 1 = sticky, 0 = slippery
        fixDef.restitution = 0.2; // 1 = very bouncy, 0 = no bounce

        let world = this.controller.getModel();
        let body = this.world._createBody(bodyDef);

        body.CreateFixture(fixDef);

        return body;
    }

    render() {
        let mdl = this.model;
        let screenX = mdl.xf.position.x * SCALE;
        let screen = mdl.xf.position.y * SCALE;

        // Calculate translation and rotation
        let x = Math.floor(screenX - mdl.userData.width);
        let y = Math.floor(screen - mdl.userData.height);

        let sweepN2Pi = this.model.sweep.a + TWO_PI;

        let sweepN2PIRadians = (sweepN2Pi % TWO_PI) * RAD_2_DEG;
        let rotDeg = Math.round(sweepN2PIRadians * 100) / 100;

        // Update transforms
        this.$view.css({ 'transform': `translate(${x}px, ${y}px) rotate(${rotDeg}deg)` });
    }
}