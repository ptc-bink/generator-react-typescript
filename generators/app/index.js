"use strict";
const base_1 = require('../base');
var welcome = require('yeoman-welcome');
var _ = require('lodash');
var extend = _.merge;
module.exports = class extends base_1.BaseGenerator {
    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        if (!(this.settings.src && this.settings.bin && this.settings.features && this.settings.css && this.settings.redux)) {
            this.composeWith('react-typescript:config', {});
        }
        this.composeWith('react-typescript:select', {});
    }
    /* Where you prompt users for options (where you'd call this.prompt()) */
    prompting() {
        this.log(welcome);
    }
    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring() { }
    /* Where you write the generator specific files (routes, controllers, etc) */
    writing() { }
    /* Where installation are run (npm, bower) */
    install() { }
    /* Called last, cleanup, say good bye, etc */
    end() { }
}
;
