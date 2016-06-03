import * as Generators from 'yeoman-generator';

const fs = require('fs');
const _ = require('lodash');

function isComponentDirectory(filename, componentsPath) {
    return fs.statSync(`${componentsPath}/${filename}`).isDirectory()
        && fs.statSync(`${componentsPath}/${filename}/${filename}.tsx`).isFile();
}

function getComponents(componentsPath) {
    try {
        if (!fs.statSync(componentsPath).isDirectory())
            return [];
    }
    catch (e) {
        return [];
    }

    return _.filter(fs.readdirSync(componentsPath), filename => isComponentDirectory(filename, componentsPath));
}

module.exports = Generators.Base.extend({
    constructor: function () {
        Generators.Base.apply(this, arguments);
        this.argument('name', { type: String, required: false });
    },

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {

    },

    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Theme name',
                default: this.name,
                when: !this.name
            }
        ];

        return this.prompt(prompts).then((answers) => {
            this.name = answers.name || this.name;
            this.srcPath = this.config.get('src')
        });
    },

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring() {
        var themes = this.config.get('themes') || [];
        themes.push(this.name);

        this.config.set('themes', themes);
    },

    writing: {
        all() {
            const themes = this.config.get('themes') || [];
            const componentsPath = this.destinationPath(this.srcPath, 'components');
            const components = getComponents(componentsPath);

            console.log(themes);

            components.forEach(component => {
                this.fs.copyTpl(
                    this.templatePath('theme.scss.ejs'),
                    this.destinationPath(this.srcPath, `components/${component}/theme-${this.name}.scss`),
                    {
                        theme: this.name,
                        component: component
                    }
                );

                this.fs.copyTpl(
                    this.templatePath('style.scss.ejs'),
                    this.destinationPath(this.srcPath, `components/${component}/style.scss`),
                    {
                        themes: themes,
                        component: component
                    }
                );
            });
        }
    },

    /* Called last, cleanup, say good bye, etc */
    end() {

    }
});