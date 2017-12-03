import React from 'react';
import { render, findDOMNode } from 'react-dom';
import Edit from './Edit.jsx';
class Viewer {
	constructor( domId, config, username ) {
		this.domId = domId;
		this.appConfig = config;
		this.username = username;
	}
	set config( value ) {
		this.appConfig = config;
	}
	view( ) {
		render(
			<Edit config={this.appConfig} username={this.username}/>, document.getElementById( this.domId ));
	}
}
module.exports = Viewer;
global.Viewer = Viewer;
