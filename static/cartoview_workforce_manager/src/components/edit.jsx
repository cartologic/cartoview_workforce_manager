import React, {Component} from 'react';
import t from 'tcomb-form';
import {getCRSFToken} from '../helpers/helpers.jsx'
import ReactDOM from 'react-dom';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk//services/MapConfigService';
const Form = t.form.Form;
import Comments from './comments';
import Attachments from './attachments.jsx';
var tComb = {}
import ol from 'openlayers';

export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            success: false,
            assign: [],
            task: null,
            loading:true,
            x:this.props.task.x,
            y:this.props.task.y,
      		extent:this.props.task.extent,
            history:"",
            checked:this.props.project.Project_config,
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
                description: this.props.task.description,
                assigned_to: "/apps/cartoview_workforce_manager/api/v1/user/"+this.props.task.assigned_to.id+"/",
                due_date:this.props.task.due_date?new Date(this.props.task.due_date):null,
                priority: this.props.task.priority,
                status: this.props.task.status,
                work_order: this.props.task.work_order,
                Category: this.props.task.Category
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
                    this.setState({tCombEnum})
                    var priority={}
                    var Category={}
                    var status={}
                    
                    if(this.state.checked.includes("priority")){
                        for(var i=0;i<this.props.project.priority.priority.length;i++){
                           priority[this.props.project.priority.priority[i].label]=this.props.project.priority.priority[i].label
                       
                        } }
                         
                    if(this.state.checked.includes("Category")){
                        for(var j=0;j<this.props.project.Category.Category.length;j++){
                           Category[this.props.project.Category.Category[j].label]=this.props.project.Category.Category[j].label
                    
                    } }
                    if(this.state.checked.includes("status")){
                        
                        for(var z=0;z<this.props.project.status.status.length;z++){
                        status[this.props.project.status.status[z].label]=this.props.project.status.status[z].label
                    
                    } }
                 this.setState({priority:priority,Category:Category,status:status},()=>{                          
                const Priority = t.enums(this.state.priority)
                const Category = t.enums(this.state.Category)
                const Status = t.enums(this.state.status)
            
                    const TaskObj = {
                        title: t.String,
                        // description: t.String,
                        // assigned_to: t.enums(tCombEnum),
                        // work_order: t.maybe(t.Integer),
                        // due_date: t.Date,                      
                    }
                     if (this.state.checked.includes("description")) {
              TaskObj['description'] = this.props.project.Description.required_input?t.String:t.maybe(t.String)
            }
            if (this.state.checked.includes("assigned_to")) {
              TaskObj['assigned_to'] = this.props.project.assigned_to.required_input?t.enums(tCombEnum):t.maybe(t.enums(tCombEnum))
            }
            if (this.state.checked.includes("Category")) {
              TaskObj['Category'] =this.props.project.Category.required_input?Category: t.maybe(Category)
            }
            if (this.state.checked.includes("priority")) {
              TaskObj['priority'] = this.props.project.priority.required_input?Priority:t.maybe(Priority)
            }
            if (this.state.checked.includes("status")) {
              TaskObj['status'] = this.props.project.status.required_input?Status:t.maybe(Status)
            }
            if (this.state.checked.includes("due_date")) {
              TaskObj['due_date'] = this.props.project.due_date.required_input?t.Date:t.maybe(t.Date)
            }
            if (this.state.checked.includes("work_order")) {
              TaskObj['work_order'] = this.props.project.work_order.required_input?t.String:t.maybe(t.String)
            }
                            const Task=t.struct(TaskObj)
                    this.setState({task: Task,loading:false})
                })
                })
            });
         this.save = this.save.bind(this)
        //  this.init( this.map )
    }
sendHistory=()=>{
       
        var text = {"text": this.state.history, "task": {"pk": this.props.task.id}}
        var url = '/apps/cartoview_workforce_manager/api/v1/history/'

        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",

            }),
            body: JSON.stringify(text)
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }

            }).then(() => {

           
        })
       
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
        var date=new Date()
        var dt=date.toUTCString()
        if(this.state.value.status&&this.state.value.status!=this.refs.form.getValue().status){
           this.state['history']=this.state['history']+ username+"  changed the status from "+this.state.value.status +" to "+ this.refs.form.getValue().status +" at "+dt
           this.sendHistory()
       }
     if(this.state.value.priority&&this.state.value.priority!=this.refs.form.getValue().priority){
           this.state['history']= username+"  changed the priority from "+this.state.value.priority +" to "+ this.refs.form.getValue().priority +" at "+dt
           this.sendHistory()
       }
     if(this.state.value.Category&&this.state.value.Category!=this.refs.form.getValue().Category){
     this.state['history']= username+"  changed the Category from "+this.state.value.Category +" to "+ this.refs.form.getValue().Category +" at "+dt
     this.sendHistory()

     }
    if(this.state.value.due_date!=this.refs.form.getValue().due_date){
        console.log(this.state.value.due_date,this.refs.form.getValue().due_date)
        this.state['history']= username+"  changed the due date from "+this.state.value.due_date.toUTCString() +" to "+ this.refs.form.getValue().due_date.toUTCString() +" at "+dt
        this.sendHistory()

    }
    if(this.state.value.assigned_to!=this.refs.form.getValue().assigned_to){
        this.state['history']= username+"  reassigned the task to "+ this.state.tCombEnum[this.refs.form.getValue().assigned_to] +" at "+dt
        this.sendHistory()

    }
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
        // 
                this.setState({"success": true})
               
            })

        }
    }
   componentDidMount() {
    
    setTimeout(()=>{
         this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
         this.init( this.map )
      
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
                       <div className="row"> <button className="btn btn-default pull-right" style={{"margin":"2%"}} onClick={this.save}>Save Changes</button>
                      </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">Comments</div>
                            <div className="panel-body"><Comments task={this.props.task.id}/></div>
                        </div>
                        <div className="panel panel-default">
                    <div className="panel-heading">Images</div>
                    <div className="panel-body"><Attachments task={this.props.task.id}/></div>
                </div>
                         
                        
                      
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