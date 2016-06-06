import BaseGenerator from '../base';

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

        return this.prompt(prompts).then((answers) => {
            this.name = answers.name || this.name;
        });
    }

    writing() {
        super._writeContainer(this.name);
        super._writeContainersIndex(super.getContainers().concat([this.name]));
    }

    /* Called last, cleanup, say good bye, etc */
    end() { }
};