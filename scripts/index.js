//Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora

'use strict';

import Splash from './Splash.js';

//main
(function Main() {

    $(document).ready(event => {

        // Create a Splash page
        const splash = new Splash();

        // Load the names of the levels
        splash.updateCellHandlers();
    })
})()