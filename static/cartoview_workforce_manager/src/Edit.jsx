import React, {Component} from 'react'
import './css/app.css'
import Navigator from './components/Navigator.jsx'
import General from './components/General.jsx'
import EditService from './services/editService'
import MapEditService from './services/MapEditService'
import {getCRSFToken} from './helpers/helpers.jsx'
import Dispatchers from './components/dispatchers.jsx'
import Workers from './components/workers.jsx'
import ResourceSelector from './components/ResourceSelector.jsx'


export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project:null,
            workers:"",
            dispatchers:"",
            step: 0,
            map:0,
            config: {},
            selectedResource: this.props.config.instance ? this.props.config.instance.map:undefined,

        }
        this.editService = new EditService({baseUrl: '/'})

        this.mapeditService = new MapEditService({baseUrl: '/'})
    }

    goToStep(step) {
        this.setState({step});
    }

    onPrevious() {
        let {step} = this.state;
        this.goToStep(step -= 1)
    }



    render() {
        var {step} = this.state
        const steps = [

            {
                label: "General",
                component: General,
                props: {
                    state: this.state,
                    keywords: this.props.keywords,
                    urls: this.props.config.urls,
                    instance: this.state.selectedResource,
                    project:this.state.project,
                    config: this.props.config.instance
                        ? this.props.config.instance.config
                        : undefined,
                    onComplete: (basicConfig) => {
                        this.setState({map:basicConfig.map})
                        this.editService.save(basicConfig, id).then((res) => {

                            this.setState({success: true, id: res.id})
                            let {step} = this.state;
                            this.setState({
                                config: Object.assign(this.state.config, basicConfig)
                            })
                            this.goToStep(++step)

                        })


                    },

                }
            },
             {
        label: "Select Map",
        component: ResourceSelector,
        props: {
          resourcesUrl: this.props.config.urls.resources_url,
          instance: this.state.map,
          username:this.props.username,
          selectMap: (resource) => {
            this.setState({selectedResource: resource})
          },
          limit: this.props.config.limit,
          onComplete: () => {
            var {step} = this.state;
            this.setState({
              config: Object.assign(this.state.config, {map: this.state.selectedResource.id})
            },()=>{



		 var url = '/apps/cartoview_workforce_manager/api/v1/project/'+ this.state.id + "/"
		return fetch( url ,
			 {
			method: 'PUT',
			credentials: "same-origin",
			headers: new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( )}),
			body: JSON.stringify( {"mapid":this.state.selectedResource.id} )
		}).then(( response ) => {response.json( )

         let {step} = this.state;
                        this.goToStep(++step)
        })



            })

          }
        }
      } ,
            {

                label: "Dispatchers",
                component: Dispatchers,
                props: {
                    state: this.state,
                    keywords: this.props.keywords,
                    urls: this.props.config.urls,
                    instance: this.state.selectedResource,
                    dispatchers:this.state.dispatchers,
                    config: this.props.config.instance
                        ? this.props.config.instance.config
                        : undefined,
                    onComplete: (basicConfig) => {
               if(isNaN(id)){
                        var url = '/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
                        for (var i = 0; i < basicConfig.length; i++) {
                            fetch(url, {
                                method: "POST",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),
                                body: JSON.stringify({
                                    "project": "/apps/cartoview_workforce_manager/api/v1/project/" + this.state.id + "/",
                                    "dispatcher": basicConfig[i]
                                })
                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                        throw new Error("Bad response from server");
                                    }

                                })

                        }}
                        else{

                            var del_url = '/apps/cartoview_workforce_manager/api/v1/project/'+id+'/dispatchers/'
                             var url = '/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
                                fetch(del_url, {
                                method: "DELETE",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),

                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                        throw new Error("Bad response from server");
                                    }

                                }).then (()=>{

                                    var dispatcher=""
                                    for (var i = 0; i < basicConfig.length; i++) {


                                   if(basicConfig[i].dispatcher){
                                       dispatcher=basicConfig[i].dispatcher.resource_uri
                                   }
                                   else dispatcher=basicConfig[i]
                            fetch(url, {
                                method: "POST",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),
                                body: JSON.stringify({
                                    "project": "/apps/cartoview_workforce_manager/api/v1/project/" + this.state.id + "/",
                                    "dispatcher": dispatcher
                                })
                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                        throw new Error("Bad response from server");
                                    }

                                })

                        }})







                        }

                        let {step} = this.state;
                        this.goToStep(++step)


                    },
                    onPrevious: () => {
                        this.onPrevious()
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
                    workers:this.state.workers,
                    config: this.props.config.instance
                        ? this.props.config.instance.config
                        : undefined,
                    onComplete: (basicConfig) => {
                        if(isNaN(id)){
                        var url = '/apps/cartoview_workforce_manager/api/v1/project_workers/'
                        for (var i = 0; i < basicConfig.length; i++) {
                            fetch(url, {
                                method: "POST",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),
                                body: JSON.stringify({
                                    "project": "/apps/cartoview_workforce_manager/api/v1/project/" + this.state.id + "/",
                                    "worker": basicConfig[i]
                                })
                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                        console.log(response)
                                        throw new Error("Bad response from server");
                                    }

                                })

                        }}
                        else{console.log("congfig",basicConfig)
                             var url = '/apps/cartoview_workforce_manager/api/v1/project_workers/'
                             var del_url = '/apps/cartoview_workforce_manager/api/v1/project/'+id+'/workers/'
                                fetch(del_url, {
                                method: "DELETE",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),

                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                         console.log(response)
                                        throw new Error("Bad response from server");

                                    }

                                }).then (()=>{

                                    var workers=""
                                    for (var i = 0; i < basicConfig.length; i++) {
                                          console.log(basicConfig[i].workers)
                                          console.log(basicConfig[i])


                                   if(basicConfig[i].workers){
                                       workers=basicConfig[i].workers.resource_uri
                                   }
                                   else workers=basicConfig[i]
                                   console.log("final",workers)
                            fetch(url, {
                                method: "POST",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),
                                body: JSON.stringify({
                                    "project": "/apps/cartoview_workforce_manager/api/v1/project/" + this.state.id + "/",
                                    "worker": workers
                                })
                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                         console.log(response)
                                        throw new Error("Bad response from server");
                                    }

                                })

                        }})







                        }

                        this.setState({success: true})
                        window.location.href = "/apps/cartoview_workforce_manager/" + this.state.id + "/view/"


                    },
                    onPrevious: () => {
                        this.onPrevious()
                    }
                }
            }


        ]
        return (
			<div className="wrapping">
	 <Navigator
					steps={steps}
					step={step}
					onStepSelected={(step) => this.goToStep(step)}/>





				<div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel">
                    {steps.map((s, index) => index == step && <s.component key={index} {...s.props}/>)}
				</div>
			</div>
        )
    }
}
