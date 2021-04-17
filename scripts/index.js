//Copyright (C) 2021 Gabriel Zamora

// Copyright (C) 2021 Gabriel Zamora
'use strict';

import App from './App.js';
import Editor from './Editor.js';
import Game from './Game.js';
import ObjWindow from './ObjWindow.js';
import Splash from'./Splash.js';
import World from './World.js';

//main
(function Main() {

    $(document).ready(event => {
        /*const app = new App();*/

     //   cont splash = new Splash();
//need a flag , if pressed the button, run game continuely


        const splash = new Splash();
        splash.updateCellHandlers();


        //const world = new World();

    })

})()