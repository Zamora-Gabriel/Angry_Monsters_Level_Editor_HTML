//Copyright (C) 2021 Gabriel Zamora

// Copyright (C) 2021 Gabriel Zamora
'use strict';

import App from './App.js';

//main

(function Main() {

    $(document).ready(event => {
        const app = new App();
        app.run();
    })

})()