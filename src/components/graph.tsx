import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
    }
  })
);

export default function Graph(props: IDataFrame) {
  const classes = useStyles();
  const { columns, index, data } = props;
  const [param, setParam] = useState('');

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
    const c = df.columns.indexOf(param);
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
          value={param}
          onChange={event => setParam(event.target.value as string)}
        >
          {columns.map(name => (
            <MenuItem key={name} value={name} dense={true}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {param !== '' && (
        <div>
          <VegaLite spec={spec} data={filter({ columns, index, data })} />
        </div>
      )}
    </div>
  );
}
