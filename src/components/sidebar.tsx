import React, { useEffect, useState } from 'react';
import Output from './output';
import { INotebookTracker } from '@jupyterlab/notebook';
import Switch from '@material-ui/core/Switch';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import TextField from '@material-ui/core/TextField';
import NotebookUtils from '../utils/NotebookUtils';
import { Box } from '@material-ui/core';

interface IProps {
  tracker: INotebookTracker;
}

export default function Sidebar(props: IProps) {
  const [isOn, setIsOn] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (isOn) {
      NotebookUtils.sendKernelRequestFromNotebook(
        props.tracker.currentWidget,
        code,
        {}
      ).catch((r: any) => {
        setIsOn(false);
        console.log(r);
      });
    } else {
      NotebookUtils.restartKernel(props.tracker.currentWidget).catch(
        (r: any) => {
          setIsOn(false);
          console.log(r);
        }
      );
    }
  }, [isOn]);

  return (
    <div className={'jupyterpads-widget'}>
      <p>Version 1.2.192</p>
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
      <div>
        <Accordion expanded={true}>
          <AccordionSummary>
            <Typography>Config</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              multiline
              rowsMax={10}
              value={code}
              onChange={event => setCode(event.target.value)}
              variant="outlined"
            />
          </AccordionDetails>
        </Accordion>
      </div>
      {isOn && <Output tracker={props.tracker} />}
    </div>
  );
}
