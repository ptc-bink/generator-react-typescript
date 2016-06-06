import BaseGenerator from '../base';

export = class extends BaseGenerator {
    initializing() {

    }

    writing() {
        const themes = this.settings.themes;
        const components = this.getComponents();

        components.forEach(component => this._writeComponentThemesIndex(component, themes));
    }

    /* Called last, cleanup, say good bye, etc */
    end() {

    }

}