const fs = require('fs');
const _ = require('lodash');
const Generators = require('yeoman-generator');

function isContainerFile(filename, containersPath, layout) {
    if (layout) {
        return fs.statSync(`${containersPath}/${layout}`).isDirectory()
            && fs.statSync(`${containersPath}/${layout}/${filename}`).isFile();
    }
    else
        return fs.statSync(`${containersPath}/${filename}`).isFile();
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
        .filter(filename => isContainerFile(filename, containersPath))
        .filter(filename => filename != 'index.ts')
        .map(filename => filename.replace(/\.[^/.]+$/, ""))
        .values();
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
                message: 'Container name',
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
                this.templatePath('container.tsx.ejs'),
                this.destinationPath(this.srcPath, `containers/${this.name}.tsx`),
                {
                    name: this.name
                }
            );
        },

        index: function () {
            const containersPath = this.destinationPath(this.srcPath, 'containers');
            containers = getContainers(containersPath);

            if (containers.indexOf(this.name) < 0)
                containers = containers.push(this.name);

            containers = containers.sort();

            this.fs.copyTpl(
                this.templatePath('index.ts.ejs'),
                this.destinationPath(this.srcPath, 'containers/index.ts'),
                {
                    containers: containers.sort()
                }
            );
        }
    }
});