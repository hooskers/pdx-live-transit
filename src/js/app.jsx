/** @jsx jsx */
import { Component } from 'react';
import { render } from 'react-dom';
import { css, Global, jsx } from '@emotion/core';
import { withGoogleMap, withScriptjs } from 'react-google-maps';

import MainMap from './components/MainMap';
import Sidebar from './components/Sidebar';
import mapsKey from './mapsKey';

import font from '../../assets/Orkney Regular.woff2';

if (!mapsKey) {
  throw new Error(`Incorrect or no Google Maps API key. Found: '${mapsKey}'`);
}

const containerStyle = css`
  position: relative;
  height: 100%;
  font-family: 'Orkney', 'Arial';

  .gm-style-mtc {
    display: none;
  }
`;

const Map = withScriptjs(withGoogleMap(props => <MainMap {...props} />));

class MainComponent extends Component {
  constructor() {
    super();

    this.state = {
      vehicles: [],
      intervalId: null,
      filterTerm: '',
      bounds: null,
      highlightedId: null,
      selectedId: null,
    };
  }

  componentWillMount() {
    const URL = 'https://lit-coast-37855.herokuapp.com';
    const intervalId = window.setInterval(() => {
      window
        .fetch(`${URL}/vehicles`, { mode: 'cors' })
        .then(res => res.json())
        .then(vehicles => {
          this.setVehicles(vehicles);
        });
    }, 2500);

    this.setState({ intervalId });
  }

  componentWillUnmount() {
    // Clear the interval that was created to pull vehicles from server
    const { intervalId } = this.state;
    window.clearInterval(intervalId);
  }

  /**
   * Sets the vehicles objects to the component state after filtering dupes
   *
   * @param {Array} vehicles The vehicle objects returned from server
   */
  setVehicles = vehicles => {
    const uniqueVehicles = vehicles.filter((vehicle, ind, arr) => {
      const { latitude, longitude, bearing } = vehicle.vehicle.position;

      const foundIndex = arr.findIndex(
        el =>
          latitude === el.vehicle.position.latitude &&
          longitude === el.vehicle.position.longitude &&
          bearing === el.vehicle.position.bearing,
      );

      if (foundIndex > -1 && foundIndex < ind) {
        return false;
      }

      return true;
    });

    this.setState({ vehicles: uniqueVehicles });
  };

  /**
   * Sets current filter term to component state
   *
   * @param {String} filterTerm String to filter vehicles on
   */
  setFilterTerm = filterTerm => {
    this.setState({ filterTerm });
  };

  /**
   * Sets current bounds to component state
   *
   * @param {Object} bounds The bounds class from GoogleMap component
   */
  setBounds = bounds => {
    this.setState({ bounds });
  };

  setHighlightedId = highlightedId => {
    this.setState({ highlightedId });
  };

  setSelectedId = newSelectedId => {
    const { selectedId } = this.state;

    if (newSelectedId === selectedId) {
      // If the IDs match, then the user wants to deselect this vehicle
      this.setState({ selectedId: null });
    } else {
      this.setState({ selectedId: newSelectedId });
    }
  };

  /**
   * Filters only vehicles that match a given term.
   * Checks term against the vehicle's label
   *
   * @param {Array} vehicles The array of vehicle objects
   * @param {String} term String that will be checked against vehicle's label
   */
  filterTerm = (vehicles, term) => {
    // If there is no term or no vehicles, just return the vehicles in state
    if (!term || !vehicles.length) return this.state.vehicles; //eslint-disable-line

    return vehicles.filter(vehicle => {
      // If the vehicle doesn't have a label, then filter it out
      if (!vehicle.vehicle.vehicle.label) return false;

      // Create a regex from the term we're filtering on and test it against
      // the vehicle's label. If it matches, return true.
      const termRegex = new RegExp(term, 'g');
      if (termRegex.test(vehicle.vehicle.vehicle.label.toLowerCase())) {
        return true;
      }

      return false;
    });
  };

  /**
   * Filters only the vehicles within the map bounds.
   * This helps performance by only showing what the user can see.
   *
   * @param {Array} vehicles The array of vehicle objects
   * @param {Object} bounds The bounds class from GoogleMap component
   */
  filterBounds = (vehicles, bounds) => {
    // If the bounds object is undefined, then return all vehicles
    if (!bounds || !vehicles.length) return vehicles;

    return vehicles.filter(vehicle => {
      const coords = {
        lat: vehicle.vehicle.position.latitude,
        lng: vehicle.vehicle.position.longitude,
      };

      // This will check if the vehicle's coordinates are within the map's bounds
      return bounds.contains(coords);
    });
  };

  render() {
    const {
      vehicles,
      filterTerm,
      bounds,
      highlightedId,
      selectedId,
    } = this.state;

    return (
      <div className="container" css={containerStyle}>
        <Global
          styles={`
          @font-face {
            font-family: 'Orkney';
            src: url(${font}) format('woff2');
          }
        `}
        />
        <Sidebar
          filterFunc={this.setFilterTerm}
          vehicles={this.filterBounds(
            this.filterTerm(vehicles, filterTerm),
            bounds,
          )}
          highlightedId={highlightedId}
          setHighlightedId={this.setHighlightedId}
          setSelectedId={this.setSelectedId}
          selectedId={selectedId}
        />
        <Map
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${mapsKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '100%', zIndex: 1 }} />}
          mapElement={<div style={{ height: '100%', width: '100%' }} />}
          vehicles={this.filterBounds(
            this.filterTerm(vehicles, filterTerm),
            bounds,
          )}
          setBoundsFunc={this.setBounds}
          highlightedId={highlightedId}
          selectedId={selectedId}
        />
      </div>
    );
  }
}
render(<MainComponent />, document.getElementById('app'));
