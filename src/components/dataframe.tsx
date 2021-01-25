import React from 'react';
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

interface IProps {
  df: IDataFrame;
  paramDataframe: string;
  setParamDataframe: any;
}

interface IDataFrame {
  columns: string[];
  index: string[];
  data: any[][];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1)
    }
  })
);

export default function Dataframe(props: IProps) {
  const classes = useStyles();
  const { df, paramDataframe, setParamDataframe } = props;

  const filter = (df: IDataFrame): any[] => {
    const c = df.columns.indexOf(paramDataframe);
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
          value={paramDataframe}
          onChange={event => setParamDataframe(event.target.value as string)}
        >
          {df.columns.map(name => (
            <MenuItem key={name} value={name} dense={true}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {paramDataframe !== '' && (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow key={'1'}>
                <TableCell>Run</TableCell>
                {filter(df).map((elem, i) => {
                  return <TableCell align="right">#{i}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={'2'}>
                <TableCell component="th" scope="row">
                  Value
                </TableCell>
                {filter(df).map((elem, i) => {
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
// todo: do something with the table
