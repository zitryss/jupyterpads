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

export default function Dataframe(props: IDataFrame) {
  const classes = useStyles();
  const [param1, setParam1] = useState('');
  const [param2, setParam2] = useState('');

  function fn2(df: IDataFrame): any[] {
    const c = df.columns.indexOf(param1);
    const i = df.index.indexOf(param2);
    if (c === -1 || i === -1) {
      return [];
    }
    if (!Array.isArray(df.data[c][i])) {
      return [df.data[c][i]];
    }
    return df.data[c][i];
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
      </FormControl>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {fn2(props).map((elem, j) => {
                return <TableCell>#{j}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={1}>
              {fn2(props).map((elem, j) => {
                return <TableCell>{elem}</TableCell>;
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
