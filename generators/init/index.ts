import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures } from '../base';

export = class extends BaseGenerator {

    /* Your initialization methods (checking current project state, getting configs, etc) */
    public initializing() {
        if (this.settings.hasFeature(Features.webpack)) {
            this.composeWith('react-typescript:webpack', {});
        }
    }

    /* Where you prompt users for options (where you'd call this.prompt()) */
    public prompting() { }

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    public configuring() { }

    /* Where you write the generator specific files (routes, controllers, etc) */
    public writing() {
        this._writePackage();
        this._writeTsConfig();
        this._writeApp();
        this._writeComponents();
        this._writeContainers();

        this.writePackageScript('build', `tsc -p .`);
        this.writePackageScript('start', `light-http -d ${this.settings.bin}`);

        if (this.settings.hasFeature(Features.vscode)) {
            this.writeVSCodeTask('build');
            this.writeVSCodeTask('start');
        }
    }

    /* Where installation are run (npm, bower) */
    public install() {

        this.npmInstall(['react', 'react-dom'], { save: true });

        if (this.settings.hasFeature(Features.redux)) {
            this.npmInstall(['redux', 'react-redux'], { save: true });

            if (this.settings.hasReduxFeature(ReduxFeatures.logger)) {
                this.npmInstall(['redux-logger'], { saveDev: true });
            }

            if (this.settings.hasReduxFeature(ReduxFeatures.devtools)) {
                this.npmInstall(['redux-devtools'], { saveDev: true });
            }

            if (this.settings.hasReduxFeature(ReduxFeatures.saga)) {
                this.npmInstall(['redux-saga'], { save: true });
            }

            if (this.settings.hasReduxFeature(ReduxFeatures.thunk)) {
                this.npmInstall(['redux-thunk'], { save: true });
            }
        }

        if (this.settings.hasFeature(Features.router)) {
            this.npmInstall(['react-router'], { save: true });
        }

        if (this.settings.hasFeature(Features.typings)) {
            this.npmInstall(['typings'], { saveDev: true }, () => {
                this.spawnCommand('typings', ['install', '--save', '--global', 'dt~react', 'dt~react-dom', 'dt~redux']);

                if (this.settings.hasReduxFeature(ReduxFeatures.thunk)) {
                    this.spawnCommand('typings', ['install', '--save', '--global', 'dt~redux-thunk']);
                }

                if (this.settings.hasReduxFeature(ReduxFeatures.saga)) {
                    this.spawnCommand('typings', ['install', '--save', '--global', 'dt~redux-saga']);
                }
            });
        }
    }

    /* Called last, cleanup, say good bye, etc */
    public end() {
        this.settings.initialized = true;

        if (this.settings.hasFeature(Features.vscode)) {
            this.spawnCommand('code', ['.']);
        }
    }
}