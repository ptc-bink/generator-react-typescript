import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures } from '../base';

import { accentOn } from '../utils';

export = class extends BaseGenerator {
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
                    { value: Features.redux, short: 'Redux', name: `${accentOn(`Redux`)} - state management` },
                    { value: Features.router, short: 'React Router', name: `React ${accentOn(`Router`)}` },
                    { value: Features.webpack, short: 'Webpack', name: `${accentOn(`Webpack`)} - build tool` },
                    { value: Features.typings, short: 'Typings', name: `${accentOn(`Typings`)} - essential Typescript definitions` },
                    { value: Features.vscode, short: 'VSCode', name: `${accentOn(`VScode`)} - settings for best Typescript IDE` },
                    { value: Features.storybook, short: 'Storybook', name: `React ${accentOn(`Storybook`)} - develop and design React UI components without running your app` }
                ],
                default: this.settings.features
            }, {
                type: 'list',
                name: 'css',
                message: 'Select CSS preprocessor:',
                store: true,
                choices: [
                    { value: CssPreprocessor.none, short: 'None', name: `None, I will write plain CSS` },
                    { value: CssPreprocessor.scss, short: 'SCSS', name: 'SCSS' }
                ],
                default: this.settings.css
            },
            {
                type: 'checkbox',
                name: 'redux',
                message: 'Select redux features:',
                store: true,
                choices: [
                    { value: ReduxFeatures.logger, short: 'logger', name: 'Redux logger' },
                    { value: ReduxFeatures.devtools, short: 'devtools', name: 'Redux DevTools' },
                    { value: ReduxFeatures.thunk, short: 'thunk', name: 'Redux Thunk' },
                    { value: ReduxFeatures.saga, short: 'saga', name: 'Redux Saga' }
                ],
                default: this.settings.redux || [],
                when: (answers) => answers.features.indexOf(Features.redux) >= 0
            }
        ];

        return this.ask(prompts).then((answers) => {
            //this.settings.name = answers.name;
            this.settings.src = answers.src;
            this.settings.bin = answers.bin;
            this.settings.features = answers.features;
            this.settings.css = answers.css;
            this.settings.redux = answers.redux;
        });
    }
}