import { BaseGenerator, Generators } from '../base';

export = class extends BaseGenerator {

    public name: string;

    /* Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {
        this.argument('name', { type: String, required: false, desc: 'container name' });
    }

    prompting() {
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter container name:',
                default: this.name,
                when: !this.name
            }
        ];

        return this.ask(prompts).then((answers) => {
            this.name = answers.name || this.name;
        });
    }

    async writing() {
        await this.copyTpl(
            this.templatePath('container.tsx.ejs'),
            this.destinationPath(this.settings.src, 'containers', `${name}.tsx`),
            { name: this.name }
        );

        this.exec(Generators.containersIndex);
    }

    /* Called last, cleanup, say good bye, etc */
    end() { }
};