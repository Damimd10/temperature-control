import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Chart = ({ data, minTemperature, maxTemperature, refTemperature }) => (
  <ResponsiveContainer width="100%" aspect={4.0}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="minute"
        label={{ value: 'Minutes', offset: -5, position: 'insideBottom' }}
        type="number"
        domain={[0, 120]}
      />
      <YAxis label={{ value: 'Temperature', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      <ReferenceLine
        y={minTemperature}
        label={{
          value: `Minimum Temperature ${minTemperature}°C`,
          offset: 10,
          position: 'top',
        }}
        stroke="blue"
        strokeDasharray="3 3"
      />
      <ReferenceLine
        y={refTemperature}
        label={{
          value: `Reference Temperature ${refTemperature}°C`,
          offset: 10,
          position: 'top',
        }}
        stroke="green"
        strokeDasharray="3 3"
      />
      <ReferenceLine
        y={maxTemperature}
        label={{
          value: `Maximum Temperature ${maxTemperature}°C`,
          offset: 10,
          position: 'bottom',
        }}
        stroke="red"
        strokeDasharray="3 3"
      />
      <Line type="monotone" dataKey="temperature" dot={false} stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default Chart;
