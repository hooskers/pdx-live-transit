import React, { Component } from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';

import VehicleInfo from './VehicleInfo';
import getColor from '../utils';

const sidebarStyle = css`
  position: absolute;
  z-index: 3;
  background-color: #000000c7;
  background-color: whitesmoke;
  height: 100%;
  width: 25%;
  box-shadow: 3px 0px 8px 1px #00000050;
  overflow: scroll;

  #filter {
    display: block;
    border: none;
    border-bottom: solid 1px black;
    background-color: #0000;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    outline: none;
    font-size: x-large;
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
