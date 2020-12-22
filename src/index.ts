import { JupyterFrontEndPlugin } from '@jupyterlab/application';
import pypadsExtension from './widget';

export default [pypadsExtension] as JupyterFrontEndPlugin<any>[];
