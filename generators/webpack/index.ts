import { BaseGenerator, Features, CssPreprocessor, ReduxFeatures } from '../base';

class WebPackGeneratorBase extends BaseGenerator {
    get cssModules(): boolean {
        return this.config.get('cssModules');
    }

    set cssModules(value: boolean) {
        this.config.set('cssModules', value);
    }
}

export = class WebPackGenerator extends WebPackGeneratorBase {

    /* Where you prompt users for options (where you'd call this.prompt()) */
    public prompting() {
        var prompts = [{
            type: 'confirm',
            name: 'cssModules',
            message: 'Add support for CSS modules?',
            default: true,
            store: true
        }];

        return this.ask(prompts).then((answers) => {
            this.cssModules = answers.cssModules;
        });
    }

    writing() {
        this.writePackageScript('build', `webpack --config webpack.production.config.js`);
        this.writePackageScript('start', `webpack-dev-server --config webpack.development.config.js --port 9000 --hot --inline --history-api-fallback --open http://localhost:9000/webpack-dev-server/client`);

        this.fs.copyTpl(
            this.templatePath('webpack.config.js.ejs'),
            this.destinationPath(`webpack.production.config.js`),
            {
                src: this.settings.src,
                bin: this.settings.bin,
                scss: this.settings.css === CssPreprocessor.scss,
                production: true,
                development: false,
                cssModules: this.cssModules
            }
        );

        this.fs.copyTpl(
            this.templatePath('webpack.config.js.ejs'),
            this.destinationPath(`webpack.development.config.js`),
            {
                src: this.settings.src,
                bin: this.settings.bin,
                scss: this.settings.css === CssPreprocessor.scss,
                production: false,
                development: true,
                cssModules: this.cssModules
            }
        );
    }

    /* Where installation are run (npm, bower) */
    install() {
        this.npmInstall(['webpack', 'webpack-dev-server', 'extract-text-webpack-plugin', 'css-loader', 'style-loader', 'resolve-url-loader', 'file-loader', 'react-hot-loader', 'ts-loader'], { saveDev: true });
        this.npmInstall(['babel-core', 'babel-loader', 'babel-polyfill', 'babel-preset-es2015', 'babel-preset-react'], { saveDev: true });
        this.npmInstall(['html-webpack-plugin', 'html-webpack-template'], { saveDev: true });

        if (this.settings.css === CssPreprocessor.scss) {
            this.npmInstall(['node-sass', 'sass-loader'], { saveDev: true });
        }
    }
}