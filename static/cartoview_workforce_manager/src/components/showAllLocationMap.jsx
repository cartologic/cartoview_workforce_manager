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
      //controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],
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
        //  this.props.onMapReady(this.map)


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
                            anchor: [0.5, 10],
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

  init=( map )=> {
  
  	

        
         
    //     var vector_layer = new ol.layer.Vector({source: new ol.source.Vector({features: this.state.points})})

       
    //     var style = new ol.style.Style({
    //       image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    //       anchor: [0.5, 10],
    //       anchorXUnits: 'fraction',
    //       anchorYUnits: 'pixels',
    //       src: URLS.static +'marker.png'
    //   }))
    //   });
    //     vector_layer.setStyle(style);
    //    map.addLayer(vector_layer);




  }




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
