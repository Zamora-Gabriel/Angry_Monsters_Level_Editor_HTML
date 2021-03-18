// Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class ObjWindow {

    constructor() {

    }

    checkbttn() {

        // Get the object editor modal
        let modal = $("#object_modal");

        // Get the button that opens the modal
        let btn = $("#create-obj-bttn");

        // Open Modal
        btn.click(event => {
            modal.addClass("visible");
        });

        // To close object editor
        let span = $("#obj_win_close");

        // When the "x" in the modal is clicked, close the modal
        span.click(event => {
            modal.removeClass("visible");
        });
    }

    checkbttnForTarget() {
        // Get the object editor modal
        let modal = $("#target_modal");

        // Get the button that opens the modal
        let btn = $("#create-target-bttn");

        // Open Modal
        btn.click(event => {
            modal.addClass("visible");
        });

        // To close object editor
        let span = $("#target_win_close");

        // When the "x" in the modal is clicked, close the modal
        span.click(event => {
            modal.removeClass("visible");
        });
    }
}