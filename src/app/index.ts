import * as YO from 'yeoman-generator';

var _ = require('lodash');
var extend = _.merge;

export = class AppGenerator extends YO.Base {

    private settings;

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {

    }

    /* Where you prompt users for options (where you'd call this.prompt()) */
    prompting(): void {
        const done = this.async();
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

        this.prompt(prompts, (answers) => {
            this.settings = {
                name: answers.name,
                src: answers.src,
                bin: answers.bin,
                framework: answers.framework
            }

            done();
        });
    }

    /* Saving configurations and configure the project (creating .editorconfig files and other metadata files) */
    configuring(): void {
        this.config.set('src', this.settings.src);
        this.config.set('bin', this.settings.bin);
        this.config.set('framework', this.settings.framework);
    }

    /* Where you write the generator specific files (routes, controllers, etc) */
    writing = {
        package(): void {

            var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

            var pkg = extend({
                name: _.kebabCase(this.settings.name),
                main: `${this.settings.bin}/main.js`,
                scripts: []
            }, currentPkg);

            this.fs.writeJSON(this.destinationPath('package.json'), pkg);
        },

        tsconfig() {
            var currentPkg = this.fs.readJSON(this.destinationPath('tsconfig.json'), {});

            var pkg = extend(currentPkg, {
                compilerOptions: {
                    target: 'es6',
                    module: "commonjs",
                    moduleResolution: "node",
                    jsx: "react",
                    listFiles: true,
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

            this.fs.writeJSON(this.destinationPath('tsconfig.json'), pkg);
        },

        app() {
            this.fs.copyTpl(
                this.templatePath('app.tsx.ejs'),
                this.destinationPath(`${this.settings.src}/app.tsx`),
                {
                    appname: this.settings.name
                }
            );
        },

        components() {
            this.fs.copyTpl(
                this.templatePath('components/index.ts.ejs'),
                this.destinationPath(`${this.settings.src}/components/index.ts`),
                {
                    appname: this.settings.name
                }
            );
        },

        containers() {
            this.fs.copyTpl(
                this.templatePath('containers/index.ts.ejs'),
                this.destinationPath(`${this.settings.src}/containers/index.ts`),
                {
                    appname: this.settings.name
                }
            );
        }
    }

    /* Where conflicts are handled (used internally) */
    //conflicts() { },

    /* Where installation are run (npm, bower) */
    install() {

        if (this.settings.framework === 'React') {
            this.npmInstall(['react', 'react-dom'], { save: true });
            this.npmInstall(['webpack', 'typings'], { saveDev: true });

            //this.spawnCommand('typings', ['install', '--save', '--global', 'react', 'react-dom']);
        }

    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }
};