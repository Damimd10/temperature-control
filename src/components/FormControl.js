import React, { Fragment } from 'react';
import { Col, InputNumber, Row, Radio, Slider } from 'antd';

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

const FormControl = ({
  setTou,
  setSampleNumber,
  sampleNumber,
  sampleInterval,
  setSampleInterval,
  setTemperatureRange,
  refTemperature,
  setRefTemperature,
  mode,
  setMode,
}) => {
  return (
    <Fragment>
      <Row type="flex" justify="center" align="center">
        <Col>
          <Radio.Group defaultValue={mode} onChange={e => setMode(e.target.value)}>
            <Radio.Button value="cold">Cold Mode</Radio.Button>
            <Radio.Button value="heat">Heat Mode</Radio.Button>
            <Radio.Button value="hysteresis">Hysteresis Mode</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
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
    </Fragment>
  );
};

export default FormControl;
