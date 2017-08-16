import React, {Component} from 'react';
import t from 'tcomb-form';
import ReactDOM from 'react-dom';
import {getCRSFToken} from '../helpers/helpers.jsx'
import AddLocationMap from './addLocationMap.jsx';

import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk//services/MapConfigService';

import ol from 'openlayers';
const Form = t.form.Form;
var tComb={}
const Priority = t.enums({
	  0: 'Critical',
	  1: 'High',
	  2: 'Medium',
	  3: 'Low',
	  4: 'Very Low',
});
const Status= t.enums({

	  1: 'Open',
	  2: 'Re-opened',
	  3: 'Closed',
	  4: 'Duplicate',
	  5: 'Resolved',
});

const assign= t.enums({


});

const options = {
	fields: {
			description: {

				type: "textarea",

				attrs:{
					rows:"4"
				}
		}
	}
};

export default class AddTask extends Component {
	constructor( props ) {
		super( props )
		this.state={
			success: false,
      auth:false,
			assign:[],
      person:null,
			point:[],
			extent:null,
			value:null
		}


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


         var url='/apps/cartoview_workforce_manager/api/v1/project/'+id+"/workers"
		 fetch(url,{method:"GET",headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( )})})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                        return response.json();
                    })
                    .then((data)=> {

                        this.setState({assign :data.objects},()=>{
                    	var tCombEnum={}
                                this.state.assign.forEach((user)=>{
                                    tCombEnum[user.worker.resource_uri]=user.worker.username
                                }

    )
                         const Person = t.struct({
                              title: t.String,
                              short_description: t.String,
                              description: t.String,
                              assigned_to :t.enums(tCombEnum),
                              due_date: t.Date,
							  work_order:t.maybe(t.Integer),
							  group:t.maybe(t.String),
                              priority: Priority ,
                            //  status: Status,// enum,

                        })

                            this.setState({person:Person})

					 })
                    });



		this.save=this.save.bind(this)
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

checkDispatcher=()=>{
console.log( this.props.dispatchers,username)
  this.props.dispatchers.forEach((dispatcher)=>{
if (dispatcher.dispatcher.username==username){
  this.setState({auth:true})
}
  })
}
  init=( map )=> {
    var point_feature = new ol.Feature({ });
  		map.on('singleclick', ( e ) => {

        
        this.setState({point:e.coordinate,extent:map.getView().calculateExtent(map.getSize()),value:this.refs.form.getValue()})
        var point_geom = new ol.geom.Point(e.coordinate)
        point_feature.setGeometry(point_geom);
        var vector_layer = new ol.layer.Vector({source: new ol.source.Vector({features: [point_feature]})})

         var style = new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 10],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: URLS.static +'marker.png'
      }))
      });
       
        vector_layer.setStyle(style);
        map.addLayer(vector_layer);




      })}

	 save() {

    var value = this.refs.form.getValue();

    if (value) {
var project={"project":{"pk":id}}
if(this.state.point.length){
var mapconf={"x":this.state.point[0],"y":this.state.point[1],"extent":this.state.extent.toString()}

var copy1 = Object.assign(mapconf, value);
var copy = Object.assign(project, copy1);
}
else{
var copy = Object.assign(project, value);}
console.log(copy)

   var url='/apps/cartoview_workforce_manager/api/v1/task/'

		 fetch(url,{method:"POST",
		            credentials: "same-origin",
		            headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( )}),
					body:JSON.stringify(copy)
					})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }

                    }).then(()=>{this.setState({"success":true},()=>{

                        setTimeout(()=>{
													this.setState({"success":false})

												},5000)

										})})



    }
  }
  componentWillMount(){
    this.checkDispatcher()
  }
	componentDidMount() {
    this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
    this.update(this.props.mapid);
    this.init( this.map )

    setTimeout(()=>{
      this.map.updateSize()
      this.map.render()
    },3000)




  }
componentWillReceiveProps(nextProps){
	if(nextProps.children != this.props.children){

	}
}
	render( ) {
		return (
			<div>
			<div className="col-md-2"></div>
			<div className="col-md-8 ">
                {  this.state.auth&& < div className="well">

                    <br/>

                    {this.state.person &&


                    <Form
                    ref="form"
										options={options}
                    type={this.state.person}
										value={this.state.value}

                    />}
                     <label>Click to Add Task Location</label>{!this.state.point.length &&<small> ( loctaion is not set)</small>}
											 <div style={{height:"100%"}} ref="map" className={' map-ct'}>

										 		{this.props.children}
										 	</div>
                    <button className="btn btn-primary" onClick={this.save}>Save</button>
                    </div>


                }


				{this.state.success &&

				  <div className="alert alert-info">
           Your Task was created successfully.

			 </div>}
		 </div>
		 <div className="col-md-2"></div>
         	{!this.state.auth && <div className="col-md-8">
					<br/>
				<div className="alert alert-info">
  Only Dispatchers can create new task.
</div>

				 </div>}

		<div className="col-md-2"></div>

			</div>
		 )
	}
}
