const fs = require('fs');
const _ = require('lodash');
const Generators = require('yeoman-generator');

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

    config: function () {
        var themes = this.config.get('themes') || [];
        themes.push(this.name);
        
        this.config.set('themes', themes);
    },

    writing() {
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
});