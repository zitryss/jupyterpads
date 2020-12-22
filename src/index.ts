import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './jupyterpads';

/**
 * Initialization data for the jupyterpads extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterpads',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterpads is activated!');

    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterpads server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default extension;
