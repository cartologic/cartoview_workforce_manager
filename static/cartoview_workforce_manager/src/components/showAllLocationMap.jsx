import React from 'react';
import ReactDOM from 'react-dom';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import ol from 'openlayers';

export default class ShowAllLocationMap extends React.Component {
  constructor(props) {
    super(props);
     this.state={
         points:[]
     }
    this.loaded = false;
    this.map = new ol.Map({
        layers: [new ol.layer.Tile({title: 'OpenStreetMap', source: new ol.source.OSM()})],
        view: new ol.View({
          center: [
          0, 0
                  ],
          zoom: 3
      })
    });
    this.preparePoints()
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

preparePoints=()=>{
 var url = '/apps/cartoview_workforce_manager/api/v1/project/' + this.props.project + '/tasks'
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            })
        })
            .then(function (response) {

                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {
               var array =[]
                this.setState({tasks: data.objects},()=>{
                 this.state.tasks.forEach((task)=>{
                  var point_feature = new ol.Feature({ });
                  var point_geom = new ol.geom.Point([task.x,task.y])
                  point_feature.setGeometry(point_geom);
                  array.push(point_feature)

                 })
                 this.setState({points:array},()=>{

                            var vector_layer = new ol.layer.Vector({source: new ol.source.Vector({features: this.state.points})})
                            var style = new ol.style.Style({
                            image: new ol.style.Icon(({
                             anchor: [0.5, 45],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            src: URLS.static +'marker.png'
                        }))
                        });
                            vector_layer.setStyle(style);
                            this.map.addLayer(vector_layer);
                 })
                })
            })
          }
  componentDidMount() {
    this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
    this.update(this.props.mapId);
   
    setTimeout(()=>{
      this.map.updateSize()
      this.map.render()
    },3000)

  }
  render() {

    var {className=''} = this.props;
    return (<div  ref="map" style={{"height":"250px"}}  className={className + ' map-ct'}>
      {this.props.children}
    </div>);
  }}
