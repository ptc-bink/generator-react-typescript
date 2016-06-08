import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures, Generators } from '../base';
import { extend, kebabCase } from 'lodash';

export = class extends BaseGenerator {

    /* Your initialization methods (checking current project state, getting configs, etc) */
    public initializing() {
        if (this.settings.hasFeature(Features.webpack)) {
            this.exec(Generators.webpack);
        }

        if (this.settings.hasFeature(Features.storybook)) {
            this.exec(Generators.initStorybook);
        }
    }

    /* Where you prompt users for options (where you'd call this.prompt()) */
    public prompting() { }

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    public configuring() { }

    /* Where you write the generator specific files (routes, controllers, etc) */
    public async writing() {
        const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        var pkg = extend({
            name: kebabCase(this.appname),
            main: `${this.settings.bin}/main.js`,
            scripts: {
                build: `tsc -p .`,
                start: `light-http -d ${this.settings.bin}`
            }
        }, currentPkg);

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);

        var tsconfig = this.fs.readJSON(this.destinationPath('tsconfig.json'), {});

        tsconfig = extend(tsconfig, {
            compilerOptions: {
                target: 'es6',
                module: "commonjs",
                moduleResolution: "node",
                jsx: "react",
                listFiles: false,
                isolatedModules: false,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                declaration: false,
                noImplicitAny: false,
                removeComments: false,
                noLib: false,
                preserveConstEnums: true,
                suppressImplicitAnyIndexErrors: true,
                outDir: this.settings.bin,
                inlineSourceMap: false,
                inlineSources: false,
                sourceMap: true
            },
            filesGlob: [
                `${this.settings.src}/**/*.d.ts`,
                `${this.settings.src}/**/*.ts`,
                `${this.settings.src}/**/*.tsx`,
                "typings/index.d.ts"
            ],
            exclude: [
                "node_modules",
                "jspm"
            ]
        });

        this.fs.writeJSON(this.destinationPath('tsconfig.json'), tsconfig);

        await this.copyTpl(
            this.templatePath('app.tsx.ejs'),
            this.destinationPath(`${this.settings.src}/app.tsx`),
            {
                appname: this.appname
            }
        );

        if (this.settings.hasFeature(Features.vscode)) {
            this.writeVSCodeTask('build');
            this.writeVSCodeTask('start');
        }

        await this.writeFiles();

        this.exec(Generators.componentsIndex);
        this.exec(Generators.containersIndex);
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