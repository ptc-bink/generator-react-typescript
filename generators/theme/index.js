"use strict";
var Generators = require('yeoman-generator');
var fs = require('fs');
var _ = require('lodash');
function isComponentDirectory(filename, componentsPath) {
    return fs.statSync(componentsPath + "/" + filename).isDirectory()
        && fs.statSync(componentsPath + "/" + filename + "/" + filename + ".tsx").isFile();
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
                message: 'Theme name',
                default: this.name,
                when: !this.name
            }
        ];
        return this.prompt(prompts).then(function (answers) {
            _this.name = answers.name || _this.name;
            _this.srcPath = _this.config.get('src');
        });
    },
    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring: function () {
        var themes = this.config.get('themes') || [];
        themes.push(this.name);
        this.config.set('themes', themes);
    },
    writing: {
        all: function () {
            var _this = this;
            var themes = this.config.get('themes') || [];
            var componentsPath = this.destinationPath(this.srcPath, 'components');
            var components = getComponents(componentsPath);
            console.log(themes);
            components.forEach(function (component) {
                _this.fs.copyTpl(_this.templatePath('theme.scss.ejs'), _this.destinationPath(_this.srcPath, "components/" + component + "/theme-" + _this.name + ".scss"), {
                    theme: _this.name,
                    component: component
                });
                _this.fs.copyTpl(_this.templatePath('style.scss.ejs'), _this.destinationPath(_this.srcPath, "components/" + component + "/style.scss"), {
                    themes: themes,
                    component: component
                });
            });
        }
    },
    /* Called last, cleanup, say good bye, etc */
    end: function () {
    }
});
