import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import './app.css';
import AddTask from './components/addTask';
import TaskDetails from './components/taskDetails';
import ProjectDetails from './components/ProjectDetails';
import ProjectEdit from './components/projectEdit';
import Tasks from './components/tasks';
import { getCRSFToken} from './helpers/helpers.jsx'
injectTapEventPlugin( );
addLocaleData( enLocaleData );
export default class ReactClient extends React.Component {
	constructor( props ) {
		super( props )
		this.state = {
			project: "",
      tasks:"",
			workers:"",
			dispatchers:""
		}
    this.loadProject()
    this.loadWorkers()
	console.log("props",id)
	}


	loadProject=()=>{

		var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id
		console.log(url)
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
						console.log(data)
						this.setState({project: data})
				});
}




loadWorkers=()=>{

	var url = '/apps/cartoview_workforce_manager/api/v1/project/'+id+"/workers"
	console.log(url)
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
					console.log(data.objects)
					this.setState({workers: data.objects})
			});
}



	componentWillMount( ) {

	}
	getChildContext( ) {
		return {muiTheme: getMuiTheme( CustomTheme )};
	}
	componentDidMount( ) {

	}
	_toggleBaseMapModal( ) {

	}
	render( ) {

		return (
			<div className="container ">
<br/>
				<span className="h4">{this.state.project.title}</span>
				<hr/>
  <ul className="nav nav-pills">
    <li className="active"><a data-toggle="tab" href="#home">Tasks</a></li>
    <li><a data-toggle="tab" href="#menu1">New Task</a></li>
    <li><a data-toggle="tab" href="#menu2">Ptoject Details </a></li>
    <li><a data-toggle="tab" href="#menu3">Edit Project</a></li>
  </ul>
				<hr/>
	  <div className="tab-content">
    <div id="home" className="tab-pane fade in active">
      <Tasks id={id} />
	    </div>
    <div id="menu1" className="tab-pane fade">
     <AddTask />
    </div>
    <div id="menu2" className="tab-pane fade">
      {this.state.workers && this.state.project && <ProjectDetails id={id} project={this.state.project} workers={this.state.workers}/>}
		</div>
    <div id="menu3" className="tab-pane fade">
      <ProjectEdit />
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
</IntlProvider>, document.getElementById( 'root' ))
