import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures } from '../base';

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
                    { value: Features.redux, short: 'Redux', name: 'Redux - state management' },
                    { value: Features.router, short: 'React Router', name: 'React Router' },
                    { value: Features.webpack, short: 'Webpack', name: 'Webpack - build tool' },
                    { value: Features.typings, short: 'Typings', name: 'Typings - essential Typescript definitions' },
                    { value: Features.vscode, short: 'VSCode', name: 'VScode - settings for best Typescript IDE' }
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
                    { value: ReduxFeatures.devtools, short: 'devtools', name: 'Redux devtools' },
                    { value: ReduxFeatures.thunk, short: 'thunk', name: 'Redux Thunk' },
                    { value: ReduxFeatures.saga, short: 'saga', name: 'Redux Saga' }
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