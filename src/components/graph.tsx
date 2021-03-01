import React from 'react';
import { VegaLite, VisualizationSpec } from 'react-vega';

interface IProps {
  chart: string;
}

export default function Graph(props: IProps) {
  const { chart } = props;
  const spec: VisualizationSpec = JSON.parse(chart);
  return <div>{chart !== '' && <VegaLite spec={spec} />}</div>;
}
