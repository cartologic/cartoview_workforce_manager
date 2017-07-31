import React, { Component } from 'react';
import t from 'tcomb-form';

const mapConfig = t.struct({
	showZoomControls: t.Boolean,
	showNorth: t.Boolean,
	showMousePostion: t.Boolean,
	showLayerSwitcher: t.Boolean,
	showHome: t.Boolean,
	showGeoLocation: t.Boolean,
	show3D: t.Boolean,
	showBasemapSwitcher: t.Boolean,
	showLegend: t.Boolean
});

const options = {
	fields: {
		showGeoLocation: {
			label: "Geo Location"
		},
		show3D: {
			label: "3D"
		},
		showZoomControls: {
			label: "Zoom Buttons"
		},
		showNorth: {
			label: "North Button"
		},
		showMousePostion: {
			label: "Mouse Location"
		},
		showLayerSwitcher: {
			label: "Layer Switcher Button"
		},
		showHome: {
			label: "Initial Extent Button"
		},
		showBasemapSwitcher: {
			label: "Base Switcher Button"
		},
		showLegend: {
			label: "Layer Legend"
		}
	}
};

const Form = t.form.Form;

export default class BasicConfig extends Component {
	constructor( props ) {
		super( props )
		this.state = {
			defaultConfig: {
				showZoomControls: this.props.config
					? this.props.config.showZoomControls
					: true,
				showNorth: this.props.config
					? this.props.config.showNorth
					: true,
				showMousePostion: this.props.config
					? this.props.config.showMousePostion
					: true,
				showHome: this.props.config
					? this.props.config.showHome
					: true,
				showGeoLocation: this.props.config
					? this.props.config.showGeoLocation
					: true,
				show3D: this.props.config
					? this.props.config.show3D
					: true,
				showGeoCoding: this.props.config
					? this.props.config.showGeoCoding
					: true,
				showLayerSwitcher: this.props.config
					? this.props.config.showLayerSwitcher
					: true,
				showBasemapSwitcher: this.props.config
					? this.props.config.showBasemapSwitcher
					: true,
				showLegend: this.props.config
					? this.props.config.showLegend
					: true
			}
		}
	}

	save( ) {
		var basicConfig = this.refs.form.getValue( );
		if ( basicConfig ) {
			const properConfig = {
				config: {
					showZoomControls: basicConfig.showZoomControls,
					showNorth: basicConfig.showNorth,
					showMousePostion: basicConfig.showMousePostion,
					showLayerSwitcher: basicConfig.showLayerSwitcher,
					showHome: basicConfig.showHome,
					showGeoLocation: basicConfig.showGeoLocation,
					show3D: basicConfig.show3D,
					showBasemapSwitcher: basicConfig.showBasemapSwitcher,
					showLegend: basicConfig.showLegend
				}
			}
			this.props.onComplete( properConfig )
		}
	}

	render( ) {
		return (
			<div className="row">
				<div className="row">
					<div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
						<h4>{'Navigation Tools'}</h4>
					</div>

					<div className="col-xs-6 col-md-4">
						<div className="btn-group" style={{
							float: "right"
						}}>
							<button
								type='button'
								className="btn btn-sm btn-primary"
								onClick={( ) => this.props.onPrevious( )}>
								<i className="fa fa-arrow-left"></i>
								Previous</button>

							<button
								type='button'
								className="btn btn-sm btn-primary"
								onClick={this.save.bind( this )}>Next
								<i className="fa fa-arrow-right"></i>
							</button>
						</div>
					</div>
				</div>
				<hr></hr>

				<Form
					ref="form"
					value={this.state.defaultConfig}
					type={mapConfig}
					options={options}/>
			</div>
