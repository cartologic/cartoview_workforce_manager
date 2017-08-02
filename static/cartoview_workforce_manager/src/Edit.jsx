import React, { Component } from 'react'
import './css/app.css'
import Navigator from './components/Navigator.jsx'
import ResourceSelector from './components/ResourceSelector.jsx'
import General from './components/General.jsx'
import NavigationTools from './components/NavigationTools.jsx'
import ListOptions from './components/ListOptions.jsx'
import EditService from './services/editService.jsx'
export default class Edit extends Component {
	constructor( props ) {
		super( props )
		this.state = {
			step: 0,
			config: {},
			selectedResource: this.props.config.instance
				? this.props.config.instance.map
				: undefined
		}
		this.editService = new EditService({ baseUrl: '/' })
		console.log( this.props.config );
	}
	goToStep( step ) {
		this.setState({ step });
	}
	onPrevious( ) {
		let { step } = this.state;
		this.goToStep( step -= 1 )
	}
	render( ) {
		var { step } = this.state
		const steps = [
		 {
				label: "General ",
				component: General,
				props: {
					state: this.state,
					keywords: this.props.keywords,
					urls: this.props.config.urls,
					instance: this.state.selectedResource,
					config: this.props.config.instance
						? this.props.config.instance.config
						: undefined,
						onComplete: ( basicConfig ) => {
						var { step, config } = this.state;
						// let newConfig = Object.assign( config.config, basicConfig )
						// this.setState({
						// 	config: Object.assign( this.state.config, newConfig )
						// }, ( ) => {
							console.log("state con", 69 )
							this.editService.save(basicConfig, 69 ).then(( res ) => {
								if ( res.success === true ) {
									this.setState({ success: true, id: res.id })
								}
							})
						// })
					},
					onPrevious: ( ) => {
						this.onPrevious( )
					}
				}
			}
				
		]
		return (
			<div className="wrapping">
				<Navigator
					steps={steps}
					step={step}
					onStepSelected={( step ) => this.goToStep( step )}/>
				<div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel">
					{steps.map( ( s, index ) => index == step && <s.component key={index} {...s.props}/> )}
				</div>
			</div>
		)
	}
}
