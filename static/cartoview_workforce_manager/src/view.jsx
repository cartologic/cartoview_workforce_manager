import React from 'react';
import {render} from 'react-dom';
import {addLocaleData, IntlProvider} from 'react-intl';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import './app.css';
import AddTask from './components/addTask';
import ProjectDetails from './components/ProjectDetails';
import ProjectEdit from './components/projectEdit';
import MyTasks from './components/myTasks';
import {getCRSFToken} from './helpers/helpers.jsx'
import TaskDetails from './components/taskDetails.jsx'
import FilterTask from './components/filtertask.jsx';

import './css/project.css'
import ReactPaginate from 'react-paginate';
injectTapEventPlugin();
addLocaleData(enLocaleData);
export default class ReactClient extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            project: "",
            tasks: "",
            workers: "",
            dispatchers: "",
            tasks: [],
            selectedtask: null,
            priority:"",
            status:"",
            filter:[],
            result:false,
            selectedtask2:"",currentComponent:"list",
            pageCount:0,
            perPage:5,
            pagedTasks:[]
        }
            this.loadTasks()
            this.loadProject()
            this.loadWorkers()
            this.loadDispatchers()

    }



     sendFilter = () => {

var priority="",status="",work_order="",worker="",dispatcher=""
if(this.state.priority){
    console.log("in prioirt")
    priority= "priority="+this.state.priority+"&"
}
if(this.state.status){
    status= "status="+this.state.status+"&"
}
if(this.refs.work_order.value){
    work_order="work_order="+this.refs.work_order.value+"&"
}
if(this.refs.dispatcher.value){
    console.log(this.refs.dispatcher)
     console.log(this.refs.dispatcher.value)
    dispatcher="created_by__username="+this.refs.dispatcher.value+"&"
}
if(this.refs.worker.value){
   worker="assigned_to__username="+this.refs.worker.value+"&"
}

 var url = '/apps/cartoview_workforce_manager/api/v1/project/'+id+'/tasks/?'+priority+status+work_order+worker+dispatcher

        fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",

            }),

        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");

                }
                   return response.json();
            }).then((data) => {
                      this.setState({"filter":data.objects,"result":true})

        })


    }
    loadTasks=()=>{
         var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/tasks'
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

                this.setState({tasks: data.objects,loading:false,pageCount:Math.ceil(data.objects.length/this.state.perPage)},()=>{
                  var pagedTasks = this.state.tasks.slice(0,this.state.perPage);
                  this.setState({pagedTasks:pagedTasks})})

            });
    }
    loadProject = () => {

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id

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

                this.setState({project: data})
            });
    }


    loadWorkers = () => {

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

                this.setState({workers: data.objects})
            });
    }
     handlePageClick=(data)=>{
console.log(data.selected)

var pagedTasks = this.state.tasks.slice(data.selected*this.state.perPage, (data.selected+1)*this.state.perPage);
this.setState({pagedTasks:pagedTasks})



     }
    loadDispatchers = () => {

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/dispatchers"

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

                this.setState({dispatchers: data.objects})
            });
    }

    componentWillMount() {

    }

    getChildContext() {
        return {muiTheme: getMuiTheme(CustomTheme)};
    }

    componentDidMount() {

    }

    _toggleBaseMapModal() {

    }
    search = (e) => {
        e.preventDefault()

    }
   
    render() {
      let {currentComponent}=this.state
        return (
			<div className="container ">
				<br/>
				<span className="h4">{this.state.project.title}</span>
				<hr/>
				<ul className="nav nav-pills">
					<li className="active"><a data-toggle="tab" href="#home"  onClick={() => {
                                this.setState({"selectedtask": null})
                                this.loadTasks()
                            }}>Tasks</a></li>
                          <li  onClick={()=>this.setState({currentComponent:"add"})}><a data-toggle="tab" href="#menu1">New Task</a></li>
                    <li><a data-toggle="tab" href="#filter" onClick={() => {
                                this.setState({"selectedtask2": null,"result":false,"filter":[]})
                            }}>Filter Task </a></li>
					<li onClick={()=>this.setState({currentComponent:"details"})}><a data-toggle="tab" href="#menu2">Project Details </a></li>
					<li><a data-toggle="tab" href="#mytasks">My Tasks </a></li>
                  
                    
                    <li ><a  href={'/apps/appinstances/?app__title=Cartoview%20Workforce%20Manager&limit=100&offset=0&owner__username='+username}>My Projects </a></li>
                    



				</ul>
				<hr/>
				<div className="tab-content">
					<div id="home" className="tab-pane fade in active">

                          <div className="container">
                          {this.state.loading &&
                          <div>
                          <div className="col-md-4"></div>
                        <div className="col-md-4"><img src={URLS.static +'cartoview_workforce_manager/loader'}/>
                        </div>
                        <div className="col-md-4"></div>
                          </div>
                          }
                                            <br/>
                                            {this.state.tasks.length != 0 && !this.state.selectedtask && !this.state.loading&&
                                          <div>  <table className="table table-hover table-bordered table-responsive">
                                                <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th> Created By</th>
                                                    <th> Assigned To</th>
                                                    <th>Priority</th>
                                                    <th>Status</th>


                                                </tr>
                                                </thead>
                                                <tbody>

                                                {this.state.pagedTasks.map((item, i) => {

                                                        return <tr key={i} onClick={() => {
                                                            this.setState({"selectedtask": item})
                                                        }} style={{"cursor": "pointer"}}>
                                                            <td>{item.title}</td>
                                                            <td>{item.description.substring(0,75) } {item.description.length>75 ? "...":""}</td>
                                                            <td>{item.created_by.username}</td>
                                                            <td>{item.assigned_to.username}</td>
                                                            <td>{item.priority }
                                                            </td>
                                                            <td>{item.status}
                                                            </td>

                                                        </tr>
                                                    }
                                                )}


                                                </tbody>
                                              </table>
                                              {this.state.pageCount>1 &&<div className="commentBox">

                                                    <ReactPaginate previousLabel={"previous"}
                                                                   nextLabel={"next"}
                                                                   breakLabel={<a href="">...</a>}
                                                                   breakClassName={"break-me"}
                                                                   pageCount={this.state.pageCount}
                                                                   marginPagesDisplayed={2}
                                                                   pageRangeDisplayed={5}
                                                                   onPageChange={this.handlePageClick}
                                                                   containerClassName={"pagination"}
                                                                   subContainerClassName={"pages pagination"}
                                                                   activeClassName={"active"} />
                                                               </div>}
                                            </div>
                                          }

                                            {
                                                this.state.selectedtask &&
                                                <div>
                                                    <div className="col-md-1"></div>
                                                    <div className="col-md-10">


                                                        <TaskDetails task={this.state.selectedtask} mapid={this.state.project.mapid}/>
                                                    </div>
                                                    <div className="col-md-1"></div>
                                                </div>}

                                            {!this.state.tasks.length &&  !this.state.loading &&<div>
                                                <p>No tasks yet for this project</p>
                                            </div>

                                            }
                                        </div>
					</div>
					<div id="menu1" className="tab-pane fade">
						{this.state.project&&this.state.dispatchers&&    currentComponent === "add" &&<AddTask  project={this.state.project} mapid={this.state.project.mapid} dispatchers={this.state.dispatchers}/>}
					</div>
					<div id="menu2" className="tab-pane fade">
                        {this.state.workers && this.state.project && currentComponent === "details" &&
						<ProjectDetails id={id} project={this.state.project} mapid={this.state.project.mapid} workers={this.state.workers}/>}
					</div>
					<div id="menu3" className="tab-pane fade">
                        {this.state.workers && this.state.project &&
						<ProjectEdit project={this.state.project} workers={this.state.workers}/>}
					</div>


                        <div  id="mytasks" className="tab-pane fade">
                        <MyTasks id={id}/></div>

                        <div id="filter" className="tab-pane fade">
                                                <div>
                            <div className="col-md-2"></div>
                            <div className="col-md-8">
                               {this.state.dispatchers && this.state.workers&&



                                              <div>
		{ !this.state.filter.length&& !this.state.result&&
        <div className="panel panel-default" style={{"padding":"0"}}>
                <div className="panel-body" style={{"padding":"0"}}>
                    <div className="panel panel-primary">
                            <div className="panel-heading" >Priority</div>
                            <div className="panel-body">
                                    <label className="radio"><input type="radio" name="optradio" value="0" onChange={()=>{this.setState({"priority":0})}}/>Critical</label>
                                    <label className="radio"><input type="radio" name="optradio" value="1" onChange={()=>{this.setState({"priority":1})}}/>High</label>
                                    <label className="radio"><input type="radio" name="optradio" value="2" onChange={()=>{this.setState({"priority":2})}}/>Medium</label>
                                     <label className="radio"><input type="radio" name="optradio" value="3" onChange={()=>{this.setState({"priority":3})}}/>Low</label>
                                    <label className="radio"><input type="radio" name="optradio" value="4" onChange={()=>{this.setState({"priority":4})}}/>Very Low</label>

                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Status</div>
                            <div className="panel-body">


                                    <label className="radio"><input type="radio" name="optradio2" value="1" onChange={()=>{this.setState({"status":1})}}/>Open</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="2" onChange={()=>{this.setState({"status":2})}}/>Re-open</label>
                                     <label className="radio"><input type="radio" name="optradio2" value="3" onChange={()=>{this.setState({"status":3})}}/>Closed</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="4" onChange={()=>{this.setState({"status":4})}}/>Resolved</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="5" onChange={()=>{this.setState({"status":5})}}/>Duplicate</label>

                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Work Order</div>
                            <div className="panel-body"><input  className="form-control" ref="work_order" /></div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Task creator</div>
                            <div className="panel-body">
                                <div className="form-group">

                                    <select className="form-control" ref="dispatcher">
                                     <option  value=""></option>
                                         {this.state.dispatchers.map((dispatcher,i)=>{

                                        return <option key={i} value={dispatcher.dispatcher.username}>{dispatcher.dispatcher.username}</option>
                                    })}

                                    </select>
                                    </div>

                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Assignee</div>
                            <div className="panel-body">
                             <div className="form-group">

                                <select className="form-control" id="sel1" ref="worker">
                                 <option  value=""></option>
                                    {this.state.workers.map((worker,i)=>{

                                        return <option key={i} value={worker.worker.username}>{worker.worker.username}</option>
                                    })}

                                </select>
                                </div>

                            </div>
                    </div>

                      <button className="btn btn-primary pull-right" style={{"margin":"2%"}} onClick={this.sendFilter} >Filter</button>


                </div>
            </div>}
{this.state.result&&this.state.filter.length==0 &&<p>No result found</p>}
{this.state.result&&this.state.filter.length>0 &&!this.state.selectedtask2&&







 <table className="table table-hover table-bordered table-responsive">
                                                <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th> Created By</th>
                                                    <th> Assigned To</th>
                                                    <th>Priority</th>
                                                    <th>Status</th>


                                                </tr>
                                                </thead>
                                                <tbody>

                                                {this.state.filter.map((item, i) => {

                                                        return <tr key={i} onClick={() => {
                                                            this.setState({"selectedtask2": item})
                                                        }} style={{"cursor": "pointer"}}>
                                                            <td>{item.title}</td>
                                                            <td>{item.description}</td>
                                                            <td>{item.created_by.username}</td>
                                                            <td>{item.assigned_to.username}</td>
                                                            <td>{item.priority}

                                                            </td>
                                                            <td>{item.status }
                                                               
                                                            </td>

                                                        </tr>
                                                    }
                                                )}


                                                </tbody>
                                            </table>





}
  {
                                                this.state.selectedtask2 &&
                                                <div>


                                                        <TaskDetails task={this.state.selectedtask2} mapid={this.state.project.mapid}/>


                                                </div>}


            </div>




                               }
                            <div className="col-md-2"></div>
                            </div>
					</div>



					</div>
				</div>
			</div>
        )
    }
}
ReactClient.childContextTypes = {
    muiTheme: React.PropTypes.object
};
render(
	<IntlProvider locale='en' messages={enMessages}>
		<ReactClient></ReactClient>
	</IntlProvider>, document.getElementById('root'))
