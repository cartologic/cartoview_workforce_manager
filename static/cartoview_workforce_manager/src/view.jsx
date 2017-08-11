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
        }
        this.loadTasks()
        this.loadProject()
        this.loadWorkers()

    }

    loadTasks=()=>{
         var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/tasks'
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),
                "Authorization": "Basic YWRtaW46YWRtaW4="
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
                "Authorization": "Basic YWRtaW46YWRtaW4="
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
                "Authorization": "Basic YWRtaW46YWRtaW4="
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
