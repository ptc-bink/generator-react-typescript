"use strict";
const base_1 = require('../base');
module.exports = class extends base_1.BaseGenerator {
    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        if (this.settings.hasFeature(base_1.Features.webpack)) {
            this.composeWith('react-typescript:webpack', {});
        }
    }
    /* Where you prompt users for options (where you'd call this.prompt()) */
    prompting() { }
    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring() { }
    /* Where you write the generator specific files (routes, controllers, etc) */
    writing() {
        this._writePackage();
        this._writeTsConfig();
        this._writeApp();
        this._writeComponents();
        this._writeContainers();
        if (this.settings.hasFeature(base_1.Features.webpack)) {
            this.writePackageScript('build', `webpack`);
            this.writePackageScript('start', `webpack-dev-server --port 9000 --hot --inline --public-path / --history-api-fallback --open`);
        }
        else {
            this.writePackageScript('build', `tsc -p .`);
            this.writePackageScript('start', `light-http -d ${this.settings.bin}`);
        }
        if (this.settings.hasFeature(base_1.Features.vscode)) {
            this.writeVSCodeTask('build');
            this.writeVSCodeTask('start');
        }
    }
    /* Where installation are run (npm, bower) */
    install() {
        this.npmInstall(['react', 'react-dom'], { save: true });
        if (this.settings.hasFeature(base_1.Features.redux)) {
            this.npmInstall(['redux', 'react-redux'], { save: true });
            if (this.settings.hasReduxFeature(base_1.ReduxFeatures.logger)) {
                this.npmInstall(['redux-logger'], { saveDev: true });
            }
            if (this.settings.hasReduxFeature(base_1.ReduxFeatures.devtools)) {
                this.npmInstall(['redux-devtools'], { saveDev: true });
            }
            if (this.settings.hasReduxFeature(base_1.ReduxFeatures.saga)) {
                this.npmInstall(['redux-saga'], { save: true });
            }
            if (this.settings.hasReduxFeature(base_1.ReduxFeatures.thunk)) {
                this.npmInstall(['redux-thunk'], { save: true });
            }
        }
        if (this.settings.hasFeature(base_1.Features.router)) {
            this.npmInstall(['react-router'], { save: true });
        }
        if (this.settings.hasFeature(base_1.Features.typings)) {
            this.npmInstall(['typings'], { saveDev: true }, () => {
                this.spawnCommand('typings', ['install', '--save', '--global', 'dt~react', 'dt~react-dom', 'dt~redux']);
                if (this.settings.hasReduxFeature(base_1.ReduxFeatures.thunk)) {
                    this.spawnCommand('typings', ['install', '--save', '--global', 'dt~redux-thunk']);
                }
                if (this.settings.hasReduxFeature(base_1.ReduxFeatures.saga)) {
                    this.spawnCommand('typings', ['install', '--save', '--global', 'dt~redux-saga']);
                }
            });
        }
    }
    /* Called last, cleanup, say good bye, etc */
    end() {
        this.settings.initialized = true;
        if (this.settings.hasFeature(base_1.Features.vscode)) {
            this.spawnCommand('code', ['.']);
        }
    }
}
;
