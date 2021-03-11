import React, { useState } from 'react';
import { VegaLite, VisualizationSpec } from 'react-vega';
import { Slider, Typography } from '@material-ui/core';

interface IProps {
  charts: any;
}

const defaultSpec: VisualizationSpec = {};

export default function Graph(props: IProps) {
  const { charts } = props;
  const [spec, setSpec] = useState(defaultSpec);

  const handleChange = (event: any, newValue: any) => {
    setSpec(charts[newValue]);
  };

  return (
    <div>
      <Typography id="discrete-slider" gutterBottom>
        Split
      </Typography>
      <Slider
        defaultValue={0}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={charts.length - 1}
        onChange={handleChange}
      />
      <VegaLite spec={spec} />;
    </div>
  );
}
