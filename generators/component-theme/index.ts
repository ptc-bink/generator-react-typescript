import { BaseGenerator, Generators } from '../base';
import { accentOn } from '../utils';

export = class extends BaseGenerator {

    public theme: string;
    public component: string;

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.argument('component', { type: String, required: false, desc: 'component name' });
        this.argument('theme', { type: String, required: false, desc: 'theme name' });
        this.option('update-index', { type: Boolean, defaults: true, desc: 'update components themes index file (style)' });
    }

    prompting() {

        if (!this.settings.themes)
            throw Error('Please register at least one theme first.');

        var prompts = [
            {
                type: 'list',
                name: 'component',
                message: 'Select component:',
                default: this.component,
                when: !this.component,
                choices: this.getComponents()
            },
            {
                type: 'list',
                name: 'theme',
                message: 'Select theme:',
                default: this.theme,
                when: !this.theme,
                choices: this.settings.themes
            }
        ];

        return this.ask(prompts).then((answers) => {
            this.theme = answers.theme || this.theme;
            this.component = answers.component || this.component;
        });
    }

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring() { }

    async writing() {

        this.log(`Generating ${accentOn('component theme')} for component ${this.component} and theme ${this.theme}:`);

        await this.copyTpl(
            this.templatePath('theme.scss.ejs'),
            this.destinationPath(this.settings.src, `components/${this.component}/_theme-${this.theme}.scss`),
            { theme: this.theme, component: this.component }
        );

        if (this.options['update-index'])
            this.exec(Generators.componentThemeIndex, [this.component]);
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }
};