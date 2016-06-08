import { BaseGenerator, Features} from '../base';
import { accentOn } from '../utils';

const fs = require('fs');
const _ = require('lodash');

export = class extends BaseGenerator {

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() { }

    prompting() { }

    async writing() {
        this.log(`Generating ${accentOn(`containers index`)} file:`)

        await this.noConflict(() => {
            this.fs.copyTpl(
                this.templatePath('index.ts.ejs'),
                this.destinationPath(this.settings.src, 'containers', 'index.ts'),
                {
                    containers: super.getContainers().sort()
                }
            );
        });
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }

};