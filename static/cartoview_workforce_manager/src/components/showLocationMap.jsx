import React from 'react';
import ReactDOM from 'react-dom';

import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';

import ol from 'openlayers';

export default class ShowLocationMap extends React.Component {
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
        zoom: 3,
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
  


        }
      });
    }
  }


  init=( map )=> {
    console.log("hheee")

    var point_feature = new ol.Feature({ });
  		if(this.props.x&&this.props.y) {

        
         setTimeout(()=>{
      
        var point_geom = new ol.geom.Point([this.props.x,this.props.y])
        point_feature.setGeometry(point_geom);
        var vector_layer = new ol.layer.Vector({source: new ol.source.Vector({features: [point_feature]})})       
        map.setView(new ol.View({
        center:  [parseInt(this.props.x),parseInt(this.props.y)],
        zoom: 3
                                  }));
          var style = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 45],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: URLS.static +'marker.png'
        }))
        });
        vector_layer.setStyle(style);
       map.addLayer(vector_layer);
      },500)}}




  componentDidMount() {
    console.log("did ni")
    this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
    this.update(this.props.mapId);
    this.init( this.map )
   setTimeout(() => {
      this.map.updateSize()
      this.map.render()
    }, 1000)

  }
 componentWillReceiveProps(nextProps){
    console.log("show will pre")
  }

  render() {
console.log("render")
    var {className=''} = this.props;
    return (<div  ref="map"   style={{"height":"250px"}} className={className + ' map-ct'}>

      {this.props.children}
    </div>);
      this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
        this.update(this.props.mapId);
    this.init( this.map )
  }
  }
