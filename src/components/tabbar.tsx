import React, { useEffect } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { PostAdd } from '@material-ui/icons';
import { INotebookTracker } from '@jupyterlab/notebook';
import NotebookUtils from '../utils/NotebookUtils';
import { InputDialog } from '@jupyterlab/apputils';

interface IProps {
  tracker: INotebookTracker;
  setExpId: any;
}

export default function Pipeline(props: IProps) {
  const { tracker, setExpId } = props;
  const [tabs, setAddTab] = React.useState([]);
  const [tabValue, setTabValue] = React.useState('addTab');

  useEffect(() => {
    handleTabAdd();
    // todo: possibly I would need fallback mechanism
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  const handleTabAdd = async () => {
    await NotebookUtils.sendKernelRequestFromNotebook(
      tracker.currentWidget,
      'tracker.api.end_run()',
      {}
    ).catch((r: any) => {
      setExpId('');
      console.log(r);
    });

    let expName = '';
    let expId = '';
    await InputDialog.getText({ title: 'Experiment Name' })
      .then((r: any) => {
        expName = r.value;
        return NotebookUtils.sendKernelRequestFromNotebook(
          tracker.currentWidget,
          'tracker.start_track(experiment_name="' +
            expName +
            '"); id = tracker.api.active_experiment().experiment_id',
          { id: 'id' }
        );
      })
      .then((r: any) => {
        expId = r.id.data['text/plain'];
        setExpId(expId);
        setAddTab([...tabs, { label: expName, value: expId }]);
        setTabValue(expId);
      })
      .catch((r: any) => {
        setExpId('');
        NotebookUtils.showMessage('Warning', [
          'Tracker activation failed. See console for more details.'
        ]);
        console.log(r);
      });
  };

  const handleTabSwitch = async value => {
    await NotebookUtils.sendKernelRequestFromNotebook(
      tracker.currentWidget,
      'tracker.api.end_run()',
      {}
    ).catch((r: any) => {
      setExpId('');
      console.log(r);
    });

    const expId = value;
    await NotebookUtils.sendKernelRequestFromNotebook(
      tracker.currentWidget,
      'tracker.api.start_run(experiment_id=' + expId + ')',
      {}
    )
      .then((r: any) => {
        setExpId(expId);
        setTabValue(expId);
      })
      .catch((r: any) => {
        setExpId('');
        NotebookUtils.showMessage('Warning', [
          'Tracker activation failed. See console for more details.'
        ]);
        console.log(r);
      });
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
    if (value === 'addTab') {
      handleTabAdd();
    } else {
      handleTabSwitch(value);
    }
  };

  return (
    <AppBar position="static" color="inherit">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="on"
      >
        {tabs.map(tab => (
          <Tab label={tab.label} value={tab.value} />
        ))}
        <Tab icon={<PostAdd />} value="addTab" />
      </Tabs>
    </AppBar>
  );
}
