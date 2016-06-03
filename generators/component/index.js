const fs = require('fs');
const _ = require('lodash');
const Generators = require('yeoman-generator');

function isComponentDirectory(filename, componentsPath) {
    try {
        return fs.statSync(`${componentsPath}/${filename}`).isDirectory()
            && fs.statSync(`${componentsPath}/${filename}/index.tsx`).isFile();
    }
    catch (e) {
        return false;
    }
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

        this.option('stateless', {
            desc: 'Create a stateless component instead of a full one',
            defaults: true
        });
    },

    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Component name',
                default: this.name,
                when: !this.name
            }
        ];

        return this.prompt(prompts).then((answers) => {
            this.name = answers.name || this.name;
            this.srcPath = this.config.get('src')
        });
    },

    writing: {

        source: function () {
            this.fs.copyTpl(
                this.templatePath('component.tsx.ejs'),
                this.destinationPath(this.srcPath, `components/${this.name}/index.tsx`),
                {
                    name: this.name
                }
            );
        },

        themes: function () {
            const themes = this.config.get('themes') || [];

            this.fs.copyTpl(
                this.templatePath('theme.scss.ejs'),
                this.destinationPath(this.srcPath, `components/${this.name}/theme.scss`),
                {
                    theme: 'default',
                    component: this.name
                }
            );

            themes.forEach(theme => {
                this.fs.copyTpl(
                    this.templatePath('theme.scss.ejs'),
                    this.destinationPath(this.srcPath, `components/${this.name}/theme-${theme}.scss`),
                    {
                        theme: theme,
                        component: this.name
                    }
                );
            });

            this.fs.copyTpl(
                this.templatePath('style.scss.ejs'),
                this.destinationPath(this.srcPath, `components/${this.name}/style.scss`),
                {
                    themes: themes
                }
            );

            this.fs.copyTpl(
                this.templatePath('style.d.ts.ejs'),
                this.destinationPath(this.srcPath, `components/${this.name}/style.d.ts`),
                {
                    name: this.srcPath
                }
            );
        },

        index: function () {
            const componentsPath = this.destinationPath(this.srcPath, 'components');
            const components = getComponents(componentsPath);

            if (components.indexOf(this.name) < 0)
                components.push(this.name);

            this.fs.copyTpl(
                this.templatePath('index.ts.ejs'),
                this.destinationPath(this.srcPath, 'components/index.ts'),
                {
                    components: components.sort()
                }
            );
        }
    }
});