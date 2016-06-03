import * as YO from 'yeoman-generator';
const fs = require('fs');

var _ = require('lodash');
var extend = _.merge;

abstract class BaseGenerator extends YO.Base {

    _writePackage() {
        const src = this.config.get('src');
        const bin = this.config.get('bin');
        const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        var pkg = extend({
            name: _.kebabCase(this.appname),
            main: `${bin}/main.js`,
            scripts: []
        }, currentPkg);

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }

    _writeTsConfig() {
        const src = this.config.get('src');
        const bin = this.config.get('bin');

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
                outDir: bin,
                inlineSourceMap: false,
                inlineSources: false,
                sourceMap: true
            },
            filesGlob: [
                `${src}/**/*.d.ts`,
                `${src}/**/*.ts`,
                `${src}/**/*.tsx`,
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
        const src = this.config.get('src');

        this.fs.copyTpl(
            this.templatePath('app.tsx.ejs'),
            this.destinationPath(`${src}/app.tsx`),
            {
                appname: this.appname
            }
        );
    }

    _writeComponents() {
        const src = this.config.get('src');

        this.fs.copyTpl(
            this.templatePath('components/index.ts.ejs'),
            this.destinationPath(`${src}/components/index.ts`),
            {
                appname: this.appname
            }
        );
    }

    _writeContainers() {
        const src = this.config.get('src');

        this.fs.copyTpl(
            this.templatePath('containers/index.ts.ejs'),
            this.destinationPath(`${src}/containers/index.ts`),
            {
                appname: this.appname
            }
        );
    }

    _writeComponent(name) {
        const src = this.config.get('src');

        this.fs.copyTpl(
            this.templatePath('component.tsx.ejs'),
            this.destinationPath(src, `components/${name}/index.tsx`),
            {
                name: name
            }
        )
    }

    _writeThemes(component) {
        const src = this.config.get('src');
        const themes = this.config.get('themes') || [];

        this.fs.copyTpl(
            this.templatePath('theme.scss.ejs'),
            this.destinationPath(src, `components/${component}/_theme.scss`),
            {
                theme: 'default',
                component: component
            }
        );

        themes.forEach(theme => {
            this.fs.copyTpl(
                this.templatePath('theme.scss.ejs'),
                this.destinationPath(src, `components/${component}/_theme-${theme}.scss`),
                {
                    theme: theme,
                    component: component
                }
            );
        });

        this._writeComponentThemesIndex(component, themes);

        this.fs.copyTpl(
            this.templatePath('style.d.ts.ejs'),
            this.destinationPath(src, `components/${component}/style.d.ts`),
            {
                name: component
            }
        );
    }

    _writeComponentThemesIndex(component: string, themes: string[]) {
        const src = this.config.get('src');
        
        this.fs.copyTpl(
            this.templatePath('../../component/templates/style.scss.ejs'),
            this.destinationPath(src, `components/${component}/style.scss`),
            {
                themes: themes
            }
        );
    }

    _writeContainer(name: string) {
        const src = this.config.get('src');

        this.fs.copyTpl(
            this.templatePath('container.tsx.ejs'),
            this.destinationPath(src, `containers/${name}.tsx`),
            { name }
        );
    }

    _writeComponentsIndex(components: string[]) {
        const src = this.config.get('src');

        this.fs.copyTpl(
            this.templatePath('index.ts.ejs'),
            this.destinationPath(src, 'components/index.ts'),
            {
                components: components.sort()
            }
        );
    }

    _writeContainersIndex(containers: string[]) {
        const src = this.config.get('src');

        containers = containers.sort();

        this.fs.copyTpl(
            this.templatePath('index.ts.ejs'),
            this.destinationPath(src, 'containers/index.ts'),
            {
                containers: containers.sort()
            }
        );
    }

    _writeTheme(theme: string, components: string[] = this.getComponents()) {
        const src = this.config.get('src');
        const themes = this.config.get('themes') || [];

        components.forEach(component => {
            this.fs.copyTpl(
                this.templatePath('theme.scss.ejs'),
                this.destinationPath(src, `components/${component}/_theme-${theme}.scss`),
                { theme, component }
            );

            this.fs.copyTpl(
                this.templatePath('style.scss.ejs'),
                this.destinationPath(src, `components/${component}/style.scss`),
                { themes, component }
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

    getComponents(): string[] {
        const src = this.config.get('src');
        const componentsPath = this.destinationPath(src, 'components');

        try {
            if (!fs.statSync(componentsPath).isDirectory())
                return [];
        }
        catch (e) {
            return [];
        }

        return _.filter(fs.readdirSync(componentsPath), filename => this.isComponentDirectory(filename, componentsPath));
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
        const src = this.config.get('src');
        const containersPath = this.destinationPath(src, 'containers');


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
}

export default BaseGenerator;