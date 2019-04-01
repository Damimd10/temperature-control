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
import { InputNumber, Slider, Layout, Row, Col } from 'antd';

const marks = {
  0: '0°C',
  20: '20°C',
  40: '40°C',
  60: '60°C',
  80: '80°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};

const createIntervalSampleArray = (size, sampleInterval) =>
  [...Array(size)].map((_, i) => i * sampleInterval);

const calculateK = (dt, tou) => dt / tou;

const calculateTemperature = (sampleArray, K, minTemp, maxTemp) =>
  sampleArray.map(dt => ({
    temperature: (maxTemp + Math.exp(-(K * dt)) * (minTemp - maxTemp)).toFixed(2),
    minute: dt,
  }));

const App = () => {
  const [tou, setTou] = React.useState(20);
  const [sampleNumber, setSampleNumber] = React.useState(120);
  const [sampleInterval, setSampleInterval] = React.useState(1);
  const [temperatureRange, setTemperatureRange] = React.useState([0, 100]);
  const [refTemperature, setRefTemperature] = React.useState(50);
  const [minTemperature, maxTemperature] = temperatureRange;

  const k = calculateK(1, tou);
  const sampleArray = createIntervalSampleArray(sampleNumber, sampleInterval);

  const data = calculateTemperature(sampleArray, k, ...temperatureRange);

  return (
    <React.Fragment>
      <Layout>
        <Layout.Header style={{ height: '150px', backgroundColor: '#fdfdfd' }}>
          <Row type="flex" justify="space-around" align="center">
            <Col>
              <span className="label-form">Tou (minutes)</span>
              <InputNumber min={1} max={50} defaultValue={20} onChange={setTou} />
            </Col>
            <Col>
              <span className="label-form">Sampling Interval</span>
              <InputNumber min={1} max={60} defaultValue={1} onChange={setSampleInterval} />
            </Col>
            <Col>
              <span className="label-form">Sample Number</span>
              <InputNumber min={1} defaultValue={sampleNumber} onChange={setSampleNumber} />
            </Col>
            <Col>
              <span className="label-form">Reference Temperature</span>
              <InputNumber min={1} defaultValue={refTemperature} onChange={setRefTemperature} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Slider range marks={marks} defaultValue={[0, 100]} onChange={setTemperatureRange} />
            </Col>
          </Row>
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
