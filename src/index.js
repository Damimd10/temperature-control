import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import * as serviceWorker from './serviceWorker';

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { Layout } from 'antd';

import FormControl from './components/FormControl';

const createIntervalSampleArray = (size, sampleInterval) =>
  [...Array(size)].map((_, i) => i * sampleInterval);

const calculateK = (dt, tou) => dt / tou;

const calculateTemperature = (mode, sampleArray, K, minTemp, maxTemp) => {
  const formula = {
    heat: dt => (maxTemp + Math.exp(-(K * dt)) * (minTemp - maxTemp)).toFixed(2),
    cold: dt => (minTemp + Math.exp(-(K * dt)) * (maxTemp - minTemp)).toFixed(2),
  };

  return sampleArray.map(dt => ({
    temperature: formula[mode](dt),
    minute: dt,
  }));
};

const App = () => {
  const [tou, setTou] = React.useState(20);
  const [sampleNumber, setSampleNumber] = React.useState(120);
  const [sampleInterval, setSampleInterval] = React.useState(1);
  const [temperatureRange, setTemperatureRange] = React.useState([0, 100]);
  const [refTemperature, setRefTemperature] = React.useState(50);
  const [minTemperature, maxTemperature] = temperatureRange;
  const [mode, setMode] = React.useState('heat');

  const k = calculateK(1, tou);
  const sampleArray = createIntervalSampleArray(sampleNumber, sampleInterval);

  const data = calculateTemperature(mode, sampleArray, k, ...temperatureRange);

  return (
    <React.Fragment>
      <Layout>
        <Layout.Header style={{ height: '150px', backgroundColor: '#fdfdfd' }}>
          <FormControl
            setTou={setTou}
            setSampleNumber={setSampleNumber}
            sampleNumber={sampleNumber}
            sampleInterval={sampleInterval}
            setSampleInterval={setSampleInterval}
            setTemperatureRange={setTemperatureRange}
            refTemperature={refTemperature}
            setRefTemperature={setRefTemperature}
            mode={mode}
            setMode={setMode}
          />
        </Layout.Header>
        <Layout.Content>
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
        </Layout.Content>
      </Layout>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
