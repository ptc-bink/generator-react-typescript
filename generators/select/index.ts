import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures } from '../base';

var inquirer = require('inquirer');

enum Generators {
    config,
    init,
    component,
    container,
    theme,
    sync
}

export = class extends BaseGenerator {

    private generator: Generators;

    /* Where you prompt users for options (where you'd call this.prompt()) */
    public prompting() {

        let choices = [];

        if (!this.settings.initialized) {
            choices = [
                { value: Generators.init, short: 'init', name: `Generate a React Typescript project structure` },
                new inquirer.Separator(),
                { value: Generators.config, short: 'config', name: `Change generator settings` },
            ]
        }
        else {
            choices = [
                { value: Generators.component, short: 'component', name: 'Generate a new React component' },
                { value: Generators.container, short: 'container', name: 'Generate a new React data container' },
                { value: Generators.container, short: 'theme', name: 'Register a new components theme' },
                new inquirer.Separator(),
                { value: Generators.config, short: 'config', name: `Change generator's settings` },
                { value: Generators.sync, short: 'sync', name: `Syncronize all automatically generated files` },
            ]
        }

        var prompts = [{
            type: 'list',
            name: 'generator',
            message: 'Select generator to run:',
            store: false,
            choices: choices
        }];

        return this.prompt(prompts).then((answers) => {
            this.generator = answers.generator;

            switch (this.generator) {
                case Generators.component:
                    this.composeWith('react-typescript:component', {});
                    break;
                case Generators.container:
                    this.composeWith('react-typescript:container', {});
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
            }
        });
    }

}