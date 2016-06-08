import { BaseGenerator } from '../base';
import { accentOn } from '../utils';

export = class extends BaseGenerator {

    public component: string;

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.argument('component', { type: String, required: false, desc: 'component name' });
    }

    prompting() {
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

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring() { }

    async writing() {

        this.log(`Generating ${accentOn(`component's theme index`)} file for component ${this.component}:`);

        return this.noConflict(() => {
            this.fs.copyTpl(
                this.templatePath('style.scss.ejs'),
                this.destinationPath(this.settings.src, `components/${this.component}/style.scss`),
                { themes: this.settings.themes, component: this.component }
            );
        });
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }
};