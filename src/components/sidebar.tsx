import React, { useEffect, useState } from 'react';
import { INotebookTracker } from '@jupyterlab/notebook';
import Switch from '@material-ui/core/Switch';
import NotebookUtils from '../utils/NotebookUtils';
import { Box } from '@material-ui/core';
import Output from './output';
import Pipeline from './tabbar';
import Config from './config';
import { makeStyles } from '@material-ui/core/styles';

interface IProps {
  tracker: INotebookTracker;
}

const defaultInitCode = ``;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}));

export default function Sidebar(props: IProps) {
  const classes = useStyles();
  const { tracker } = props;
  const [isOn, setIsOn] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [initCode, setInitCode] = useState(defaultInitCode);
  const [expId, setExpId] = useState('');

  useEffect(() => {
    const setUp = async () => {
      await NotebookUtils.restartKernel(tracker.currentWidget)
        .then(() => {
          return NotebookUtils.sendKernelRequestFromNotebook(
            tracker.currentWidget,
            initCode,
            {}
          );
        })
        .catch((r: any) => {
          setIsOn(false);
          NotebookUtils.showMessage('Warning', [
            'PyPads initialization failed. See console for more details.'
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
        console.log(r);
      });
      await NotebookUtils.restartKernel(tracker.currentWidget).catch(
        (r: any) => {
          setIsOn(false);
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
      <p>Version 2.0.79</p>
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
      {isOn === false && (
        <div className={classes.root}>
          <Config {...{ initCode, setInitCode }} />
        </div>
      )}

      {isOn === true && (
        <div className={classes.root}>
          <Pipeline {...{ tracker, setExpId }} />
        </div>
      )}

      {isOn === true && expId !== '' && (
        <div className={classes.root}>
          <Output {...{ tracker, expId }} />
        </div>
      )}
    </div>
  );
}
