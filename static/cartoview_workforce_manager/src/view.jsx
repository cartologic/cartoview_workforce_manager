import React from 'react';
import { render } from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import './app.css';
import AddTask from './components/addTask';
import ProjectDetails from './components/ProjectDetails';
import MyTasks from './components/myTasks';
import { getCRSFToken } from './helpers/helpers.jsx'
import TaskDetails from './components/taskDetails.jsx'
import './css/project.css'
import ReactPaginate from 'react-paginate';
injectTapEventPlugin();
addLocaleData(enLocaleData);
export default class ReactClient extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            project: {Project_config:[]},
            tasks: "",
            workers: "",
            dispatchers: "",
            tasks: [],
            selectedtask: null,
            priority: "",
            status: "",
            filter: [],
            result: false,
            selectedtask2: "", currentComponent: "list",
            pageCount: 0,
            perPage: 10,
            pagedTasks: [],
            category:"",
            selected:null,
            filtertask:null,
            flag:false,

        }
        this.loadTasks()
        this.loadProject()
        this.loadWorkers()
        this.loadDispatchers()

    }



    sendFilter = () => {

var priority = "", status = "", work_order = "", worker = "", dispatcher = "",category=""
        if (this.refs.priority.value) {
            
            priority = "priority=" + this.refs.priority.value+ "&"
        }
         if (this.refs.category.value) {
           
            category = "Category=" + this.refs.category.value+ "&"
        }
        if (this.refs.status.value) {
            status = "status=" + this.refs.status.value+ "&"
        }
        if (this.refs.work_order.value) {
            work_order = "work_order=" + this.refs.work_order.value + "&"
        }
        if (this.refs.dispatcher.value) {
            dispatcher = "created_by__username=" + this.refs.dispatcher.value + "&"
        }
        if (this.refs.worker.value) {
            worker = "assigned_to__username=" + this.refs.worker.value + "&"
        }

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/tasks/?' + priority + status + work_order + worker + dispatcher+category
      
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
                                 if(data.objects.length==0){ 
                                    console.log("empty")
                                    this.setState({result: true})}
                                 else{
                                     this.setState({result: false})
                                     }
                                 this.setState({ tasks: data.objects,filtertask:data.objects, loading: false, pageCount: Math.ceil(data.objects.length / this.state.perPage) }, () => {
                                 var pagedTasks = this.state.tasks.slice(0, this.state.perPage);
                                 this.setState({ pagedTasks: pagedTasks })

                console.log(data.objects.length)
               
              
              

            })
})
    }   
    
    loadTasks = () => {
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

                this.setState({ tasks: data.objects,filtertask:data.objects, loading: false, pageCount: Math.ceil(data.objects.length / this.state.perPage) }, () => {
                    var pagedTasks = this.state.tasks.slice(0, this.state.perPage);
                    this.setState({ pagedTasks: pagedTasks })
                })

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

                this.setState({ project: data })
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

                this.setState({ workers: data.objects })
            });
    }
    handlePageClick = (data) => {
        var pagedTasks = this.state.tasks.slice(data.selected * this.state.perPage, (data.selected + 1) * this.state.perPage);
        this.setState({ pagedTasks: pagedTasks })



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

                this.setState({ dispatchers: data.objects })
            });
    }

    componentWillMount() {

    }

    getChildContext() {
        return { muiTheme: getMuiTheme(CustomTheme) };
    }

    componentDidMount() {

    }

    _toggleBaseMapModal() {

    }
    search = (e) => {
        e.preventDefault()

    }

    render() {
        let { currentComponent } = this.state
        // this.state.project['Project_config']=[]
        return (
            <div className="container " >
           
                <br/>

                <div className="media">
                <div className="media-left">
                <img src={this.state.project.logo?this.state.project.logo.base64: URLS.static+'nologo.png'} className="media-object img-rounded" style={{"width":"100px"}}/>
                </div>
                <div className="media-body">
                    <h4 className="media-heading">{this.state.project.title}</h4>
                    <p>{this.state.project.abstract}</p>
                </div>
                </div>
                <hr/>

                <ul className="nav nav-pills">
                    <li className="active"><a data-toggle="tab" href="#home" onClick={() => {
                        this.setState({ "selectedtask": null,result:false })
                        this.loadTasks()
                    }}>Tasks </a></li>
                    <li onClick={() => this.setState({ currentComponent: "add" })}><a data-toggle="tab" href="#menu1">New Task</a></li>
                   
                    <li onClick={() => this.setState({ currentComponent: "details" })}><a data-toggle="tab" href="#menu2">Project Details </a></li>
                   


                    <li ><a href={'/apps/appinstances/?app__title=Cartoview%20Workforce%20Manager&limit=100&offset=0&owner__username=' + username}>My Projects </a></li>
                </ul>
                <hr />
                <div className="tab-content">
                    
                    
                    <div id="home" className="tab-pane fade in active">
                        <ul className="nav nav-tabs">
                                <li className="active" onClick={() => {
                        this.setState({ "selectedtask": null,result:false })
                        this.loadTasks()
                    }}><a data-toggle="tab" href="#all">All Tasks</a></li>
                                <li onClick={() => {
                        this.setState({ "selected": null })
                        
                    }}><a data-toggle="tab" href="#mine">My Tasks</a></li> 
                            </ul>
                    <div className="tab-content">
                        <div id="all" className="tab-pane fade in active">
                        <div className="container">
                            {this.state.loading &&
                                <div>
                                    <div className="col-md-4"></div>
                                    <div className="col-md-4"><img src={URLS.static + 'cartoview_workforce_manager/loader'} />
                                    </div>
                                    <div className="col-md-4"></div>
                                </div>
                            }
                            <br />

                            {this.state.pagedTasks.length != 0 && !this.state.selectedtask && !this.state.loading &&
                                <div className="container">
                                <div className="col-md-8">  
                                
                                <table className="table table-hover table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Title</th>

                                          
                                            {this.state.project.Project_config.includes("assigned_to") &&<th> Assigned To</th>}
                                            {this.state.project.Project_config.includes("priority") && <th>Priority</th>}
                                            {this.state.project.Project_config.includes("status")&& <th>Status</th>}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.state.pagedTasks.map((item, i) => {

                                            return <tr key={i} onClick={() => {
                                                this.setState({ "selectedtask": item })
                                            }} style={{ "cursor": "pointer" }}>
                                                <td>{item.title}</td>

                                                 {this.state.project.Project_config.includes("assigned_to") &&<td>{item.assigned_to.username}</td>}
                                                 {this.state.project.Project_config.includes("priority") && <td>{item.priority}
                                                </td>}
                                                {this.state.project.Project_config.includes("status") &&<td>{item.status}
                                                </td>}

                                            </tr>
                                        }
                                        )}


                                    </tbody>
                                </table>
                                    {this.state.pageCount > 1 && <div className="commentBox">

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
                                        <div className="col-md-4">
                                        
                                       
                                       
                                                
                                        
                                        
                                        
                                        
                                        
                                          {this.state.pagedTasks&&
                                            <div className="panel panel-default" style={{ "padding": "0" }}>
                                                <div className="panel-body" style={{ "padding": "0" }}>
                                                    {this.state.project.Project_config.includes("priority")  && <div className="panel panel-default">
                                                        <div className="panel-heading" >Filter By Priority</div>
                                                        <div className="panel-body">
                                                        <select className="form-control" ref="priority">
                                                             <option value=""></option>
                                                            { this.state.project.priority.priority.map((pri, i) => {

                                                                return <option key={i} value={pri.label}>{pri.label}</option>
                                                            })


                                                            }
                                                            </select>
                                                        </div>
                                                    </div>}
                                                 
                                                {    this.state.project.Project_config.includes("status")  && <div className="panel panel-default">
                                                        <div className="panel-heading">Filter By Status</div>
                                                        <div className="panel-body">

                                                         <select className="form-control" ref="status">
                                                             <option value=""></option>
                                                                {this.state.project.status && this.state.project.status.status.map((status, i) => {
                                                    

                                                                return <option key={i} value={status.label}>{status.label}</option>
                                                                })
                                                                        
                                                            }
                                                             </select>
                                                        </div>
                                                    </div>}
                                                    {    this.state.project.Project_config.includes("Category")  && <div className="panel panel-default">
                                                        <div className="panel-heading">Filter By Category</div>
                                                        <div className="panel-body">

                                                          <select className="form-control" ref="category">
                                                             <option value=""></option>
                                                            {this.state.project.Category && this.state.project.Category.Category.map((cat, i) => {
                                                                return <option key={i} value={cat.label}>{cat.label}</option>
                                                            })


                                                            }
                                                            </select>
                                                        </div>
                                                    </div>}
                                                     {this.state.project.Project_config.includes("work_order") &&<div className="panel panel-default">
                                                        <div className="panel-heading">Filter By Work Order</div>
                                                        <div className="panel-body"><input className="form-control" ref="work_order" /></div>
                                                    </div>}
                                                    <div className="panel panel-default">
                                                        <div className="panel-heading">Filter By  Task creator</div>
                                                        <div className="panel-body">
                                                            <div className="form-group">

                                                                <select className="form-control" ref="dispatcher">
                                                                    <option value=""></option>
                                                                    {this.state.dispatchers.map((dispatcher, i) => {

                                                                        return <option key={i} value={dispatcher.dispatcher.username}>{dispatcher.dispatcher.username}</option>
                                                                    })}

                                                                </select>
                                                            </div>

                                                        </div>
                                                    </div>
                                                     {this.state.project.Project_config.includes("assigned_to") &&
                                                    <div className="panel panel-default">
                                                        <div className="panel-heading"> Filter By Assignee</div>
                                                        <div className="panel-body">
                                                            <div className="form-group">

                                                                <select className="form-control" id="sel1" ref="worker">
                                                                    <option value=""></option>
                                                                    {this.state.workers.map((worker, i) => {

                                                                        return <option key={i} value={worker.worker.username}>{worker.worker.username}</option>
                                                                    })}

                                                                </select>
                                                            </div>

                                                        </div>
                                                    </div>}

                                                    <button className="btn btn-default pull-right" style={{ "margin": "2%" }} onClick={this.sendFilter} >Filter</button>

  
                                                </div>
                                            </div>}
                                            
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        </div>
                              
                            
                                </div>
                            }
                            {console.log("cc",this.state.result)}
 {this.state.pagedTasks.length == 0 &&this.state.result&& <p>No result found</p>}


                            {
                                this.state.selectedtask &&
                                <div>
                                    


                                        <TaskDetails task={this.state.selectedtask} mapid={this.state.project.mapid} project={this.state.project} />
                                    
                                </div>}

                            {!this.state.tasks.length && !this.state.loading && <div>
                                <p>No tasks yet for this project</p>
                            </div>

                            }
                        </div>
                    </div>


 <div id="mine" className="tab-pane fade">
         <MyTasks id={id} project={this.state.project} selected={this.state.selected} />
       </div>
    </div>


</div>















                    <div id="menu1" className="tab-pane fade">
                        {this.state.project && this.state.dispatchers && currentComponent === "add" && <AddTask project={this.state.project} mapid={this.state.project.mapid} dispatchers={this.state.dispatchers} />}
                    </div>
                    <div id="menu2" className="tab-pane fade">
                        {this.state.workers && this.state.project && currentComponent === "details" &&
                            <ProjectDetails id={id} project={this.state.project} mapid={this.state.project.mapid} workers={this.state.workers} />}
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
