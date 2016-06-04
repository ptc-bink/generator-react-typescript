"use strict";
const YO = require('yeoman-generator');
const fs = require('fs');
var _ = require('lodash');
var extend = _.merge;
(function (Features) {
    Features[Features["redux"] = 1] = "redux";
    Features[Features["webpack"] = 2] = "webpack";
    Features[Features["typings"] = 3] = "typings";
    Features[Features["vscode"] = 4] = "vscode";
    Features[Features["router"] = 5] = "router";
})(exports.Features || (exports.Features = {}));
var Features = exports.Features;
(function (ReduxFeatures) {
    ReduxFeatures[ReduxFeatures["logger"] = 0] = "logger";
    ReduxFeatures[ReduxFeatures["devtools"] = 1] = "devtools";
})(exports.ReduxFeatures || (exports.ReduxFeatures = {}));
var ReduxFeatures = exports.ReduxFeatures;
(function (CssPreprocessor) {
    CssPreprocessor[CssPreprocessor["none"] = 0] = "none";
    CssPreprocessor[CssPreprocessor["scss"] = 1] = "scss";
})(exports.CssPreprocessor || (exports.CssPreprocessor = {}));
var CssPreprocessor = exports.CssPreprocessor;
class GeneratorSettings {
    constructor(config) {
        this.config = config;
    }
    get src() {
        return this.config.get('src');
    }
    set src(value) {
        this.config.set('src', value);
    }
    get bin() {
        return this.config.get('bin');
    }
    set bin(value) {
        this.config.set('bin', value);
    }
    get features() {
        return this.config.get('features');
    }
    set features(value) {
        this.config.set('features', value);
    }
    hasFeature(feature) {
        return this.features.indexOf(feature) >= 0;
    }
    get redux() {
        return this.config.get('redux');
    }
    hasReduxFeature(feature) {
        return this.redux.indexOf(feature) >= 0;
    }
    set redux(value) {
        this.config.set('redux', value);
    }
    get css() {
        return this.config.get('css');
    }
    set css(value) {
        this.config.set('css', value);
    }
    get themes() {
        return this.config.get('themes');
    }
    set themes(value) {
        this.config.set('themes', value);
    }
}
class BaseGenerator extends YO.Base {
    constructor(...args) {
        super(...args);
        this._settings = new GeneratorSettings(this.config);
    }
    get settings() {
        return this._settings;
    }
    _writePackage() {
        const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        var pkg = extend({
            name: _.kebabCase(this.appname),
            main: `${this.settings.bin}/main.js`,
            scripts: {}
        }, currentPkg);
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
    writePackageScript(name, script) {
        const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), { scripts: {} });
        currentPkg.scripts = extend(currentPkg.scripts, {
            [name]: script
        });
        this.fs.writeJSON(this.destinationPath('package.json'), currentPkg);
    }
    _writeTsConfig() {
        var currentPkg = this.fs.readJSON(this.destinationPath('tsconfig.json'), {});
        var pkg = extend(currentPkg, {
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
        this.fs.writeJSON(this.destinationPath('tsconfig.json'), pkg);
    }
    _writeApp() {
        this.fs.copyTpl(this.templatePath('app.tsx.ejs'), this.destinationPath(`${this.settings.src}/app.tsx`), {
            appname: this.appname
        });
    }
    _writeComponents() {
        this.fs.copyTpl(this.templatePath('components/index.ts.ejs'), this.destinationPath(`${this.settings.src}/components/index.ts`), {
            appname: this.appname
        });
    }
    _writeContainers() {
        this.fs.copyTpl(this.templatePath('containers/index.ts.ejs'), this.destinationPath(this.settings.src, `containers`, `index.ts`), {
            appname: this.appname
        });
    }
    _writeComponent(name) {
        this.fs.copyTpl(this.templatePath('component.tsx.ejs'), this.destinationPath(this.settings.src, `components`, name, `index.tsx`), {
            name: name
        });
    }
    _writeThemes(component) {
        const themes = this.config.get('themes') || [];
        this.fs.copyTpl(this.templatePath('theme.scss.ejs'), this.destinationPath(this.settings.src, `components/${component}/_theme.scss`), {
            theme: 'default',
            component: component
        });
        themes.forEach(theme => {
            this.fs.copyTpl(this.templatePath('theme.scss.ejs'), this.destinationPath(this.settings.src, `components/${component}/_theme-${theme}.scss`), {
                theme: theme,
                component: component
            });
        });
        this._writeComponentThemesIndex(component, themes);
        this.fs.copyTpl(this.templatePath('style.d.ts.ejs'), this.destinationPath(this.settings.src, `components/${component}/style.d.ts`), {
            name: component
        });
    }
    _writeComponentThemesIndex(component, themes) {
        this.fs.copyTpl(this.templatePath('../../component/templates/style.scss.ejs'), this.destinationPath(this.settings.src, `components/${component}/style.scss`), {
            themes: themes
        });
    }
    _writeContainer(name) {
        this.fs.copyTpl(this.templatePath('container.tsx.ejs'), this.destinationPath(this.settings.src, `containers/${name}.tsx`), { name: name });
    }
    _writeComponentsIndex(components) {
        this.fs.copyTpl(this.templatePath('index.ts.ejs'), this.destinationPath(this.settings.src, 'components/index.ts'), {
            components: components.sort()
        });
    }
    _writeContainersIndex(containers) {
        containers = containers.sort();
        this.fs.copyTpl(this.templatePath('index.ts.ejs'), this.destinationPath(this.settings.src, 'containers/index.ts'), {
            containers: containers.sort()
        });
    }
    _writeTheme(theme, components = this.getComponents()) {
        components.forEach(component => {
            this.fs.copyTpl(this.templatePath('theme.scss.ejs'), this.destinationPath(this.settings.src, `components/${component}/_theme-${theme}.scss`), { theme: theme, component: component });
            this.fs.copyTpl(this.templatePath('style.scss.ejs'), this.destinationPath(this.settings.src, `components/${component}/style.scss`), {
                themes: this.settings.themes,
                component: component
            });
        });
    }
    isComponentDirectory(filename, componentsPath) {
        try {
            return fs.statSync(`${componentsPath}/${filename}`).isDirectory()
                && fs.statSync(`${componentsPath}/${filename}/index.tsx`).isFile();
        }
        catch (e) {
            return false;
        }
    }
    getComponents() {
        const componentsPath = this.destinationPath(this.settings.src, 'components');
        try {
            if (!fs.statSync(componentsPath).isDirectory())
                return [];
        }
        catch (e) {
            return [];
        }
        return _.filter(fs.readdirSync(componentsPath), filename => this.isComponentDirectory(filename, componentsPath));
    }
    isContainerFile(filename, containersPath, layout) {
        if (layout) {
            return fs.statSync(`${containersPath}/${layout}`).isDirectory()
                && fs.statSync(`${containersPath}/${layout}/${filename}`).isFile();
        }
        else
            return fs.statSync(`${containersPath}/${filename}`).isFile();
    }
    getContainers() {
        const containersPath = this.destinationPath(this.settings.src, 'containers');
        try {
            if (!fs.statSync(containersPath).isDirectory())
                return [];
        }
        catch (e) {
            return [];
        }
        return _(fs.readdirSync(containersPath))
            .filter(filename => this.isContainerFile(filename, containersPath))
            .filter(filename => filename != 'index.ts')
            .map(filename => filename.replace(/\.[^/.]+$/, ""))
            .values();
    }
    writeVSCodeTask(task) {
        const currentPkg = this.fs.readJSON(this.destinationPath('.vscode', 'tasks.json'), {
            version: '0.1.0',
            command: 'npm',
            isShellCommand: true,
            showOutput: 'always',
            suppressTaskName: true,
            tasks: []
        });
        var pkg = extend(currentPkg, {
            tasks: currentPkg.tasks.concat([{ taskName: task, args: ["run", task] }])
        });
        this.fs.writeJSON(this.destinationPath('.vscode', 'tasks.json'), pkg);
    }
}
exports.BaseGenerator = BaseGenerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseGenerator;
