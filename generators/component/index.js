"use strict";
var Generators = require('yeoman-generator');
var fs = require('fs');
var _ = require('lodash');
function isComponentDirectory(filename, componentsPath) {
    try {
        return fs.statSync(componentsPath + "/" + filename).isDirectory()
            && fs.statSync(componentsPath + "/" + filename + "/index.tsx").isFile();
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
    return _.filter(fs.readdirSync(componentsPath), function (filename) { return isComponentDirectory(filename, componentsPath); });
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
    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing: function () {
    },
    prompting: function () {
        var _this = this;
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Component name',
                default: this.name,
                when: !this.name
            }
        ];
        return this.prompt(prompts).then(function (answers) {
            _this.name = answers.name || _this.name;
            _this.srcPath = _this.config.get('src');
        });
    },
    writing: {
        source: function () {
            this.fs.copyTpl(this.templatePath('component.tsx.ejs'), this.destinationPath(this.srcPath, "components/" + this.name + "/index.tsx"), {
                name: this.name
            });
        },
        themes: function () {
            var _this = this;
            var themes = this.config.get('themes') || [];
            this.fs.copyTpl(this.templatePath('theme.scss.ejs'), this.destinationPath(this.srcPath, "components/" + this.name + "/theme.scss"), {
                theme: 'default',
                component: this.name
            });
            themes.forEach(function (theme) {
                _this.fs.copyTpl(_this.templatePath('theme.scss.ejs'), _this.destinationPath(_this.srcPath, "components/" + _this.name + "/theme-" + theme + ".scss"), {
                    theme: theme,
                    component: _this.name
                });
            });
            this.fs.copyTpl(this.templatePath('style.scss.ejs'), this.destinationPath(this.srcPath, "components/" + this.name + "/style.scss"), {
                themes: themes
            });
            this.fs.copyTpl(this.templatePath('style.d.ts.ejs'), this.destinationPath(this.srcPath, "components/" + this.name + "/style.d.ts"), {
                name: this.srcPath
            });
        },
        index: function () {
            var componentsPath = this.destinationPath(this.srcPath, 'components');
            var components = getComponents(componentsPath);
            if (components.indexOf(this.name) < 0)
                components.push(this.name);
            this.fs.copyTpl(this.templatePath('index.ts.ejs'), this.destinationPath(this.srcPath, 'components/index.ts'), {
                components: components.sort()
            });
        }
    },
    /* Called last, cleanup, say good bye, etc */
    end: function () {
    }
});
