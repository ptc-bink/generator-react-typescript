import * as YO from 'yeoman-generator';
import * as _ from 'lodash';
import * as fs from 'fs';


export enum Generators {
    config,
    init,
    component,
    componentsIndex,
    container,
    containersIndex,
    theme,
    sync,
    webpack,
    storybook,
    stories,
    componentTheme,
    componentThemeIndex,
    initStorybook
}

interface VSCodeTaskConfig {
    taskName: string,
    args: string[]
}

interface VSCodeTasksConfig {
    version: string,
    command: string,
    isShellCommand: boolean,
    showOutput: string,
    suppressTaskName: boolean,
    tasks: VSCodeTaskConfig[];
}

interface NodePackageConfig {
    name: string,
    main: string,
    scripts: { [name: string]: string },
    dependencies: { [name: string]: string },
    devDependencies: { [name: string]: string }
}

var extend = _.merge;

export enum Features {
    redux = 1,
    webpack = 2,
    typings = 3,
    vscode = 4,
    router = 5,
    storybook = 6
}

export enum ReduxFeatures {
    logger,
    devtools,
    saga,
    thunk
}

export enum CssPreprocessor {
    none = 0,
    scss = 1
}

export interface IGeneratorSettings {
    name: string,
    src: string,
    bin: string,
    features: Features[],
    redux: ReduxFeatures[],
    css: CssPreprocessor
}

class GeneratorSettings {
    constructor(private config) {

    }

    get src(): string {
        return this.config.get('src');
    }

    set src(value: string) {
        this.config.set('src', value);
    }

    get bin(): string {
        return this.config.get('bin');
    }

    set bin(value: string) {
        this.config.set('bin', value);
    }

    get features(): Features[] {
        return this.config.get('features');
    }

    set features(value: Features[]) {
        this.config.set('features', value);
    }

    hasFeature(feature: Features) {
        return this.features.indexOf(feature) >= 0;
    }

    get redux(): ReduxFeatures[] {
        return this.config.get('redux');
    }

    hasReduxFeature(feature: ReduxFeatures) {
        return this.redux.indexOf(feature) >= 0;
    }

    set redux(value: ReduxFeatures[]) {
        this.config.set('redux', value);
    }

    get css(): CssPreprocessor {
        return this.config.get('css');
    }

    set css(value: CssPreprocessor) {
        this.config.set('css', value);
    }

    get themes(): string[] {
        return _.uniq(this.config.get('themes') as string[] || []);
    }

    set themes(value: string[]) {
        this.config.set('themes', _.uniq(value));
    }

    get initialized(): boolean {
        return this.config.get('initialized');
    }

    set initialized(value: boolean) {
        this.config.set('initialized', value);
    }
}

export abstract class BaseGenerator extends YO.Base {

    private _settings = new GeneratorSettings(this.config);

    get settings() {
        return this._settings;
    }

    public ask(prompts: YO.IPromptOptions[]) {
        return new Promise<any>((resolve, reject) => {
            let resolved = false;
            let tmp: any = super.prompt(prompts, (answers) => {
                if (!resolved) {
                    resolved = true;
                    resolve(answers);
                }
            });

            if (tmp != null) { // fallback                
                tmp.then(answers => {
                    if (!resolved) {
                        resolved = true;
                        resolve(answers);
                    }
                }, error => reject(error));
            }
        })
    }

    // _writePackage() {

    //     const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    //     var pkg = extend({
    //         name: _.kebabCase(this.appname),
    //         main: `${this.settings.bin}/main.js`,
    //         scripts: {}
    //     }, currentPkg);

    //     this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    // }

    writePackageScript(name: string, script: string) {
        const currentPkg: any = this.fs.readJSON(this.destinationPath('package.json'), { scripts: {} });

        currentPkg.scripts = extend(currentPkg.scripts, {
            [name]: script
        });

        this.fs.writeJSON(this.destinationPath('package.json'), currentPkg);
    }

    // _writeTsConfig() {

    //     var currentPkg = this.fs.readJSON(this.destinationPath('tsconfig.json'), {});

