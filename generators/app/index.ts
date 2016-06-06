import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures } from '../base';

var welcome = require('yeoman-welcome');
var _ = require('lodash');
var extend = _.merge;

export = class extends BaseGenerator {

    /* Your initialization methods (checking current project state, getting configs, etc) */
    public initializing() {
        if (!(this.settings.src && this.settings.bin && this.settings.features && this.settings.css && this.settings.redux)) {
            this.composeWith('react-typescript:config', {});
        }

        this.composeWith('react-typescript:select', {});
    }

    /* Where you prompt users for options (where you'd call this.prompt()) */
    public prompting() {
        this.log(welcome);
    }

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    public configuring() { }

    /* Where you write the generator specific files (routes, controllers, etc) */
    public writing() { }

    /* Where installation are run (npm, bower) */
    public install() { }

    /* Called last, cleanup, say good bye, etc */
    public end() { }
};