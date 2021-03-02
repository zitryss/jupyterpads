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
  const [df, setDf] = useState(defaultDataFrame);
  const [paramDataframe, setParamDataframe] = useState('');
  const [chart, setChart] = useState('{}');

  useEffect(() => {
    setDf(defaultDataFrame);
    setParamDataframe('');
    setChart('{}');
    update();
    NotebookActions.executed.connect(update);
    return () => {
      NotebookActions.executed.disconnect(update);
    };
  }, [expId]);

  const update = (): Promise<void> => {
    const code =
      'tracker.api.end_run()\n' +
      'df = tracker.results.get_summary(experiment_id="' +
      getExpId() +
      '").to_json(orient="split")\n' +
      'tracker.api.start_run(experiment_id="' +
      getExpId() +
      '")';
    return NotebookUtils.sendKernelRequestFromNotebook(
      tracker.currentWidget,
      code,
      {
        df: 'df'
      }
    )
      .then((r: any) => {
        const df = JSON.parse(r.df.data['text/plain'].slice(1, -1));
        setDf(df);
        const code =
          'max = 0.0\n' +
          'chart = "{}"\n' +
          'for i in tracker.results.list(storage_type="tracked_object", search_dict={"experiment.uid": "' +
          getExpId() +
          '", "category": "ROC category"}):\n' +
          '    if i.created_at > max:\n' +
          '        max = i.created_at\n' +
          '        chart = i.chart';
        return NotebookUtils.sendKernelRequestFromNotebook(
          tracker.currentWidget,
          code,
          {
            chart: 'chart'
          }
        );
      })
      .then((r: any) => {
        const chart = r.chart.data['text/plain']
          .slice(1, -1)
          .replace(/\\n/g, '');
        setChart(chart);
      })
      .catch((r: any) => {
        console.log(r);
      });
  };

  const getExpId = () => {
    return expId; // todo: check with and without
  };

  return (
    <div className={classes.root}>
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Dataframe</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Dataframe {...{ df, paramDataframe, setParamDataframe }} />
          </AccordionDetails>
        </Accordion>
      </div>
      {chart !== '{}' && (
        <div>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Graph</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Graph {...{ chart }} />
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
}
