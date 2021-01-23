import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { makeStyles } from '@material-ui/core';

interface IProps {
  initCode: any;
  setInitCode: any;
}

const useStyles = makeStyles(theme => ({
  input: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

export default function Config(props: IProps) {
  const classes = useStyles();
  const { initCode, setInitCode } = props;

  return (
    <div>
      <Typography className={classes.heading}>Config</Typography>
      <form className={classes.input} noValidate autoComplete="off">
        <TextField
          label="Initialization Code"
          multiline
          rowsMax={10}
          variant="outlined"
          value={initCode}
          onChange={event => setInitCode(event.target.value)}
        />
      </form>
    </div>
  );
}
