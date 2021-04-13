//Copyright (C) 2021 Gabriel Zamora

// Copyright (C) 2021 Gabriel Zamora
'use strict';

import App from './App.js';
import Editor from './Editor.js';
import Game from './Game.js';
import ObjWindow from './ObjWindow.js';

//main
(function Main() {

    $(document).ready(event => {
        const app = new App();
        const game = new Game();

        game.run();
    })

})()