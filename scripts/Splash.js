//Copyright (C) 2021 Gabriel Zamora

// Copyright (C) 2021 Gabriel Zamora
'use strict';
import Request from './Request.js';
import App from './App.js';
import Editor from './Editor.js';
import Game from './Game.js';
import ObjWindow from './ObjWindow.js';
import World from './World.js';

//main

export default class Splash {

    constructor() {

        this._populateLevelList()
        .then(gameLevels => {
            if (gameLevels.error != 0) {
                this._showErrorDialog(gameLevels.error);
                return;
            }
            // Shove all level names to Select level field
            this._updateLevelList(gameLevels.payload);
        })
        .catch(error => { this._showErrorDialog(error) });

        this.updateCellHandlers();
        
    }

    _populateLevelList() {
        return new Promise((resolve, reject) => {

            // Build request
            let requestData = new Request();

            // Get user id
            requestData.userid = $("#id-placeholder").val();
            console.log("here");
            $.post('/api/get_level_list', requestData)
                .then(theLevelList => JSON.parse(theLevelList))
                .then(LevelList => {
                    //if successfull resolve (data)
                    resolve(LevelList);
                })
                .catch(error => {
                    //if not successfull reject (error)
                    reject(error);
                })
        })
    }


    _updateLevelList(levelList) {
        //Fill the level list

        const $optionList = $('#level-list');
        levelList.forEach(item => {
            // Debug names
            // console.log(item.name);
            let $option = $(`<option value="${item.name}"> ${item.name}</option>`);
            $optionList.append($option);
        });
    }

    updateCellHandlers(){
        $(".play-now-btn").on('click', event=>{ 
            console.log("CLICKED"); 
            const game = new Game();
            $('.splash-screen').hide();
            game.run();
          
        }) ;

        $("#level-loader").on("click", event => {
            console.log("CLICKED butn"); 

            let userPickedLevel = $("#level-list :selected").val();
            //pass in level name
            const game = new Game(userPickedLevel);
            $('.splash-screen').hide();
            game.run();
          
        }) ;
    }


    run() {
        game.run();
    }
         

    _showErrorDialog(error) {
        // Not found user error
        if (error == 2) { alert("User is not found in the server"); }

        // Load error
        alert("Data couldn't be loaded");
    }
  



    

}