import { FrameworkConfiguration } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        './elements/group-list',
        './elements/tags-input',
        './value-converters/date-format',
        './value-converters/uppercase-first-letter',
        './value-converters/filter-by',
        './value-converters/group-by',
        './value-converters/order-by',
    ]);
}
