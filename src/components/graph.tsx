import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { VegaLite, VisualizationSpec } from 'react-vega';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface IProps {
  df: IDataFrame;
  paramGraph: string;
  setParamGraph: any;
}

interface IDataFrame {
  columns: string[];
  index: string[];
  data: any[][];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  })
);

export default function Graph(props: IProps) {
  const classes = useStyles();
  const { df, paramGraph, setParamGraph } = props;

  const spec: VisualizationSpec = {
    mark: 'line',
    encoding: {
      x: { field: 'x', type: 'ordinal' },
      y: { field: 'y', type: 'quantitative' }
    },
    data: { name: 'table' }
  };

  function filter(df: IDataFrame) {
    const data = {
      table: [] as any
    };
    const c = df.columns.indexOf(paramGraph);
    if (c === -1) {
      return data;
    }
    let i = 0;
    for (const index in df.data) {
      data.table.push({ x: i, y: df.data[index][c] });
      i++;
    }
    return data;
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Param</InputLabel>
        <Select
          value={paramGraph}
          onChange={event => setParamGraph(event.target.value as string)}
        >
          {df.columns.map(name => (
            <MenuItem key={name} value={name} dense={true}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {paramGraph !== '' && (
        <div>
          <VegaLite spec={spec} data={filter(df)} />
        </div>
      )}
    </div>
  );
}
