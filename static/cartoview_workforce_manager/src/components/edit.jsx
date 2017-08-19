import React, {Component} from 'react';
import t from 'tcomb-form';
import {getCRSFToken} from '../helpers/helpers.jsx'
import ReactDOM from 'react-dom';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk//services/MapConfigService';
const Form = t.form.Form;
var tComb = {}
import ol from 'openlayers';
const Priority = t.enums({
    0: 'Critical',
    1: 'High',
    2: 'Medium',
    3: 'Low',
    4: 'Very Low',
});
const Status = t.enums({

    1: 'Open',
    2: 'Re-opened',
    3: 'Closed',
    4: 'Duplicate',
    5: 'Resolved',
});

const assign = t.enums({});


export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            success: false,
            assign: [],
            task: null,
            x:this.props.task.x,
            y:this.props.task.y,
      		extent:this.props.task.extent,
            options: {
                "fields": {
                    "description": {
                        "type": "textarea",
                        "attrs": {
                            rows: "4"
                        }
                    }
                }
            },
            value: {
                title: this.props.task.title,
                short_description: this.props.task.short_description,
                description: this.props.task.description,
                assigned_to: "/apps/cartoview_workforce_manager/api/v1/user/"+this.props.task.assigned_to.id+"/",
                due_date: new Date(this.props.task.due_date),
                priority: this.props.task.priority,
                status: this.props.task.status,
                work_order: this.props.task.work_order,
                group: this.props.task.group
            }
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




        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/workers"
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),

            })
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {

                this.setState({assign: data.objects}, () => {
                    var tCombEnum = {}
                    this.state.assign.forEach((user) => {
                            tCombEnum[user.worker.resource_uri] = user.worker.username
                        }
                    )
                    const Task = t.struct({
                        title: t.String,
                        short_description: t.String,
                        description: t.String,
                        assigned_to: t.enums(tCombEnum),
                        work_order: t.maybe(t.Integer),
                        group:t.maybe(t.String),
                        due_date: t.Date,
                        priority: Priority,
                        status: Status,// enum,

                    })

                    this.setState({task: Task})

                })
            });


        this.save = this.save.bind(this)
        console.log(this.state)
    }

    update(mapId) {
      console.log("mapid",mapId);
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
    		map.on('singleclick', ( e ) => {


          this.setState({x:e.coordinate[0],y:e.coordinate[1],extent:map.getView().calculateExtent(map.getSize()),value:this.state.value})
          var point_geom = new ol.geom.Point(e.coordinate)
          console.log( this.state)

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





        })


        if(this.state.x&&this.state.y) {

          //postrender because feature doesnt appear on componentDidMount
       
   setTimeout(()=>{
          var point_geom = new ol.geom.Point([this.state.x,this.state.y])
          point_feature.setGeometry(point_geom);
          // console.log(point_feature)
          var vector_layer = new ol.layer.Vector({source: new ol.source.Vector({features: [point_feature]})})
            map.setView(new ol.View({
            center:  [parseInt(this.state.x),parseInt(this.state.y)],
            zoom: 6
                                        }));
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




      },500)}}

        


    save() {
        // call getValue() to get the values of the form
        var value = this.refs.form.getValue();

        if (value) {
            var project = {"project": {"pk": id}}

            if(this.state.x&&this.state.y){
            var mapconf={"x":this.state.x,"y":this.state.y,"extent":this.state.extent.toString()}

            var copy1 = Object.assign(mapconf, value);
            var copy = Object.assign(project, copy1);
            }
            else{
            var copy = Object.assign(project, value);}

            var url = '/apps/cartoview_workforce_manager/api/v1/task/' + this.props.task.id

            fetch(url, {
                method: "PUT",
                credentials: "same-origin",
                headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-CSRFToken": getCRSFToken(),

                }),
                body: JSON.stringify(copy)
            })
                .then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                }).then((res) => {
                this.setState({"success": true})
            })


        }
    }
    componentDidMount() {
      this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
      this.update(this.props.mapid);
      this.init( this.map )
      setTimeout(()=>{
        this.map.updateSize()
        // this.map.render()
      },3000)




    }
  componentWillReceiveProps(nextProps){
  	if(nextProps.children != this.props.children){

  	}
  }

    render() {
        return (
            <div>

                < div className=" ">

                    <div style={{"padding": "2%"}}>
                        {this.state.task &&

                        <Form
                            ref="form"
                            options={this.state.options}
                            type={this.state.task}
                            value={this.state.value}
                        />}
                        <label>Click to Edit Task Location</label>
                          <div style={{height:"100%"}} ref="map" className={' map-ct'}>

                           {this.props.children}
                         </div>
                        <button className="btn btn-primary" onClick={this.save}>Save</button>
                    </div>
                </div>


                {this.state.success && <div>
                    <br/>
                    <div className="alert alert-info">
                        Your changes were saved successfully.
                    </div>

                </div>}

            </div>
        )
    }
}
