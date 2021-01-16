import { JupyterFrontEndPlugin } from '@jupyterlab/application';
import jupyterpadsExtension from './widget';

export default [jupyterpadsExtension] as JupyterFrontEndPlugin<any>[];
