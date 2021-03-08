//Copyright (C) 2021 Gabriel Zamora

// Copyright (C) 2021 Gabriel Zamora
'use strict';

import App from './App.js';
import Editor from './Editor.js';

//main

(function Main() {

    $(document).ready(event => {
        const editor = new Editor();
        Editor.run();
    })

})()