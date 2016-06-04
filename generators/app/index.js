"use strict";
const base_1 = require('../base');
var _ = require('lodash');
var extend = _.merge;
module.exports = class extends base_1.BaseGenerator {
    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
    }
    /* Where you prompt users for options (where you'd call this.prompt()) */
    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'your project name',
                store: true,
                default: this.appname // Default to current folder name
            }, {
                type: 'input',
                name: 'src',
                message: 'sources root directory',
                store: true,
                default: 'src'
            }, {
                type: 'input',
                name: 'bin',
                message: 'build root directory',
                store: true,
                default: 'bin'
            }, {
                type: 'checkbox',
                name: 'features',
                message: 'select additional features',
                store: true,
                choices: [
                    { value: base_1.Features.redux, short: 'Redux', name: 'Redux - state management' },
                    { value: base_1.Features.router, short: 'React Router', name: 'React Router' },
                    { value: base_1.Features.webpack, short: 'Webpack', name: 'Webpack - build tool' },
                    { value: base_1.Features.typings, short: 'Typings', name: 'Typings - essential Typescript definitions' },
                    { value: base_1.Features.vscode, short: 'VSCode', name: 'VScode - settings for best Typescript IDE' }
                ]
            }, {
                type: 'list',
                name: 'css',
                message: 'select CSS preprocessor',
                store: true,
                choices: [
                    { value: base_1.CssPreprocessor.none, short: 'None', name: `None, I will write plain CSS` },
                    { value: base_1.CssPreprocessor.scss, short: 'SCSS', name: 'SCSS' }
                ]
            },
            {
                type: 'checkbox',
                name: 'redux',
                message: 'select redux features',
                store: true,
                choices: [
                    { value: base_1.ReduxFeatures.logger, short: 'logger', name: 'Redux logger' },
                    { value: base_1.ReduxFeatures.devtools, short: 'devtools', name: 'Redux devtools' }
                ]
            }
        ];
        return this.prompt(prompts).then((answers) => {
            //this.settings.name = answers.name;
            this.settings.src = answers.src;
            this.settings.bin = answers.bin;
            this.settings.features = answers.features;
            this.settings.css = answers.css;
            this.settings.redux = answers.redux;
        });
    }
    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring() {
    }
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
    /* Where conflicts are handled (used internally) */
    //conflicts() { },
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
        }
        if (this.settings.hasFeature(base_1.Features.router)) {
            this.npmInstall(['react-router'], { save: true });
        }
        if (this.settings.hasFeature(base_1.Features.webpack)) {
            this.npmInstall(['webpack'], { saveDev: true });
        }
        if (this.settings.hasFeature(base_1.Features.typings)) {
            this.npmInstall(['typings'], { saveDev: true }, () => {
                this.spawnCommand('typings', ['install', '--save', '--global', 'dt~react', 'dt~react-dom']);
            });
        }
    }
    /* Called last, cleanup, say good bye, etc */
    end() {
        if (this.settings.hasFeature(base_1.Features.vscode)) {
            this.spawnCommand('code', ['.']);
        }
    }
}
;
