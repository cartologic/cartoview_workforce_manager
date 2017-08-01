import React, { Component } from 'react';
import t from 'tcomb-form';
const mapConfig = t.struct({ showZoombar: t.Boolean, showLayerSwitcher: t.Boolean, showBaseMapSwitcher: t.Boolean, showLegend: t.Boolean });

const options = {
	fields: {
		showZoombar: {
			label: "Zoom Bar"
		},
		showLayerSwitcher: {
			label: "Layer Switcher"
		},
		showBaseMapSwitcher: {
			showBaseMapSwitcher: "Base Map Switcher"
		},
		showLegend: {
			label: "Legend"
		}
	}
};

const Form = t.form.Form;

export default class NavigationTools extends Component {

	constructor( props ) {
		super( props )
		console.log( this.props.config );
		this.state = {
			defaultConfig: {
				showZoombar: this.props.config
					? this.props.config.showZoombar
					: true,
				showLayerSwitcher: this.props.config
					? this.props.config.showLayerSwitcher
					: true,
				showBaseMapSwitcher: this.props.config
					? this.props.config.showBaseMapSwitcher
					: true,
				showLegend: this.props.config
					? this.props.config.showLegend
					: true
			}
		}
	}

	componentWillReceiveProps( nextProps ) {
		// console.log(nextProps); if (nextProps.config !== this.state.defaultConfig) {
		this.setState({ defaultConfig: nextProps.config, success: nextProps.success });
		// }
	}

	save( ) {
		var basicConfig = this.refs.form.getValue( );
		if ( basicConfig ) {
			const properConfig = {

				showZoombar: basicConfig.showZoombar,
				showLayerSwitcher: basicConfig.showLayerSwitcher,
				showBaseMapSwitcher: basicConfig.showBaseMapSwitcher,
				showLegend: basicConfig.showLegend

			}
			this.props.onComplete( properConfig )
		}
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
						<h4>{'NavigationTools '}</h4>
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
