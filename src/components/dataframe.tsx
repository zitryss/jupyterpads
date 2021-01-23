import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core';

interface IDataFrame {
  columns: string[];
  index: string[];
  data: any[][];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1)
    },
    table: {
      width: 10
    }
  })
);

export default function Dataframe(props: IDataFrame) {
  const classes = useStyles();
  const { columns, index, data } = props;
  const [param, setParam] = useState('');

  const filter = (df: IDataFrame): any[] => {
    const c = df.columns.indexOf(param);
    if (c === -1) {
      return [];
    }
    const arr: any[] = [];
    for (const index in df.data) {
      arr.push(df.data[index][c]);
    }
    return arr;
  };

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
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow className={classes.table} key={'1'}>
                <TableCell>Run</TableCell>
                {filter({ columns, index, data }).map((elem, i) => {
                  return <TableCell align="right">#{i}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.table} key={'2'}>
                <TableCell component="th" scope="row">
                  Value
                </TableCell>
                {filter({ columns, index, data }).map((elem, i) => {
                  return <TableCell align="right">{elem}</TableCell>;
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
