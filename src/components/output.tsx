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
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    setDf(defaultDataFrame);
    setParamDataframe('');
    setCharts([]);
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
      expId +
      '")\n' +
      'if df.empty:\n' +
      '    df = df.to_json(orient="split")\n' +
      'else:\n' +
      '    df = df.sort_values(by=["created_at"]).to_json(orient="split")\n' +
      'tracker.api.start_run(experiment_id="' +
      expId +
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
          'import json\n' +
          'id = "' +
          expId +
          '"\n' +
          'data = []\n' +
          'run_ids = tracker.results.list_run_infos(experiment_id=id)\n' +
          'run_ids.sort(key=lambda r: r.start_time, reverse=True)\n' +
          'for r in run_ids:\n' +
          '    found = False\n' +
          '    for i in tracker.results.list(storage_type="tracked_object", search_dict={"experiment.uid": id, "run.uid": r.run_id, "category": "ROC category"}):\n' +
          '        data.append({"split_id": i.split_id, "spec": json.loads(i.chart)})\n' +
          '        found = True\n' +
          '    if found:\n' +
          '        break\n' +
          '\n' +
          'split_ids = set()\n' +
          'for d in data:\n' +
          '    split_ids.add(d["split_id"])\n' +
          '\n' +
          'charts = []\n' +
          'for s in split_ids:\n' +
          '    specs = []\n' +
          '    for d in data:\n' +
          '        if d["split_id"] == s:\n' +
          '            specs.append(d["spec"])\n' +
          '    charts.append({"split_id": s, "specs": specs})\n' +
          'charts.sort(key=lambda o: len(o["specs"]), reverse=True)\n' +
          '\n' +
          'charts = json.dumps(charts)\n';
        return NotebookUtils.sendKernelRequestFromNotebook(
          tracker.currentWidget,
          code,
          {
            charts: 'charts'
          }
        );
      })
      .then((r: any) => {
        const a = r.charts.data['text/plain'];
        const b = a.slice(1, -1);
        const c = JSON.parse(b);
        setCharts(c);
      })
      .catch((r: any) => {
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
            <Dataframe {...{ df, paramDataframe, setParamDataframe }} />
          </AccordionDetails>
        </Accordion>
      </div>
      {charts.length > 0 && (
        <div>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Graph</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Graph {...{ charts: charts }} />
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
}