    //     var pkg = extend(currentPkg, {
    //         compilerOptions: {
    //             target: 'es6',
    //             module: "commonjs",
    //             moduleResolution: "node",
    //             jsx: "react",
    //             listFiles: false,
    //             isolatedModules: false,
    //             experimentalDecorators: true,
    //             emitDecoratorMetadata: true,
    //             declaration: false,
    //             noImplicitAny: false,
    //             removeComments: false,
    //             noLib: false,
    //             preserveConstEnums: true,
    //             suppressImplicitAnyIndexErrors: true,
    //             outDir: this.settings.bin,
    //             inlineSourceMap: false,
    //             inlineSources: false,
    //             sourceMap: true
    //         },
    //         filesGlob: [
    //             `${this.settings.src}/**/*.d.ts`,
    //             `${this.settings.src}/**/*.ts`,
    //             `${this.settings.src}/**/*.tsx`,
    //             "typings/index.d.ts"
    //         ],
    //         exclude: [
    //             "node_modules",
    //             "jspm"
    //         ]
    //     });

    //     this.fs.writeJSON(this.destinationPath('tsconfig.json'), pkg);
    // }

    // async _writeApp() {
    //     return this.copyTpl(
    //         this.templatePath('app.tsx.ejs'),
    //         this.destinationPath(`${this.settings.src}/app.tsx`),
    //         {
    //             appname: this.appname
    //         }
    //     );
    // }

    // async _writeComponents() {
    //     return this.copyTpl(
    //         this.templatePath('components/index.ts.ejs'),
    //         this.destinationPath(`${this.settings.src}/components/index.ts`),
    //         {
    //             appname: this.appname
    //         }
    //     );
    // }

    // async _writeContainers() {
    //     return this.copyTpl(
    //         this.templatePath('containers/index.ts.ejs'),
    //         this.destinationPath(this.settings.src, `containers`, `index.ts`),
    //         {
    //             appname: this.appname
    //         }
    //     );
    // }

    // async _writeComponent(name) {

    //     return this.copyTpl(
    //         this.templatePath('component.tsx.ejs'),
    //         this.destinationPath(this.settings.src, `components`, name, `index.tsx`),
    //         {
    //             name: name
    //         }
    //     )
    // }

    protected async copyTpl(from: string, to: string, context: Object) {
        this.fs.copyTpl(from, to, context);
        return this.writeFiles();
    }

    // async _writeThemes(component) {

    //     const themes = this.config.get('themes') || [];

    //     await this.copyTpl(
    //         this.templatePath('theme.scss.ejs'),
    //         this.destinationPath(this.settings.src, `components/${component}/_theme.scss`),
    //         {
    //             theme: 'default',
    //             component: component
    //         }
    //     );

    //     for (var index = 0; index < themes.length; index++) {
    //         var theme = themes[index];

    //         await this.copyTpl(
    //             this.templatePath('theme.scss.ejs'),
    //             this.destinationPath(this.settings.src, `components/${component}/_theme-${theme}.scss`),
    //             {
    //                 theme: theme,
    //                 component: component
    //             }
    //         );
    //     }

    //     await this._writeComponentThemesIndex(component, themes);

    //     await this.copyTpl(
    //         this.templatePath('style.d.ts.ejs'),
    //         this.destinationPath(this.settings.src, `components/${component}/style.d.ts`),
    //         {
    //             name: component
    //         }
    //     );
    // }

    async _writeComponentThemesIndex(component: string, themes: string[]) {

        return this.copyTpl(
            this.templatePath('../../component/templates/style.scss.ejs'),
            this.destinationPath(this.settings.src, `components/${component}/style.scss`),
            {
                themes: themes
            }
        );
    }

    // async _writeContainer(name: string) {
    //     return this.copyTpl(
    //         this.templatePath('container.tsx.ejs'),
    //         this.destinationPath(this.settings.src, `containers/${name}.tsx`),
    //         { name }
    //     );
    // }

    // async _writeComponentsIndex(components: string[]) {

