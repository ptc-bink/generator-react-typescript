"use strict";
const base_1 = require('../base');
module.exports = class extends base_1.default {
    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.argument('name', { type: String, required: false, desc: 'theme name' });
    }
    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter theme name:',
                default: this.name,
                when: !this.name
            }
        ];
        return this.prompt(prompts).then((answers) => {
            this.name = answers.name || this.name;
        });
    }
    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring() {
        this.settings.themes = this.settings.themes.concat([this.name]);
    }
    writing() {
        super._writeTheme(this.name);
    }
    /* Called last, cleanup, say good bye, etc */
    end() {
    }
}
;
