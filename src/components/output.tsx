import React, { useState, useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Dataframe from './dataframe';
// import { requestAPI } from '../api/getSummary';
import { NotebookActions } from '@jupyterlab/notebook';
import NotebookUtils from '../utils/NotebookUtils';
import { INotebookTracker } from '@jupyterlab/notebook';
import Graph from './graph';
import { requestAPI } from '../api/getSummary';
// import axios from 'axios';

interface IProps {
  tracker: INotebookTracker;
}

interface IDataFrame {
  columns: string[];
  index: string[];
  data: any[][];
}

const defaultDataFrame: IDataFrame = {
  columns: [],
  index: [],
  data: []
};

export default function Ouput(props: IProps) {
  const [df, setDf] = useState(defaultDataFrame);

  useEffect(() => {
    NotebookActions.executed.connect((sender, args) => {
      const code =
        "result = tracker.results.get_summary().to_json(orient='split')";
      const expr = { result: 'result' };
      NotebookUtils.sendKernelRequestFromNotebook(
        props.tracker.currentWidget,
        code,
        expr
      ).then((response: any) => {
        const x = response.result.data['text/plain'].slice(1, -1);
        const y = JSON.parse(x);
        setDf(y);
      });
      requestAPI<any>('get_example')
        .then(data => {
          console.log(data);
        })
        .catch(reason => {
          console.error(
            `The jupyterpads server extension appears to be missing.\n${reason}`
          );
        });
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      NotebookActions.executed.connect((sender, args) => {});
    };
  }, []);

  return (
    <div>
      <div>
        <Accordion>
          <AccordionSummary>
            <Typography>Dataframe</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Dataframe {...df} />
          </AccordionDetails>
        </Accordion>
      </div>
      <div>
        <Accordion
        >
          <AccordionSummary>
            <Typography>Graph</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Graph {...df} />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
