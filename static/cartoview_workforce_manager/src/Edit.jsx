import React, { Component } from 'react'
import './css/app.css'
import Navigator from './components/Navigator.jsx'

import General from './components/General.jsx'
import EditService from './services/editService'
import { getCRSFToken, hasTrailingSlash } from './helpers/helpers.jsx'
import Dispatchers from './components/dispatchers.jsx'
import Workers from './components/workers.jsx'

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
				label: "General",
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

                            this.editService.save( basicConfig, this.state.id ).then(( res ) => {
								   
									this.setState({ success: true, id: res.id })
									let { step } = this.state;
									this.setState({
										config: Object.assign( this.state.config, basicConfig )
									})
									this.goToStep( ++step )
										
									})
					
					
					
					},
					
				}
			},
            {

               label: "Dispatchers",
				component: Dispatchers,
				props: {
					state: this.state,
					keywords: this.props.keywords,
					urls: this.props.config.urls,
					instance: this.state.selectedResource,
					config: this.props.config.instance
						? this.props.config.instance.config
						: undefined,
					onComplete: ( basicConfig ) => {

   var url='/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
   for(var i=0;i<basicConfig.length;i++){
		 fetch(url,{method:"POST",
		            credentials: "same-origin",
		            headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="}),
					body:JSON.stringify({"project":"/apps/cartoview_workforce_manager/api/v1/project/"+this.state.id+"/","dispatcher":basicConfig[i]})
					})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                       
                    })
                   
						}

						let { step } = this.state;	
						this.goToStep( ++step )
					
				
					},
					onPrevious: ( ) => {
						this.onPrevious( )
					}
				}
			},

{

               label: "Workers",
				component: Workers,
				props: {
					state: this.state,
					keywords: this.props.keywords,
					urls: this.props.config.urls,
					instance: this.state.selectedResource,
					config: this.props.config.instance
						? this.props.config.instance.config
						: undefined,
					onComplete: ( basicConfig ) => {
                           var url='/apps/cartoview_workforce_manager/api/v1/project_workers/'
                   	        for(var i=0;i<basicConfig.length;i++){
							fetch(url,{method:"POST",
								credentials: "same-origin",
								headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="}),
								body:JSON.stringify({"project":"/apps/cartoview_workforce_manager/api/v1/project/"+this.state.id+"/","worker":basicConfig[i]})
								})
								.then(function(response) {
									if (response.status >= 400) {
									throw new Error("Bad response from server");
									}
                       
                    })
                   
						}

                        this.setState({ success: true})
                        window.location.href="/apps/cartoview_workforce_manager/"+this.state.id+"/view/"
                    
					
					
					
					
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