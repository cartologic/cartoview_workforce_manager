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
				label: "Select Map",
				component: ResourceSelector,
				props: {
					resourcesUrl: this.props.config.urls.resources_url,
					instance: this.state.selectedResource,
					username: this.props.username,
					selectMap: ( resource ) => {
						this.setState({ selectedResource: resource })
					},
					limit: this.props.config.limit,
					onComplete: ( ) => {
						var { step } = this.state;
						this.setState({
							config: Object.assign(this.state.config, { map: this.state.selectedResource.id })
						})
						this.goToStep( ++step )
					}
				}
			},{
				label: "Select Layer",
				component: ListOptions,
				urls: this.props.config.urls,
				props: {
					map: this.state.selectedResource,
					config: this.props.config.instance
						? this.props.config.instance.config
						: this.state.config.config,
					urls: this.props.config.urls,
					onComplete: ( config ) => {
						console.log( this.state.config );
						this.setState({
							config: Object.assign( this.state.config, config )
						}, this.goToStep( ++step ))
					},
					onPrevious: ( ) => {
						this.onPrevious( )
					}
				}
			}, {
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
						let { step } = this.state;
						this.setState({
							config: Object.assign( this.state.config, basicConfig )
						})
						this.goToStep( ++step )
					},
					onPrevious: ( ) => {
						this.onPrevious( )
					}
				}
			},  {
				label: "Navigation Tools",
				component: NavigationTools,
				urls: this.props.config.urls,
				props: {
					instance: this.state.selectedResource,
					// config: this.state.config.config,
					config: this.props.config.instance
						? this.props.config.instance.config
						: undefined,
					id: this.props.config.instance
						? this.props.config.instance.id
						: this.state.id
							? this.state.id
							: undefined,
					urls: this.props.config.urls,
					success: this.state.success,
					onComplete: ( basicConfig ) => {
						var { step, config } = this.state;
						let newConfig = Object.assign( config.config, basicConfig )
						this.setState({
							config: Object.assign( this.state.config, newConfig )
						}, ( ) => {
							this.editService.save( this.state.config, this.state.id
								? this.state.id
								: this.props.config.instance
									? this.props.config.instance.id
									: undefined ).then(( res ) => {
								if ( res.success === true ) {
									this.setState({ success: true, id: res.id })
								}
							})
						})
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
