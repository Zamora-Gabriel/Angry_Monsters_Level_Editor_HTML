//Copyright (C) 2021 Haojun Liu, Daiyong Kim, Gabriel Zamora

'use strict';
import Request from './Request.js';
import Game from './Game.js';

//main

export default class Splash {

    constructor() {

        this.game;
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

        this.__initSplash();
        this.updateCellHandlers();
    }

    __initSplash() {
        // hide end screen
        $('.end-screen').hide();
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

    updateCellHandlers() {
        $(".play-now-btn").on('click', event => {
            console.log("CLICKED");
            this.game = new Game();
            $('.splash-screen').hide();
            $('.game-screen').show();
            this.game.run();

        });

        $("#level-loader").on("click", event => {
            console.log("CLICKED button");

            let userPickedLevel = $("#level-list :selected").val();
            //pass in level name
            this.game = new Game(userPickedLevel);
            $('.splash-screen').hide();
            $('.game-screen').show();
            this.game.run();

        });
    }

    run() {
        this.game.run();
    }

    _showErrorDialog(error) {
        // Not found user error
        if (error == 2) { alert("User is not found in the server"); }

        // Load error
        alert("Data couldn't be loaded");
    }


}