import BaseGenerator from '../base';

var _ = require('lodash');
var extend = _.merge;

export = class extends BaseGenerator {

    private settings;

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        console.log('initializing');
    }

    /* Where you prompt users for options (where you'd call this.prompt()) */
    prompting() {
        console.log('prompting');

        const frameworks = ['None', 'React'];

        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname // Default to current folder name
            }, {
                type: 'input',
                name: 'src',
                message: 'Sources root directory',
                default: 'src'
            }, {
                type: 'input',
                name: 'bin',
                message: 'Build root directory',
                default: 'bin'
            }, {
                type: 'list',
                name: 'framework',
                message: 'Select framework',
                choices: [
                    'None',
                    'React'
                ]
            }, {
                type: 'checkbox',
                name: 'react',
                message: 'Select React frameworks',
                choices: [
                    'Redux',
                    'Webpack'
                ],
                when: (answers) => answers.framework === 'React'
            }, {
                type: 'checkbox',
                name: 'ide',
                message: 'Select ide',
                choices: [
                    'Visual Studio Code'
                ]
            }
        ];

        return this.prompt(prompts).then((answers) => {
            this.settings = {
                name: answers.name,
                src: answers.src,
                bin: answers.bin,
                framework: answers.framework
            }
        });
    }

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring(): void {
        this.config.set('src', this.settings.src);
        this.config.set('bin', this.settings.bin);
        this.config.set('framework', this.settings.framework);
    }

    /* Where you write the generator specific files (routes, controllers, etc) */
    public writing() {
        this._writePackage();
        this._writeTsConfig();
        this._writeApp();
        this._writeComponents();
        this._writeContainers();
    }

    /* Where conflicts are handled (used internally) */
    //conflicts() { },

    /* Where installation are run (npm, bower) */
    public install() {

        console.log('install');

        this.npmInstall(['react', 'react-dom'], { save: true });

        console.log('install 2');

        this.npmInstall(['webpack', 'typings'], { saveDev: true }, () => {
            this.spawnCommand('typings', ['install', '--save', '--global', 'dt~react', 'dt~react-dom']);
        });

        console.log('install 3');
    }

    /* Called last, cleanup, say good bye, etc */
    end() {
        console.log('end');
    }
};