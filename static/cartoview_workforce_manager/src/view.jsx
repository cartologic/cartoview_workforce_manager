import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import './app.css';
injectTapEventPlugin( );
addLocaleData( enLocaleData );
export default class ReactClient extends React.Component {
	constructor( props ) {
		super( props )
		this.state = {
		
		}
	
	
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
	<p>helllo to your project</p>
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
