import React from 'react';
import ReactDOM from 'react-dom';

import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';

import ol from 'openlayers';

export default class ShowLocationMap extends React.Component {
  constructor(props) {
    super(props);
console.log(props)
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
      var url = `/maps/${mapId}/data`
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
        //  this.props.onMapReady(this.map)


        }
      });
    }
  }


  init=( map )=> {
    var point_feature = new ol.Feature({ });
  		if(this.props.x&&this.props.y) {

        //postrender because feature doesnt appear on componentDidMount 
         setTimeout(()=>{
      
        var point_geom = new ol.geom.Point([this.props.x,this.props.y])
        point_feature.setGeometry(point_geom);
        // console.log(point_feature)
        var vector_layer = new ol.layer.Vector({source: new ol.source.Vector({features: [point_feature]})})

        var fill = new ol.style.Fill({
        color: [180, 0, 100, 1]
          });
        var stroke = new ol.style.Stroke({
          color: [90, 0, 0, 1],
          width: 1
        });
        var style = new ol.style.Style({
        image: new ol.style.Circle({
          fill: fill,
          stroke: stroke,
          radius: 8
        }),
        fill: fill,
        stroke: stroke
      });
        vector_layer.setStyle(style);
       map.addLayer(vector_layer);




      },3000)}}




  componentDidMount() {
    this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
    this.update(this.props.mapId);
    this.init( this.map )
   

  }
  render() {

    var {className=''} = this.props;
    return (<div  ref="map" className={className + ' map-ct'}>

      {this.props.children}
    </div>);
  }}
