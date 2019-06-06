import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import 'slick-carousel';
import 'bootstrap';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .globalResources([
        'resources/elements/scriptinjector', 
        'resources/elements/reading-position',
        'resources/elements/goto-top',
        'resources/elements/rrssb',
        'resources/elements/footer-panel'
    ]);

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  return aurelia.start().then(() => aurelia.setRoot());
}
