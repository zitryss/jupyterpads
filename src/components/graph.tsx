import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { VegaLite, VisualizationSpec } from 'react-vega';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

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
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  })
);

export default function Graph(props: IDataFrame) {
  const classes = useStyles();
  const [param1, setParam1] = useState('');
  const [param2, setParam2] = useState('');

  const spec: VisualizationSpec = {
    mark: 'line',
    encoding: {
      x: { field: 'x', type: 'ordinal' },
      y: { field: 'y', type: 'quantitative' }
    },
    data: { name: 'table' }
  };

  function convert(df: IDataFrame) {
    const data = {
      table: [] as any
    };
    const c = df.columns.indexOf(param1); // todo: code duplication
    const i = df.index.indexOf(param2);
    if (c === -1 || i === -1) {
      return data;
    }
    if (!Array.isArray(df.data[c][i])) {
      data.table.push({ x: 0, y: df.data[c][i] });
      return data;
    }
    df.data[c][i].forEach((elem: any, index: any) => {
      data.table.push({ x: index, y: elem });
    });
    return data;
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Param1</InputLabel>
        <Select
          value={param1}
          onChange={event => setParam1(event.target.value as string)}
        >
          {props.columns.map(name => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Param2</InputLabel>
        <Select
          value={param2}
          onChange={event => setParam2(event.target.value as string)}
        >
          {props.index.map(name => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {param1 !== '' && param2 !== '' && (
          <VegaLite spec={spec} data={convert(props)} />
        )}
      </FormControl>
    </div>
  );
}
