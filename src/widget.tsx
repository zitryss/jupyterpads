import {
  ILabShell,
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { Token } from '@lumino/coreutils';
import { LabIcon } from '@jupyterlab/ui-components';
import React from 'react';
import Sidebar from './components/sidebar';
import { INotebookTracker } from '@jupyterlab/notebook';
import logo from './logo';

interface IJupyterPads {
  widget: Widget;
}

const extension: JupyterFrontEndPlugin<IJupyterPads> = {
  id: 'jupyterpads:extension',
  autoStart: true,
  requires: [ILabShell, ILayoutRestorer, INotebookTracker],
  provides: new Token<IJupyterPads>('jupyterpads:token'),
  activate: activate
};

function activate(
  app: JupyterFrontEnd,
  shell: ILabShell,
  restorer: ILayoutRestorer,
  tracker: INotebookTracker
): IJupyterPads {
  const widget = ReactWidget.create(<Sidebar {...{ tracker }} />);
  widget.id = 'jupyterpads:widget';
  widget.title.icon = fooIcon;
  widget.title.caption = 'PyPads companion extension for JupyterLab';
  restorer.add(widget, widget.id);
  shell.add(widget, 'left');
  return { widget };
}

export const fooIcon = new LabIcon({
  name: 'jupyterpads:logo',
  svgstr: logo
});

export default extension;
