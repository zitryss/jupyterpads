import React, { useEffect, useState } from 'react';
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
  const [tabs, setTabs] = useState([]);
  const [tabValue, setTabValue] = useState('addTab');
  const [isFirstRun, setIsFirstRun] = useState(true);

  useEffect(() => {
    handleTabAdd();
  }, []);

  const handleTabAdd = async () => {
    if (!isFirstRun) {
      const code = 'tracker.api.end_run()';
      await NotebookUtils.sendKernelRequestFromNotebook(
        tracker.currentWidget,
        code,
        {}
      ).catch((r: any) => {
        setExpId('');
        console.log(r);
      });
    }
    let expName = '';
    let expId = '';
    await InputDialog.getText({ title: 'Experiment Name' })
      .then((r: any) => {
        expName = r.value;
        const code =
          'tracker.start_track(experiment_name="' +
          expName +
          '")\n' +
          'id = tracker.api.active_experiment().experiment_id';
        return NotebookUtils.sendKernelRequestFromNotebook(
          tracker.currentWidget,
          code,
          { id: 'id' }
        );
      })
      .then((r: any) => {
        expId = r.id.data['text/plain'].slice(1, -1);
        setExpId(expId);
        setTabs([...tabs, { label: expName, value: expId }]);
        setTabValue(expId);
      })
      .catch((r: any) => {
        setExpId('');
        NotebookUtils.showMessage('Warning', [
          'Tracker activation failed. See console for more details.'
        ]);
        console.log(r);
      });
    setIsFirstRun(false);
  };

  const handleTabSwitch = async value => {
    let code = 'tracker.api.end_run()';
    await NotebookUtils.sendKernelRequestFromNotebook(
      tracker.currentWidget,
      code,
      {}
    ).catch((r: any) => {
      setExpId('');
      console.log(r);
    });

    const expId = value;
    code = 'tracker.api.start_run(experiment_id="' + expId + '")';
    await NotebookUtils.sendKernelRequestFromNotebook(
      tracker.currentWidget,
      code,
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
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
        <Tab icon={<PostAdd />} value="addTab" />
      </Tabs>
    </AppBar>
  );
}
