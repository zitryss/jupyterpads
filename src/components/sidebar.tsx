import React, { useEffect, useState } from 'react';
import { INotebookTracker } from '@jupyterlab/notebook';
import Switch from '@material-ui/core/Switch';
import NotebookUtils from '../utils/NotebookUtils';
import { Box, makeStyles } from '@material-ui/core';
import Output from './output';
import Config from './config';

interface IProps {
  tracker: INotebookTracker;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}));

export default function Sidebar(props: IProps) {
  const classes = useStyles();
  const { tracker } = props;
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const [expName, setExpName] = useState('');
  const [initCode, setInitCode] = useState('');
  const [expId, setExpId] = useState('');

  useEffect(() => {
    const setUp = async () => {
      await NotebookUtils.sendKernelRequestFromNotebook(
        tracker.currentWidget,
        initCode,
        {}
      ).catch((r: any) => {
        setIsOn(false);
        NotebookUtils.showMessage('Warning', [
          'PyPads initialization failed. See console for more details.'
        ]);
        console.log(r);
      });
      await NotebookUtils.sendKernelRequestFromNotebook(
        tracker.currentWidget,
        'tracker.start_track(experiment_name="' +
          expName +
          '"); id = tracker.api.active_experiment().experiment_id',
        { id: 'id' }
      )
        .then((response: any) => {
          setExpId(response.id.data['text/plain']);
        })
        .catch((r: any) => {
          setIsOn(false);
          NotebookUtils.showMessage('Warning', [
            'Tracker activation failed. See console for more details.'
          ]);
          console.log(r);
        });
    };

    const tearDown = async () => {
      await NotebookUtils.sendKernelRequestFromNotebook(
        tracker.currentWidget,
        'tracker.api.end_run()',
        {}
      ).catch((r: any) => {
        setIsOn(false);
        NotebookUtils.showMessage('Warning', [
          'End run failed. See console for more details.'
        ]);
        console.log(r);
      });
      await NotebookUtils.restartKernel(tracker.currentWidget).catch(
        (r: any) => {
          setIsOn(false);
          NotebookUtils.showMessage('Warning', [
            'Kernel restart failed. See console for more details.'
          ]);
          console.log(r);
        }
      );
    };

    if (isOn) {
      setUp();
      setIsFirstRun(false);
    } else {
      if (!isFirstRun) {
        tearDown();
      }
    }
  }, [isOn]);

  return (
    <div className={'jupyterpads-widget'}>
      <p>Version 1.2.hellogeneral</p>
      <Box textAlign="center">
        Off
        <Switch
          checked={isOn}
          onClick={() => {
            setIsOn(!isOn);
          }}
        />
        On
      </Box>
      <div className={classes.root}>
        <Config {...{ expName, setExpName, initCode, setInitCode }} />
      </div>
      {isOn && expId !== '' && <Output {...{ tracker, expId }} />}
    </div>
  );
}
