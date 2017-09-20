import React, { Component } from 'react';
import t from 'tcomb-form';
import ReactDOM from 'react-dom';
import { getCRSFToken } from '../helpers/helpers.jsx'
import AddLocationMap from './addLocationMap.jsx';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import ol from 'openlayers';
import Button from 'react-bootstrap-button-loader';
const Form = t.form.Form;
var tComb = {}
const options = {
  fields: {
    description: {

      type: "textarea",

      attrs: {
        rows: "4"
      }
    }
  }
};
export default class AddTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      success: false,
      auth: false,
      assign: [],
      person: null,
      point: [],
      extent: null,
      value: null,
      priority:null,
      Category: null,
      status: null,
      checked:this.props.project.Project_config,
      loading:false,
      next:false
    }

    this.map = new ol.Map({
      //controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],
      layers: [new ol.layer.Tile({ title: 'OpenStreetMap', source: new ol.source.OSM() })],
      view: new ol.View({
        center: [
          0, 0
        ],
        zoom: 3
      })
    });

    var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/workers"
    fetch(url, { method: "GET", headers: new Headers({ "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() }) })
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((data) => {

        this.setState({ assign: data.objects }, () => {
          var tCombEnum = {}
          this.state.assign.forEach((user) => {
            tCombEnum[user.worker.resource_uri] = user.worker.username
          }

          )
          var priority = {}
          var Category = {}
          var status = {}
          if (this.state.checked.includes("priority")) {
            for (var i = 0; i < this.props.project.priority.priority.length; i++) {
              priority[this.props.project.priority.priority[i].label] = this.props.project.priority.priority[i].label
            }
          }
          if (this.state.checked.includes("Category")) {
            for (var j = 0; j < this.props.project.Category.Category.length; j++) {
              Category[this.props.project.Category.Category[j].label] = this.props.project.Category.Category[j].label
            }
          }
          if (this.state.checked.includes("status")) {
            for (var z = 0; z < this.props.project.status.status.length; z++) {
              status[this.props.project.status.status[z].label] = this.props.project.status.status[z].label
            }
          }
          this.setState({ priority: priority, Category: Category, status: status }, () => {
            const Priority = t.enums(this.state.priority)
            const Category = t.enums(this.state.Category)
            const Status = t.enums(this.state.status)
            const PersonObj = {
              title:t.String,
              // assigned_to: t.enums(tCombEnum),
        
            }
            if (this.state.checked.includes("description")) {
              PersonObj['description'] = this.props.project.Description.required_input?t.String:t.maybe(t.String)
            }
            if (this.state.checked.includes("assigned_to")) {
              PersonObj['assigned_to'] = this.props.project.assigned_to.required_input?t.enums(tCombEnum):t.maybe(t.enums(tCombEnum))
            }
            if (this.state.checked.includes("Category")) {
              PersonObj['Category'] =this.props.project.Category.required_input?Category: t.maybe(Category)
            }
            if (this.state.checked.includes("priority")) {
              PersonObj['priority'] = this.props.project.priority.required_input?Priority:t.maybe(Priority)
            }
            if (this.state.checked.includes("status")) {
              PersonObj['status'] = this.props.project.status.required_input?Status:t.maybe(Status)
            }
            if (this.state.checked.includes("due_date")) {
              PersonObj['due_date'] = this.props.project.due_date.required_input?t.Date:t.maybe(t.Date)
            }
            if (this.state.checked.includes("work_order")) {
              PersonObj['work_order'] = this.props.project.work_order.required_input?t.String:t.maybe(t.String)
            }
            const Person = t.struct(PersonObj)
            this.setState({ person: Person })
          })
        })
      });

    this.save = this.save.bind(this)
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

  checkDispatcher = () => {
    this.props.dispatchers.forEach((dispatcher) => {
      if (dispatcher.dispatcher.username == username) {
        this.setState({ auth: true })
      }
    })
  }
  init = (map) => {
    var point_feature = new ol.Feature({});
    map.on('singleclick', (e) => {
      this.setState({ point: e.coordinate, extent: map.getView().calculateExtent(map.getSize()), value: this.state.value })
      var point_geom = new ol.geom.Point(e.coordinate)
      point_feature.setGeometry(point_geom);
      var vector_layer = new ol.layer.Vector({ source: new ol.source.Vector({ features: [point_feature] }) })
      var style = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          anchor: [0.5, 10],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: URLS.static + 'marker.png'
        }))
      });
      vector_layer.setStyle(style);
      map.addLayer(vector_layer);
    })
  }

  save() {
  


    var value = this.state.value;
    if (value) {
      var project = { "project": { "pk": id } }
      if (this.state.point.length) {
        var mapconf = { "x": this.state.point[0], "y": this.state.point[1], "extent": this.state.extent.toString() }
        var copy1 = Object.assign(mapconf, value);
        var copy = Object.assign(project, copy1);
      }
      else {
        var copy = Object.assign(project, value);
      }

   this.setState({loading:true})
      var url = '/apps/cartoview_workforce_manager/api/v1/task/'
      fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: new Headers({ "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() }),
        body: JSON.stringify(copy)
      })
        .then(function (response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }

        }).then(() => {
          console.log("then")
          this.setState({ "success": true,"loading":false }, () => {

            // setTimeout(() => {
            //   this.setState({ "success": false})
              
            // }, 5000)


          })
        })
    }
  }
  componentWillMount() {
    this.checkDispatcher()
  }
  componentDidMount() {
  console.log(this.props.children)
   if(this.state.next){ this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
   console.log("nect")}
    console.log(this.refs.map)
    this.update(this.props.mapid);
    this.init(this.map)
    setTimeout(() => {
      this.map.updateSize()
      this.map.render()
    }, 3000)

  }
  next=()=>{
   var value=this.refs.form.getValue()
if(value){
    this.setState({next:true,value:this.refs.form.getValue()},()=>{
   
      this.map.setTarget(ReactDOM.findDOMNode(this.refs.map))})
}

  }
  prev=()=>{
     
    this.setState({next:false})
  
  }
  check=()=>{

  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.children != this.props.children) {

    // }
      this.setState({success:false,value:"",next:false,})
    // console.log(nextProps,"propsss")
  }
  render() {
    
    return (
      <div>
        <div className="col-md-2" ></div>
        <div className="col-md-8 ">
          {this.state.auth &&!this.state.next&& <div className="well" style={{"paddingBottom": "10%"}}>
            <br />
            {this.state.person &&
              <div><Form
                ref="form"
                options={options}
                type={this.state.person}
                value={this.state.value}
              />
               <button className="btn btn-default pull-right" style={{"margin":"2%"}}onClick={this.next} disabled={this.check()}>Next <i className="fa fa-arrow-right"></i></button>
     
              </div>
              } 
              </div>
             }
            { this.state.next&&!this.state.success&& <div className="well" style={{"paddingBottom": "10%"}}>
            <label>Click to Add Task Location</label>
            {!this.state.point.length && <small>(loctaion is not set)</small>}
              
            <div style={{ height: "100%" }} ref="map" className={'map-ct'}>
              {this.props.children}
              
            </div>
           <Button loading={this.state.loading} className="btndefault pull-right" style={{"margin":"2%"}} spinColor="#444" onClick={this.save}  >Save</Button>
           <Button className="btn btn-default pull-right" style={{"margin":"2%"}}onClick={this.prev}> <i className="fa fa-arrow-left"></i>Back</Button>  
            
          </div>}
          {this.state.success &&
            <div className="alert alert-info">
              Your Task was created successfully.
			 </div>}
        </div>
         <div className="col-md-2"></div>
        {!this.state.auth && <div className="col-md-8">
            <br />
            <div className="alert alert-info">
              Only Dispatchers can create new task.
          </div>
        </div>}

        <div className="col-md-2"></div>

      </div>
    )
  }
}

