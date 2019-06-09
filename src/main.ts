import {Aurelia} from 'aurelia-framework'
import environment from './environment';

// Bootstrap
import 'bootstrap/css/bootstrap.css';
import 'bootstrap';

// Codemirror
import 'codemirror/addon/runmode/runmode';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/paraiso-dark.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';

// Froala
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/plugins/code_view.min.css';
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/js/plugins/code_view.min';
import 'froala-editor/js/plugins/code_beautifier.min';

// Datepicker
import 'eonasdan-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import 'aurelia-bootstrap-datetimepicker/bootstrap-datetimepicker-bs4.css';

// Moment
import 'moment/locale/fr';

// Slick-carousel
import 'slick-carousel';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-dialog')
    .plugin('aurelia-bootstrap-datetimepicker', (config) => {
        config.extra.bootstrapVersion = 4;
        config.extra.buttonClass = 'btn btn-date-picker';
        config.options.keyBinds = null;
      })
      .plugin('aurelia-froala-editor', config => {
        config.options({
          charCounterCount: false
        })
      })
    .globalResources([
        'resources/elements/scriptinjector', 
        'resources/elements/reading-position',
        'resources/elements/topicons',
        'resources/elements/slide-panel',
        'resources/elements/fullscreen-search', 
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
