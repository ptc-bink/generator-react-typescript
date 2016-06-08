import { BaseGenerator, Features, Generators } from '../base';

const fs = require('fs');
const _ = require('lodash');

export = class extends BaseGenerator {

    name: string;
    themes: string[] = [];

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {

        this.argument('name', { type: String, required: false, desc: 'component name' });

        this.option('stateless', {
            desc: 'Create a stateless component instead of a full one',
            defaults: true
        });

        this.option('themeless', {
            desc: `Skip theme's selection`,
            defaults: false
        });

        this.composeWith('react-typescript:components-index', {});
    }

    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter component name:',
                default: this.name,
                when: !this.name
            },
            {
                type: 'checkbox',
                name: 'themes',
                message: 'Select component themes to add:',
                store: true,                
                when: !this.options['themeless'] && this.settings.themes.length > 0,
                choices: this.settings.themes
            }
        ];

        return this.ask(prompts).then((answers) => {
            this.name = answers.name || this.name;
            this.themes = answers.themes || this.themes || [];
        });
    }

    async writing() {
        await this.copyTpl(
            this.templatePath('component.tsx.ejs'),
            this.destinationPath(this.settings.src, `components`, this.name, `index.tsx`),
            { name: this.name }
        )

        await this.copyTpl(
            this.templatePath('style.d.ts.ejs'),
            this.destinationPath(this.settings.src, 'components', this.name, 'style.d.ts'),
            { name: this.name }
        );

        await this.copyTpl(
            this.templatePath('theme.scss.ejs'),
            this.destinationPath(this.settings.src, 'components', this.name, '_theme.scss'),
            { theme: 'default', component: this.name }
        );

        if (this.settings.hasFeature(Features.storybook)) {
            this.exec(Generators.stories, [this.name]);
        }

        for (var index = 0; index < this.themes.length; index++) {
            var theme = this.themes[index];
            this.exec(Generators.componentTheme, [this.name, theme], { 'update-index': false });
        }

        this.exec(Generators.componentThemeIndex, [this.name]);
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }

};