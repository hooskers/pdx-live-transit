import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { sentenceCase } from '../utils';

const vehicleInfoStyle = css`
  height: 6em;
  border-bottom: 1px solid #9a9a9a;
  padding: 7px;
  border-radius: 5px;
  background-color: whitesmoke;
  margin-bottom: 5px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;

  .vehicle-info-grid {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 2fr;
    grid-template-columns: 1fr 10fr;
    grid-column-gap: 10px;

    .color {
      float: left;
      height: 45px;
      width: 45px;
      border-radius: 360px;
      border: 1px solid black;
      grid-row-start: 1;
      grid-row-end: 4;
      align-self: center;
    }
    
    .label {
      font-size: large;
      font-weight: bold;
      grid-column-start: 2;
      grid-column-end: 4;
    }
  }

  .info {
    align-self: center;
  }
`;

const VehicleInfo = ({
  vehicleId,
  label,
  color,
  tripId,
  stopStatus,
  stopId,
}) => (
  <div className={vehicleInfoStyle}>
    <div className="vehicle-info-grid">
      <div className="label">{label}</div>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="info">
        <div>ID: {vehicleId}</div>
        <div>Trip ID: {tripId}</div>
        <div>{`${sentenceCase(stopStatus)} ${stopId}`}</div>
      </div>
    </div>
  </div>
);

VehicleInfo.propTypes = {
  vehicleId: PropTypes.number.isRequired,
  label: PropTypes.string,
  color: PropTypes.string.isRequired,
  tripId: PropTypes.number.isRequired,
  stopStatus: PropTypes.string.isRequired,
  stopId: PropTypes.number.isRequired,
};

VehicleInfo.defaultProps = {
  label: '*No label provided*',
};

export default VehicleInfo;
