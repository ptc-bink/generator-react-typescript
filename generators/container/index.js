"use strict";
var fs = require('fs');
var _ = require('lodash');
var Generators = require('yeoman-generator');
function isContainerFile(filename, containersPath, layout) {
    if (layout) {
        return fs.statSync(containersPath + "/" + layout).isDirectory()
            && fs.statSync(containersPath + "/" + layout + "/" + filename).isFile();
    }
    else
        return fs.statSync(containersPath + "/" + filename).isFile();
}
function getContainers(containersPath) {
    try {
        if (!fs.statSync(containersPath).isDirectory())
            return [];
    }
    catch (e) {
        return [];
    }
    return _(fs.readdirSync(containersPath))
        .filter(function (filename) { return isContainerFile(filename, containersPath); })
        .filter(function (filename) { return filename != 'index.ts'; })
        .map(function (filename) { return filename.replace(/\.[^/.]+$/, ""); })
        .values();
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
                message: 'Container name',
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
            this.fs.copyTpl(this.templatePath('container.tsx.ejs'), this.destinationPath(this.srcPath, "containers/" + this.name + ".tsx"), {
                name: this.name
            });
        },
        index: function () {
            var containersPath = this.destinationPath(this.srcPath, 'containers');
            var containers = getContainers(containersPath);
            if (containers.indexOf(this.name) < 0)
                containers = containers.push(this.name);
            containers = containers.sort();
            this.fs.copyTpl(this.templatePath('index.ts.ejs'), this.destinationPath(this.srcPath, 'containers/index.ts'), {
                containers: containers.sort()
            });
        }
    },
    /* Called last, cleanup, say good bye, etc */
    end: function () {
    }
});
