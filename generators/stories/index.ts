import { BaseGenerator, Features, Generators } from '../base';
import { accentOn } from '../utils';

const fs = require('fs');
const _ = require('lodash');

export = class extends BaseGenerator {

    public component: string;

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.argument('component', { type: String, required: false, desc: 'component name' });

        if (this.settings.hasFeature(Features.storybook)) {
            this.exec(Generators.storybook);
        }
    }

    prompting() {
        if (this.getComponents().length === 0)
            throw Error('Please register at least one component first.');

        var prompts = [
            {
                type: 'list',
                name: 'component',
                message: 'Select component:',
                default: this.component,
                when: !this.component,
                choices: this.getComponents()
            }
        ];

        return this.ask(prompts).then((answers) => {
            this.component = answers.component || this.component;
        });
    }

    async writing() {

        this.log(`Generating ${accentOn('stories')} file for ${this.component} component:`);

        await this.copyTpl(
            this.templatePath('stories.tsx.ejs'),
            this.destinationPath(this.settings.src, `components`, this.component, `stories.tsx`),
            {
                component: this.component
            }
        )
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }

};