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
import Tasks from './components/tasks';
import {getCRSFToken} from './helpers/helpers.jsx'
import TaskDetails from './components/taskDetails.jsx'
import FilterTask from './components/filtertask.jsx';
import './css/project.css'

injectTapEventPlugin();
addLocaleData(enLocaleData);
export default class ReactClient extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
            selectedtask2:""
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
    work_order="created_by__username="+this.refs.dispatcher.value+"&"
}
if(this.refs.worker.value){
    work_order="assigned_to__username="+this.refs.worker.value+"&"
}

 var url = '/apps/cartoview_workforce_manager/api/v1/project/'+id+'/tasks/?'+priority+status+work_order

        fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                 'Authorization': `Basic ${hash}`
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
                'Authorization': `Basic ${hash}`
            })
        })
            .then(function (response) {

                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {

                this.setState({tasks: data.objects})
            });
    }
    loadProject = () => {

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id

        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),
                 'Authorization': `Basic ${hash}`
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
                 'Authorization': `Basic ${hash}`
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

    loadDispatchers = () => {

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/dispatchers"

        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),
                 'Authorization': `Basic ${hash}`
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

        return (
			<div className="container ">
				<br/>
				<span className="h4">{this.state.project.title}</span>
				<hr/>
				<ul className="nav nav-pills">
					<li className="active"><a data-toggle="tab" href="#home"  onClick={() => {
                                this.setState({"selectedtask": null})
                            }}>Tasks</a></li>
					<li><a data-toggle="tab" href="#menu1">New Task</a></li>
                    <li><a data-toggle="tab" href="#filter" onClick={() => {
                                this.setState({"selectedtask2": null,"result":false,"filter":[]})
                            }}>Filter Task </a></li>
					<li><a data-toggle="tab" href="#menu2">Ptoject Details </a></li>


					<div className="container">
						<div className="row">
							<div className="span12">
								<form id="custom-search-form" className="form-search form-horizontal pull-right">
									<div className="input-append span12">
										<input type="text" ref="search" className="search-query" placeholder="Search"/>
										<button className="btn" onClick={this.search}><i
											className="glyphicon glyphicon-search"></i></button>
									</div>
								</form>
							</div>
						</div>
					</div>


				</ul>
				<hr/>
				<div className="tab-content">
					<div id="home" className="tab-pane fade in active">			
                                               
                          <div className="container">
                                            <br/>
                                            {this.state.tasks.length != 0 && !this.state.selectedtask &&
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

                                                {this.state.tasks.map((item, i) => {

                                                        return <tr key={i} onClick={() => {
                                                            this.setState({"selectedtask": item})
                                                        }} style={{"cursor": "pointer"}}>
                                                            <td>{item.title}</td>
                                                            <td>{item.short_description}</td>
                                                            <td>{item.created_by.username}</td>
                                                            <td>{item.assigned_to.username}</td>
                                                            <td>{item.priority == 1 && <span>High</span>}
                                                                {item.priority == 0 && <span>Critical</span>}
                                                                {item.priority == 2 && <span>Medium</span>}
                                                                {item.priority == 3 && <span>Low</span>}
                                                                {item.priority == 4 && <span>Very Low</span>}

                                                            </td>
                                                            <td>{item.status == 1 && <span>Open</span>}
                                                                {item.status == 2 && <span>Reopened</span>}
                                                                {item.status == 3 && <span>Closed</span>}
                                                                {item.status == 4 && <span>Duplicate</span>}
                                                                {item.status == 5 && <span>Resolved</span>}
                                                            </td>

                                                        </tr>
                                                    }
                                                )}


                                                </tbody>
                                            </table>}

                                            {
                                                this.state.selectedtask &&
                                                <div>
                                                    <div className="col-md-1"></div>
                                                    <div className="col-md-10">
                                                

                                                        <TaskDetails task={this.state.selectedtask}/>
                                                    </div>
                                                    <div className="col-md-1"></div>
                                                </div>}

                                            {!this.state.tasks.length && <div>
                                                <p>No tasks yet for this project</p>
                                            </div>

                                            }
                                        </div>
					</div>
					<div id="menu1" className="tab-pane fade">
						<AddTask/>
					</div>
					<div id="menu2" className="tab-pane fade">
                        {this.state.workers && this.state.project &&
						<ProjectDetails id={id} project={this.state.project} workers={this.state.workers}/>}
					</div>
					<div id="menu3" className="tab-pane fade">
                        {this.state.workers && this.state.project &&
						<ProjectEdit project={this.state.project} workers={this.state.workers}/>}
					</div>
                  
                       

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
                            <div className="panel-heading" >Filter By Priority</div>
                            <div className="panel-body">
                                    <label className="radio"><input type="radio" name="optradio" value="0" onChange={()=>{this.setState({"priority":0})}}/>Critical</label>
                                    <label className="radio"><input type="radio" name="optradio" value="1" onChange={()=>{this.setState({"priority":1})}}/>High</label>
                                    <label className="radio"><input type="radio" name="optradio" value="2" onChange={()=>{this.setState({"priority":2})}}/>Medium</label>
                                     <label className="radio"><input type="radio" name="optradio" value="3" onChange={()=>{this.setState({"priority":3})}}/>Low</label>
                                    <label className="radio"><input type="radio" name="optradio" value="4" onChange={()=>{this.setState({"priority":4})}}/>Very Low</label>
                            
                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Filter By Status</div>
                            <div className="panel-body">
                            
                               
                                    <label className="radio"><input type="radio" name="optradio2" value="1" onChange={()=>{this.setState({"status":1})}}/>Open</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="2" onChange={()=>{this.setState({"status":2})}}/>Re-open</label>
                                     <label className="radio"><input type="radio" name="optradio2" value="3" onChange={()=>{this.setState({"status":3})}}/>Closed</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="4" onChange={()=>{this.setState({"status":4})}}/>Resolved</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="5" onChange={()=>{this.setState({"status":5})}}/>Duplicate</label>
                        
                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Filter By Work Order</div>
                            <div className="panel-body"><input type="number" className="form-control" ref="work_order" /></div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Filter By Task creator</div>
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
                            <div className="panel-heading">Filter By Assignee</div>
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
                                                            <td>{item.short_description}</td>
                                                            <td>{item.created_by.username}</td>
                                                            <td>{item.assigned_to.username}</td>
                                                            <td>{item.priority == 1 && <span>High</span>}
                                                                {item.priority == 0 && <span>Critical</span>}
                                                                {item.priority == 2 && <span>Medium</span>}
                                                                {item.priority == 3 && <span>Low</span>}
                                                                {item.priority == 4 && <span>Very Low</span>}

                                                            </td>
                                                            <td>{item.status == 1 && <span>Open</span>}
                                                                {item.status == 2 && <span>Reopened</span>}
                                                                {item.status == 3 && <span>Closed</span>}
                                                                {item.status == 4 && <span>Duplicate</span>}
                                                                {item.status == 5 && <span>Resolved</span>}
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
                                                    

                                                        <TaskDetails task={this.state.selectedtask2}/>
                                                   
                                                  
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
