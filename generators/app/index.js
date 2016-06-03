'use strict';

var _ = require('lodash');
var extend = _.merge;

const Generators = require('yeoman-generator');


module.exports = Generators.Base.extend({

    prompting() {

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
    },

    config: function () {
        this.config.set('src', this.settings.src);
        this.config.set('bin', this.settings.bin);
        this.config.set('framework', this.settings.framework);
    },

    writing: {
        package() {
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
                this.templatePath('app.tsx'),
                this.destinationPath(`${this.settings.src}/app.tsx`),
                {
                    appname: this.settings.name
                }
            );
        },

        components() {
            this.fs.copyTpl(
                this.templatePath('components/index.ts'),
                this.destinationPath(`${this.settings.src}/components/index.ts`),
                {
                    appname: this.settings.name
                }
            );
        },
        
        containers() {
            this.fs.copyTpl(
                this.templatePath('containers/index.ts'),
                this.destinationPath(`${this.settings.src}/containers/index.ts`),
                {
                    appname: this.settings.name
                }
            );
        }
    },

    installing: function () {

        if (this.settings.framework === 'React') {
            this.npmInstall(['react', 'react-dom'], { save: true });
            this.npmInstall(['webpack', 'typings'], { saveDev: true });

            //this.spawnCommand('typings', ['install', '--save', '--global', 'react', 'react-dom']);
        }

    },

    // prompting: function () {
    //     return this.prompt([{
    //         type: 'input',
    //         name: 'name',
    //         message: 'Your project name',
    //         default: this.appname // Default to current folder name
    //     }, {
    //             type: 'confirm',
    //             name: 'cool',
    //             message: 'Would you like to enable the Cool feature?'
    //         }]).then(function (answers) {
    //             this.log('app name', answers.name);
    //             this.log('cool feature', answers.cool);
    //         }.bind(this));
    // },
    // method1: function () {
    //     console.log('method 1 just ran');
    // },
    // method2: function () {
    //     console.log('method 2 just ran');
    // }
});