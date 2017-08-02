import React, { Component } from 'react';
import t from 'tcomb-form';

import KeywordsInput from './KeywordsInput.jsx'

const Access = t.enums({
	public: 'Public', private: 'Private (only me)',
	// others: 'Other Users'
});
 const mapConfig = t.struct({ title: t.String, abstract: t.String, access: Access });
const options = {
	fields: {
		title: {
			label: "App Title"
		},
		access: {
			factory: t.form.Radio
		}
	}
};
const Form = t.form.Form;

export default class General extends Component {
	constructor( props ) {
		super( props )
		this.state = {
			defaultConfig: {
			title: "No Title Provided",
			abstract: "No Abstract Provided",
				
			}
		}
	}
componentWillReceiveProps( nextProps ) {
		// console.log(nextProps); if (nextProps.config !== this.state.defaultConfig) {
		this.setState({  success: nextProps.success });
		// }
	}
	save( ) {
		var basicConfig = this.refs.form.getValue( );
		if ( basicConfig ) {
			let properConfig = {
				title: basicConfig.title,
				abstract: basicConfig.abstract,
				access: basicConfig.access,
				
			}
			this.props.onComplete( properConfig )
		}
	}

	Keywords = [ ]
	updateKeywords( keywords ) {
		this.keywords = keywords.map(( keyword ) => {
			return keyword.name
		})
	}

	render( ) {
		return (
				<div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4"></div>
					<div className="col-xs-7 col-md-8">
						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right disabled"
							onClick={this.save.bind( this )}>{"next "}
							<i className="fa fa-arrow-right"></i>
						</button>

						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right"
							onClick={( ) => this.props.onPrevious( )}>
							<i className="fa fa-arrow-left"></i>{" Previous"}</button>
					</div>
				</div>
				<div className="row" style={{
					marginTop: "3%"
				}}>
					<div className="col-xs-5 col-md-4">
					
					</div>
					<div className="col-xs-7 col-md-8">
						<a
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className={this.state.success === true
							? "btn btn-primary btn-sm pull-right"
							: "btn btn-primary btn-sm pull-right disabled"}
							href={`/apps/cartoview_workforce_manager/${ this.props.id }/view/`}>
							View
						</a>

						<a
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className={this.state.success === true
							? "btn btn-primary btn-sm pull-right"
							: "btn btn-primary btn-sm pull-right disabled"}
							href={`/apps/appinstance/${ this.props.id }/`}
							target={"_blank"}>
							Details
						</a>

						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className={this.state.success === true
							? "btn btn-primary btn-sm pull-right disabled"
							: "btn btn-primary btn-sm pull-right"}
							onClick={this.save.bind( this )}>Save</button>

						<p
							style={this.state.success == true
							? {
								display: "inline-block",
								margin: "0px 3px 0px 3px",
								float: "right"
							}
							: {
								display: "none",
								margin: "0px 3px 0px 3px",
								float: "right"
							}}>App instance successfully created!</p>
					</div>
				</div>
				<hr></hr>

				<Form
					ref="form"
					value={this.state.defaultConfig}
					type={mapConfig}
					options={options}/>
			</div>
		)
	}
}
