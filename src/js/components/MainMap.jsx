import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { css } from 'emotion';
import { GoogleMap, Marker } from 'react-google-maps';

import { getColor, fixBearing } from '../utils';
import { ARROW_PATH, CIRCLE_PATH } from '../constants';

const markerStyle = css`
  div {
    background-color: 'pink';
  }
`;

const MAP_CONTEXT = '__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';

class MainMap extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.setBoundsFunc(this.mapRef.context[MAP_CONTEXT].getBounds());
  }

  render() {
    return (
      <Fragment>
        <GoogleMap
          loadingElement={<div style={{ height: '100%' }} />}
          ref={(map) => { this.mapRef = map; }}
          defaultCenter={{ lat: 45.52, lng: -122.67 }}
          defaultZoom={14}
          onBoundsChanged={throttle(
              () => this.props.setBoundsFunc(this.mapRef.context[MAP_CONTEXT].getBounds()),
              500,
            )
          }
        >
          {this.props.vehicles.map((vehicle) => {
            const circleZoom = 12;
            const zoomLevel = this.mapRef.context[MAP_CONTEXT].zoom;
            const lat = vehicle.vehicle.position.latitude;
            const lng = vehicle.vehicle.position.longitude;
            const { bearing } = vehicle.vehicle.position;
            const arrowScalar = 17;
            const circleScalar = 12;
            // const colorRegex = new RegExp(/^\w+/);
            // let color = colorRegex.exec(vehicle.vehicle.vehicle.label)[0].toLowerCase();

            // if (/^\d/.test(color)) {
            //   color = 'black';
            // }

            const showCircles = zoomLevel < circleZoom;

            const scale = scalar => Math.sin(zoomLevel / scalar) ** 2;

            const arrow = {
              path: ARROW_PATH,
              size: 66,
              anchor: { x: (66 * scale(arrowScalar)) / 2, y: (66 * scale(arrowScalar)) / 2 },
            };

            const circle = {
              path: CIRCLE_PATH,
              size: 15,
              scalar: 12,
              anchor: { x: 0, y: 0 },
            };

            return (
              <Marker
                key={vehicle.id}
                className={`${markerStyle}`}
                position={{ lat, lng }}
                title={vehicle.vehicle.vehicle.label}
                icon={{
                  anchor: showCircles ? circle.anchor : arrow.anchor,
                  path: showCircles ? circle.path : arrow.path,
                  fillColor: getColor(vehicle.vehicle.vehicle.label),
                  strokeColor: 'black',
                  scale: showCircles ? scale(circleScalar) : scale(arrowScalar),
                  fillOpacity: 1,
                  rotation: fixBearing(bearing),
                }}
              />
            );
          })}
        </GoogleMap>
      </Fragment>
    );
  }
}

MainMap.propTypes = {
  vehicles: PropTypes.arrayOf(PropTypes.object).isRequired,
  setBoundsFunc: PropTypes.func.isRequired,
};

export default MainMap;
