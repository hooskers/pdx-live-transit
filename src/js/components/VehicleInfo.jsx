import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';

const vehicleInfoStyle = css`
  height: 50px;
  border-bottom: 1px solid #9a9a9a;
  padding: 7px;

  .color {
    float: left;
    height: 100%;
    width: 50px;
    border-radius: 360px;
    border: 1px solid black;
  }
`;

const VehicleInfo = ({ vehicleId, label, color }) => (
  <div className={vehicleInfoStyle}>
    <div className="color" style={{ backgroundColor: color }} />
    <span>{label}</span>
    <span>{vehicleId}</span>
  </div>
);

VehicleInfo.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string.isRequired,
  vehicleId: PropTypes.number.isRequired,
};

VehicleInfo.defaultProps = {
  label: 'No label provided',
};

export default VehicleInfo;
