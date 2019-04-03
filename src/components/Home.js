import React, { Fragment } from 'react';
import { Layout } from 'antd';

import Chart from './Chart';
import FormControl from './FormControl';

const createIntervalSampleArray = (size, sampleInterval) =>
  [...Array(size)].map((_, i) => i * sampleInterval);

const calculateK = (dt, tou) => dt / tou;

const calculateTemperature = (mode, sampleArray, K, minTemp, maxTemp) => {
  const formula = {
    heat: dt => (maxTemp + Math.exp(-(K * dt)) * (minTemp - maxTemp)).toFixed(2),
    cold: dt => (minTemp + Math.exp(-(K * dt)) * (maxTemp - minTemp)).toFixed(2),
  };

  return sampleArray.map(dt => ({ temperature: formula[mode](dt), minute: dt }));
};

const calculateWithHysteresis = (
  minHysteresis,
  maxHysteresis,
  sampleArray,
  k,
  minTemperature,
  maxTemperature,
) => {
  let i = 0;
  let j = 0;
  let x = 0;
  let result = [];

  let heat = true;

  const formula = {
    heat: dt =>
      (maxTemperature + Math.exp(-(k * dt)) * (minTemperature - maxHysteresis)).toFixed(2),
    cold: dt =>
      (minTemperature + Math.exp(-(k * dt)) * (maxHysteresis - minTemperature)).toFixed(2),
  };

  while (i < sampleArray.length) {
    if (heat) {
      const temperature = formula['heat'](x);
      result.push({ temperature, minute: sampleArray[i] });
      x++;
      if (temperature > maxHysteresis) {
        heat = false;
        x = 0;
      }
    }

    if (!heat) {
      const temperature = formula['cold'](j);
      result.push({ temperature, minute: sampleArray[i] });
      j++;
      if (temperature < minHysteresis) {
        heat = true;
        j = 0;
      }
    }

    i++;
  }

  return result;
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
  let data;

  if (mode === 'hysteresis') {
    data = calculateWithHysteresis(
      minHysteresis,
      maxHysteresis,
      sampleArray,
      k,
      ...temperatureRange,
    );
  } else {
    data = calculateTemperature(mode, sampleArray, k, ...temperatureRange);
  }

  console.log('HERE', data);

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
