import React from 'react';
import ReactDOM from 'react-dom';

import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk//services/MapConfigService';

import ol from 'openlayers';

export default class LocationMap extends React.Component {
  constructor(props) {
    super(props);
    this.loaded = false;
    this.map = new ol.Map({
      //controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],
      layers: [new ol.layer.Tile({title: 'OpenStreetMap', source: new ol.source.OSM()})],
      view: new ol.View({
        center: [
          0, 0
        ],
        zoom: 3
      })
    });
  }
  update(mapId) {
    if (mapId) {
      var url = getMapConfigUrl(mapId);
      fetch(url, {
        method: "GET",
        credentials: 'include'
      }).then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      }).then((config) => {
        if (config) {
          MapConfigService.load(MapConfigTransformService.transform(config), this.map);
          this.props.onMapReady(this.map)
        }
      });
    }
  }

  componentDidMount() {
    this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
    this.update(this.props.mapId);
  }
  render() {
    var {className=''} = this.props;
    return (<div ref="map" className={className + ' map-ct'}>
      {this.props.children}
    </div>);
  }}