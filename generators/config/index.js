"use strict";
const base_1 = require('../base');
module.exports = class extends base_1.BaseGenerator {
    /* Where you prompt users for options (where you'd call this.prompt()) */
    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Your project name:',
                store: true,
                default: this.appname // Default to current folder name
            }, {
                type: 'input',
                name: 'src',
                message: 'Sources root directory:',
                store: true,
                default: this.settings.src || 'src'
            }, {
                type: 'input',
                name: 'bin',
                message: 'Build root directory:',
                store: true,
                default: this.settings.bin || 'bin'
            }, {
                type: 'checkbox',
                name: 'features',
                message: 'Select additional features:',
                store: true,
                choices: [
                    { value: base_1.Features.redux, short: 'Redux', name: 'Redux - state management' },
                    { value: base_1.Features.router, short: 'React Router', name: 'React Router' },
                    { value: base_1.Features.webpack, short: 'Webpack', name: 'Webpack - build tool' },
                    { value: base_1.Features.typings, short: 'Typings', name: 'Typings - essential Typescript definitions' },
                    { value: base_1.Features.vscode, short: 'VSCode', name: 'VScode - settings for best Typescript IDE' }
                ],
                default: this.settings.features
            }, {
                type: 'list',
                name: 'css',
                message: 'Select CSS preprocessor:',
                store: true,
                choices: [
                    { value: base_1.CssPreprocessor.none, short: 'None', name: `None, I will write plain CSS` },
                    { value: base_1.CssPreprocessor.scss, short: 'SCSS', name: 'SCSS' }
                ],
                default: this.settings.css
            },
            {
                type: 'checkbox',
                name: 'redux',
                message: 'Select redux features:',
                store: true,
                choices: [
                    { value: base_1.ReduxFeatures.logger, short: 'logger', name: 'Redux logger' },
                    { value: base_1.ReduxFeatures.devtools, short: 'devtools', name: 'Redux devtools' },
                    { value: base_1.ReduxFeatures.thunk, short: 'thunk', name: 'Redux Thunk' },
                    { value: base_1.ReduxFeatures.saga, short: 'saga', name: 'Redux Saga' }
                ],
                default: this.settings.redux
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
}
;
