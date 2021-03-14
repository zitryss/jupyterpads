import React, { useEffect, useState } from 'react';
import { VegaLite, VisualizationSpec } from 'react-vega';
import { createStyles, makeStyles, Slider, Theme } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface IProps {
  charts: IChart[];
}

interface IChart {
  split_id: string;
  specs: VisualizationSpec[];
}

const defaultSpec: VisualizationSpec = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1)
    }
  })
);

export default function Graph(props: IProps) {
  const classes = useStyles();
  const { charts } = props;
  const [paramSplit, setParamSplit] = useState('');
  const [spec, setSpec] = useState(defaultSpec);

  useEffect(() => {
    setParamSplit(charts[0].split_id);
    setSpec(charts[0].specs[0]);
  }, []);

  const filter = (charts: IChart[]): IChart => {
    const c = charts
      .map(chart => {
        return chart.split_id;
      })
      .indexOf(paramSplit);
    if (c === -1) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      return { split_id: '', specs: [] };
    }
    return charts[c];
  };

  const handleChange = (event: any, newValue: any) => {
    setSpec(filter(charts).specs[newValue]);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Param</InputLabel>
        <Select
          value={paramSplit}
          onChange={event => setParamSplit(event.target.value as string)}
        >
          {charts.map(chart => (
            <MenuItem key={chart.split_id} value={chart.split_id} dense={true}>
              {chart.split_id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {paramSplit !== '' && (
        <div>
          <Slider
            defaultValue={0}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={filter(charts).specs.length - 1}
            onChange={handleChange}
          />
          <VegaLite spec={spec} />
        </div>
      )}
    </div>
  );
}
