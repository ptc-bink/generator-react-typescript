import BaseGenerator from '../base';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as glob from 'glob';
import * as path from 'path';
import { accentOn } from '../utils';

function getStories(componentsPath: string) {

    let stories = glob
        .sync(`**/stories.tsx`, { cwd: componentsPath })
        .map(filename => filename.replace(/\.[^/.]+$/, ""));

    return stories
}

export = class StorybookGenerator extends BaseGenerator {
    initializing() { }

    async writing() {

        await this.writeFiles();

        this.log(`Generating ${accentOn('storybook')} config file:`);

        let cwd = this.destinationPath('.storybook');

        let stories = getStories(this.componentsPath)
            .map(storyPath => path.join(this.componentsPath, storyPath))
            .map(storyPath => path.relative(cwd, storyPath))
            .map(storyPath => storyPath.replace(new RegExp('\\' + '\\', 'g'), '/'));

        await super.noConflict(() => {
            this.fs.copyTpl(
                this.templatePath('config.js.ejs'),
                this.destinationPath('.storybook', 'config.js'),
                {
                    stories
                }
            );
        });
    }

    /* Where installation are run (npm, bower) */
    install() { }

    /* Called last, cleanup, say good bye, etc */
    end() { }
}