import { BaseGenerator, Features, Generators } from '../base';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as glob from 'glob';
import * as path from 'path';

export = class extends BaseGenerator {
    initializing() {

    }

    async writing() {
        this.writePackageScript('storybook', `start-storybook -p 9001`);

        if (this.settings.hasFeature(Features.vscode))
            this.writeVSCodeTask('storybook');

        await this.copyTpl(
            this.templatePath('webpack.config.js.ejs'),
            this.destinationPath('.storybook', 'webpack.config.js'),
            {}
        );

        this.exec(Generators.storybook);
    }

    /* Where installation are run (npm, bower) */
    install() {
        this.npmInstall(['@kadira/storybook'], { saveDev: true });
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }
}