    //     return this.noConflict(() => {
    //         this.fs.copyTpl(
    //             this.templatePath('index.ts.ejs'),
    //             this.destinationPath(this.settings.src, 'components/index.ts'),
    //             {
    //                 components: components.sort()
    //             }
    //         );
    //     });
    // }

    async _writeContainersIndex(containers: string[]) {
        containers = containers.sort();

        return this.noConflict(() => {
            this.fs.copyTpl(
                this.templatePath('index.ts.ejs'),
                this.destinationPath(this.settings.src, 'containers/index.ts'),
                {
                    containers: containers.sort()
                }
            );
        });
    }

    _writeTheme(theme: string, components: string[] = this.getComponents()) {

        components.forEach(component => {
            this.fs.copyTpl(
                this.templatePath('theme.scss.ejs'),
                this.destinationPath(this.settings.src, `components/${component}/_theme-${theme}.scss`),
                { theme, component }
            );

            this.fs.copyTpl(
                this.templatePath('style.scss.ejs'),
                this.destinationPath(this.settings.src, `components/${component}/style.scss`),
                {
                    themes: this.settings.themes,
                    component
                }
            );
        });
    }

    private isComponentDirectory(filename, componentsPath) {
        try {
            return fs.statSync(`${componentsPath}/${filename}`).isDirectory()
                && fs.statSync(`${componentsPath}/${filename}/index.tsx`).isFile();
        }
        catch (e) {
            return false;
        }
    }

    get componentsPath() {
        return this.destinationPath(this.settings.src, 'components');
    }

    getComponents(): string[] {

        try {
            if (!fs.statSync(this.componentsPath).isDirectory())
                return [];
        }
        catch (e) {
            return [];
        }

        return _.filter(fs.readdirSync(this.componentsPath) as string[], filename => this.isComponentDirectory(filename, this.componentsPath));
    }

    private isContainerFile(filename, containersPath, layout?) {
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

        return _(fs.readdirSync(containersPath) as string[])
            .filter(filename => this.isContainerFile(filename, containersPath))
            .filter(filename => filename != 'index.ts')
            .map(filename => filename.replace(/\.[^/.]+$/, ""))
            .value();
    }

    protected writeVSCodeTask(task: string) {
        const currentPkg = this.fs.readJSON(this.destinationPath('.vscode', 'tasks.json'), {
            version: '0.1.0',
            command: 'npm',
            isShellCommand: true,
            showOutput: 'always',
            suppressTaskName: true,
            tasks: []
        }) as VSCodeTasksConfig;

        let tasksPairs = (currentPkg.tasks || []).map(task => [task.taskName, task] as [string, VSCodeTaskConfig]);
        let tasks = _.fromPairs(tasksPairs);

        tasks = extend(tasks, { [task]: { taskName: task, args: ["run", task] } });

        currentPkg.tasks = _.map(tasks, (task, taskName) => ({ taskName, args: task.args }));

        this.fs.writeJSON(this.destinationPath('.vscode', 'tasks.json'), currentPkg);
    }

    public npmInstall(packages: string[], options?: any, cb?: Function) {

        var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {}) as NodePackageConfig;

        if (options.save && currentPkg.dependencies) {
            _.remove(packages, name => currentPkg.dependencies[name] != null);
        }

        if (options.saveDev && currentPkg.devDependencies) {
            _.remove(packages, name => currentPkg.devDependencies[name] != null);
        }

        if (packages.length > 0) {
            super.npmInstall(packages, options, cb);
        }
    }

    protected writeFiles() {
        return new Promise((resolve, reject) => {
            (this as any)._writeFiles(() => resolve());
        });
    }

    protected async noConflict(action: () => void) {
        await this.writeFiles();

        //this.log('no conflict: on');

        this.conflicter.force = true;

        try {
            action();
        }
        finally {
            await this.writeFiles();
            this.conflicter.force = false;
            //this.log('no conflict: off');
        }
    }

    protected exec(subgenerator: Generators, args?: string[], options?: Object) {
        let generatorName = Generators[subgenerator];
        this.composeWith('react-typescript:' + _.kebabCase(generatorName), { args, options });
    }
}

export default BaseGenerator;