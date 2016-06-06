"use strict";
const base_1 = require('../base');
const fs = require('fs');
const _ = require('lodash');
module.exports = class extends base_1.default {
    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.argument('name', { type: String, required: false, desc: 'component name' });
        this.option('stateless', {
            desc: 'Create a stateless component instead of a full one',
            defaults: true
        });
    }
    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter component name:',
                default: this.name,
                when: !this.name
            }
        ];
        return this.prompt(prompts).then((answers) => {
            this.name = answers.name || this.name;
        });
    }
    writing() {
        super._writeComponent(this.name);
        super._writeThemes(this.name);
        super._writeComponentsIndex(super.getComponents().concat([this.name]));
    }
    /* Called last, cleanup, say good bye, etc */
    end() {
    }
}
;
