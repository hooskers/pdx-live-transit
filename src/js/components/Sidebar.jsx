import React, { Component } from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';

import VehicleInfo from './VehicleInfo';
import { getColor } from '../utils';

const sidebarStyle = css`
  position: absolute;
  z-index: 3;
  background-color: whitesmoke;
  background-color: #000000b0;
  height: 100%;
  width: 25%;
  box-shadow: 3px 0px 8px 1px #00000050;
  box-shadow: none;
  overflow: scroll;
  backdrop-filter: blur(5px);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;

  #filter {
    display: block;
    border: none;
    background-color: #0000;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    outline: none;
    font-size: x-large;
    height: 2em;
    color: white;
  }

  hr {
    margin-top: 0px;
  }
`;

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={`sidebar ${sidebarStyle}`}>
        <input
          onChange={(e) => {
            this.props.filterFunc(e.target.value.trim().toLowerCase());
          }}
          id="filter"
          placeholder="Start typing to filter"
          ref={(input) => { this.filterInput = input; }}
        />
        <hr />
        {this.props.vehicles.map(vehicle => (
          <VehicleInfo
            key={vehicle.id}
            vehicleId={parseInt(vehicle.id, 10)}
            label={vehicle.vehicle.vehicle.label}
            color={getColor(vehicle.vehicle.vehicle.label)}
            tripId={parseInt(vehicle.vehicle.trip.tripId, 10)}
            stopStatus={vehicle.vehicle.currentStatus}
            stopId={parseInt(vehicle.vehicle.stopId, 10)}
          />
        ))}
      </div>
    );
  }
}

Sidebar.propTypes = {
  filterFunc: PropTypes.func.isRequired,
  vehicles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;
