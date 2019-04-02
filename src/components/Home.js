import React, { Fragment } from 'react';
import { Layout } from 'antd';

import Chart from './Chart';
import FormControl from './FormControl';

const createIntervalSampleArray = (size, sampleInterval) =>
  [...Array(size)].map((_, i) => i * sampleInterval);

const calculateK = (dt, tou) => dt / tou;

const calculateTemperature = (
  minHysteresis,
  maxHysteresis,
  mode,
  sampleArray,
  K,
  minTemp,
  maxTemp,
) => {
  const formula = {
    heat: dt => (maxTemp + Math.exp(-(K * dt)) * (minTemp - maxTemp)).toFixed(2),
    cold: dt => (minTemp + Math.exp(-(K * dt)) * (maxTemp - minTemp)).toFixed(2),
    hysteresis: dt => 0,
  };

  // DOWN = (0 + Math.exp(-(0.05 * 1)) * (65 - 0)).toFixed(2) = 61.83
  // (minTemp + Math.exp(-(K * dt)) * (maxHysteresis - minTemp)).toFixed(2),

  // UP = (100 + Math.exp(-(0.05 * 1)) * (0 - 65)).toFixed(2)
  // (maxTemp + Math.exp(-(K * dt)) * (minTemperature - maxHysteresis)).toFixed(2)

  return sampleArray.map(dt => ({ temperature: formula[mode](dt), minute: dt }));
};

const Home = () => {
  const [tou, setTou] = React.useState(20);
  const [sampleNumber, setSampleNumber] = React.useState(120);
  const [sampleInterval, setSampleInterval] = React.useState(1);
  const [temperatureRange, setTemperatureRange] = React.useState([0, 100]);
  const [refTemperature, setRefTemperature] = React.useState(50);
  const [minTemperature, maxTemperature] = temperatureRange;
  const [mode, setMode] = React.useState('heat');
  const [minHysteresis, setMinHysteresis] = React.useState(35);
  const [maxHysteresis, setMaxHysteresis] = React.useState(65);

  const k = calculateK(1, tou);
  const sampleArray = createIntervalSampleArray(sampleNumber, sampleInterval);

  const data = calculateTemperature(
    minHysteresis,
    maxHysteresis,
    mode,
    sampleArray,
    k,
    ...temperatureRange,
  );

  return (
    <Fragment>
      <Layout>
        <Layout.Header style={{ height: '180px', backgroundColor: '#fdfdfd' }}>
          <FormControl
            maxHysteresis={maxHysteresis}
            minHysteresis={minHysteresis}
            mode={mode}
            refTemperature={refTemperature}
            sampleInterval={sampleInterval}
            sampleNumber={sampleNumber}
            setMaxHysteresis={setMaxHysteresis}
            setMinHysteresis={setMinHysteresis}
            setMode={setMode}
            setRefTemperature={setRefTemperature}
            setSampleInterval={setSampleInterval}
            setSampleNumber={setSampleNumber}
            setTemperatureRange={setTemperatureRange}
            setTou={setTou}
          />
        </Layout.Header>
        <Layout.Content>
          <Chart
            data={data}
            minTemperature={minTemperature}
            maxTemperature={maxTemperature}
            refTemperature={refTemperature}
          />
        </Layout.Content>
      </Layout>
    </Fragment>
  );
};

export default Home;
