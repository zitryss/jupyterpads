import React, { useEffect, useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Dataframe from './dataframe';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import NotebookUtils from '../utils/NotebookUtils';
import Graph from './graph';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core';

interface IProps {
  tracker: INotebookTracker;
  expId: string;
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

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

export default function Ouput(props: IProps) {
  const classes = useStyles();
  const { tracker, expId } = props;
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [df, setDf] = useState(defaultDataFrame);

  useEffect(() => {
    if (!isFirstRun) {
      update();
      setIsFirstRun(false);
    }
    NotebookActions.executed.connect((sender, args) => {
      update();
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      NotebookActions.executed.connect((sender, args) => {});
    };
  }, []);

  const update = () => {
    const code =
      'tracker.api.end_run(); result = tracker.results.get_summary(experiment_id=' +
      expId +
      ").to_json(orient='split'); tracker.api.start_run(experiment_id=" +
      expId +
      ')';
    NotebookUtils.sendKernelRequestFromNotebook(tracker.currentWidget, code, {
      result: 'result'
    })
      .then((response: any) => {
        setDf(JSON.parse(response.result.data['text/plain'].slice(1, -1)));
      })
      .catch((r: any) => {
        NotebookUtils.showMessage('Warning', [
          'Dataframe update failed. See console for more details.'
        ]);
        console.log(r);
      });
  };

  return (
    <div className={classes.root}>
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Dataframe</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Dataframe {...df} />
          </AccordionDetails>
        </Accordion>
      </div>
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Graph</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Graph {...df} />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
