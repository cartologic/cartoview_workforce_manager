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
injectTapEventPlugin( );
addLocaleData( enLocaleData );
export default class ReactClient extends React.Component {
	constructor( props ) {
		super( props )
		this.state = {
		
		}
	
	console.log("props",id)
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
     <AddTask/>
    </div>
    <div id="menu2" className="tab-pane fade">
      <ProjectDetails id={id}/>
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
