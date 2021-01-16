import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { makeStyles } from '@material-ui/core';

interface IProps {
  expName: any;
  setExpName: any;
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
  const { expName, setExpName, initCode, setInitCode } = props;

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Config</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form className={classes.input} noValidate autoComplete="off">
          <TextField
            label="Initialization Code"
            multiline
            rowsMax={10}
            variant="outlined"
            value={initCode}
            onChange={event => setInitCode(event.target.value)}
          />
          <TextField
            label="Experiment Name"
            value={expName}
            onChange={event => setExpName(event.target.value)}
          />
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
