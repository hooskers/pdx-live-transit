/** @jsx jsx */
import { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { css, jsx } from '@emotion/core';
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
    const { setBoundsFunc } = this.props;
    setBoundsFunc(this.mapRef.context[MAP_CONTEXT].getBounds());
  }

  render() {
    const { setBoundsFunc, vehicles, highlightedId, selectedId } = this.props;

    return (
      <GoogleMap
        loadingElement={<div style={{ height: '100%' }} />}
        ref={map => {
          this.mapRef = map;
        }}
        defaultCenter={{ lat: 45.52, lng: -122.67 }}
        defaultZoom={14}
        onBoundsChanged={throttle(
          () => setBoundsFunc(this.mapRef.context[MAP_CONTEXT].getBounds()),
          500,
        )}
      >
        {vehicles.map(vehicle => {
          const vehicleId = parseInt(vehicle.id, 10);
          const circleZoom = 12;
          const zoomLevel = this.mapRef.context[MAP_CONTEXT].zoom;
          const lat = vehicle.vehicle.position.latitude;
          const lng = vehicle.vehicle.position.longitude;
          const { bearing } = vehicle.vehicle.position;

          const arrowScalar =
            highlightedId === vehicleId || selectedId === vehicleId
              ? 17 / 2
              : 17;

          const circleScalar =
            highlightedId === vehicleId || selectedId === vehicleId
              ? 12 / 2
              : 12;

          const showCircles = zoomLevel < circleZoom;

          const scale = (zoom, scalar) => Math.sin(zoom / scalar) ** 2;

          const arrow = {
            path: ARROW_PATH,
            size: 66,
            anchor: {
              x: (66 * scale(zoomLevel, arrowScalar)) / 2,
              y: (66 * scale(zoomLevel, arrowScalar)) / 2,
            },
          };

          const circle = {
            path: CIRCLE_PATH,
            size: 15,
            anchor: { x: 0, y: 0 },
          };

          const calcOpacity = (hId, sId, vId) => {
            if (
              (hId === null && sId === null) ||
              (hId === vId || sId === vId)
            ) {
              return 1;
            }

            return 0.2;
          };

          return (
            <Marker
              key={vehicleId}
              css={markerStyle}
              position={{ lat, lng }}
              title={vehicle.vehicle.vehicle.label}
              icon={{
                anchor: showCircles ? circle.anchor : arrow.anchor,
                path: showCircles ? circle.path : arrow.path,
                fillColor: getColor(vehicle.vehicle.vehicle.label),
                strokeColor: 'black',
                scale: showCircles
                  ? scale(zoomLevel, circleScalar)
                  : scale(zoomLevel, arrowScalar),
                fillOpacity: calcOpacity(highlightedId, selectedId, vehicleId),
                rotation: fixBearing(bearing),
              }}
            />
          );
        })}
      </GoogleMap>
    );
  }
}

MainMap.propTypes = {
  vehicles: PropTypes.arrayOf(PropTypes.object).isRequired,
  setBoundsFunc: PropTypes.func.isRequired,
  highlightedId: PropTypes.number,
  selectedId: PropTypes.number,
};

MainMap.defaultProps = {
  highlightedId: null,
  selectedId: null,
};

export default MainMap;
