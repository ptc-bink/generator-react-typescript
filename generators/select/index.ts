import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures, Generators } from '../base';

var inquirer = require('inquirer');


export = class extends BaseGenerator {

    private generator: Generators;

    /* Where you prompt users for options (where you'd call this.prompt()) */
    public prompting() {

        let choices = [];

        if (!this.settings.initialized) {
            choices = [
                { value: Generators.init, short: 'init', name: `Generate a React Typescript project structure` },
                new inquirer.Separator(),
                { value: Generators.webpack, short: 'webpack', name: `Generate a Webpack config file` },
                { value: Generators.storybook, short: 'storybook', name: `Generate a React storybook config` },                
                { value: Generators.config, short: 'config', name: `Change generator settings` }
            ]
        }
        else {
            choices = [
                { value: Generators.component, short: 'component', name: 'Generate a new React component' },
                { value: Generators.container, short: 'container', name: 'Generate a new React data container' },
                { value: Generators.theme, short: 'theme', name: 'Register a new components theme' },
                new inquirer.Separator(),
                { value: Generators.config, short: 'config', name: `Change generator's settings` },
                { value: Generators.sync, short: 'sync', name: `Syncronize all automatically generated files` }
            ]
        }

        var prompts = [{
            type: 'list',
            name: 'generator',
            message: 'Select generator to run:',
            store: false,
            choices: choices
        }];

        return this.ask(prompts).then((answers) => {
            this.generator = answers.generator;

            switch (this.generator) {
                case Generators.component:
                    this.composeWith('react-typescript:component', {});
                    break;
                case Generators.container:
                    this.composeWith('react-typescript:container', {});
                    break;
                case Generators.theme:
                    this.composeWith('react-typescript:theme', {});
                    break;
                case Generators.init:
                    this.composeWith('react-typescript:init', {});
                    break;
                case Generators.config:
                    this.composeWith('react-typescript:config', {});
                    break;
                case Generators.sync:
                    this.composeWith('react-typescript:sync', {});
                    break;
                case Generators.webpack:
                    this.composeWith('react-typescript:webpack', {});
                    break;
                case Generators.storybook:
                    this.composeWith('react-typescript:storybook', {});
                    break;                
            }
        });
    }

}