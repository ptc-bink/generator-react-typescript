import { BaseGenerator, Features, Generators } from '../base';
import { accentOn } from '../utils';

const fs = require('fs');
const _ = require('lodash');

export = class extends BaseGenerator {

    public name: string;

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.argument('name', { type: String, required: false, desc: 'theme name' });
    }

    prompting() { 
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter theme name:',
                default: this.name,
                when: !this.name
            }
        ];

        return this.ask(prompts).then((answers) => {
            this.name = answers.name || this.name;
        });
    }

    configuring() {
        this.settings.themes = this.settings.themes.concat([this.name]);
    }

    async writing() {
        
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }

};