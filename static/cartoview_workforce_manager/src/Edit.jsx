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
import Users from './components/users.jsx';
import FormFields from './components/form.jsx'
export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project:null,
            workers:"",
            dispatchers:"",
            step: 0,
            selectedResource: this.props.config.instance ? this.props.config.instance.map:undefined,
            value:{},
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
                    value:this.state.value,
                    keywords: this.props.keywords,
                    urls: this.props.config.urls,
                    instance: this.state.selectedResource,

                    project:this.state.project,
                    config: this.props.config.instance
                        ? this.props.config.instance.config
                        : undefined,
                    onComplete: (basicConfig) => {

                       
                        this.setState({value:basicConfig,map:basicConfig.map})
                        this.editService.save(basicConfig, id).then((res) => {
                             console.log("res",res,res.id)
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
              instance: this.state.selectedResource||{"id":this.state.map},

              username:this.props.username,
              selectMap: (resource) => {
                console.log(resource)
                this.setState({selectedResource: resource})
              },
              limit: this.props.config.limit,
              onComplete: () => {
                var {step} = this.state;
                this.setState({
                  config: Object.assign(this.state.config, {map: this.state.selectedResource?this.state.selectedResource.id:this.state.map})
                },()=>{


console.log(this.state.config)
		 var url = '/apps/cartoview_workforce_manager/api/v1/project/'+ this.state.id + "/"
		return fetch( url ,
			 {
			method: 'PUT',
			credentials: "same-origin",
			headers: new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( )}),
			body: JSON.stringify( {"mapid":this.state.config.map} )
		}).then(( response ) => {response.json( )

         let {step} = this.state;
                        this.goToStep(++step)
        })



            })

          }
        }
      } ,




      {
        label: "Form Customization",
        component: FormFields,
        props: {
              
              onComplete: (conf) => {
                console.log(conf)
               


        let {step} = this.state;
        this.goToStep(++step)

           

          }
        }
      } ,

             {
                label: "Users",
                component: Users,
                props: {
                    id:this.state.id,
                    dispatchers:this.state.dispatchers,
                    workers:this.state.workers,
                    state: this.state,
                    value:this.state.value,
                    keywords: this.props.keywords,
                    urls: this.props.config.urls,
                    instance: this.state.selectedResource,
                    project:this.state.project,
                    config: this.props.config.instance
                        ? this.props.config.instance.config
                        : undefined,
                    onComplete: (dispatchers,workers) => {
                        console.log(dispatchers,workers)
                        this.setState({dispatchers:dispatchers,workers:workers})
                                if(!isNaN(id)){
                                    var del_url_dis = '/apps/cartoview_workforce_manager/api/v1/project/'+id+'/dispatchers/'
                                        fetch(del_url_dis, {
                                        method: "DELETE",
                                        credentials: "same-origin",
                                        headers: new Headers({
                                            "Content-Type": "application/json; charset=UTF-8",
                                         

                                        }),

                                    })
                                        .then(function (response) {
                                            if (response.status >= 400) {
                                                throw new Error("Bad response from server");
                                            }

                                        })

                                    var del_url_wor = '/apps/cartoview_workforce_manager/api/v1/project/'+id+'/workers/'
                                        fetch(del_url_wor, {
                                        method: "DELETE",
                                        credentials: "same-origin",
                                        headers: new Headers({
                                            "Content-Type": "application/json; charset=UTF-8",
                                       

                                        }),

                                    })
                                        .then(function (response) {
                                            if (response.status >= 400) {
                                                throw new Error("Bad response from server");
                                            }

                                        })



                                }
                        var dispatcher_url = '/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
                        for (var i = 0; i < dispatchers.length; i++) {
                            fetch(dispatcher_url, {
                                method: "POST",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),
                                body: JSON.stringify({
                                    "project": "/apps/cartoview_workforce_manager/api/v1/project/" + this.state.id + "/",
                                    "dispatcher": {"username":dispatchers[i]}
                                })
                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                        throw new Error("Bad response from server");
                                    }






                                })

                        }
                         var worker_url = '/apps/cartoview_workforce_manager/api/v1/project_workers/'
                        for (var j = 0; j < workers.length; j++) {
                            fetch(worker_url, {
                                method: "POST",
                                credentials: "same-origin",
                                headers: new Headers({
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "X-CSRFToken": getCRSFToken(),

                                }),
                                body: JSON.stringify({
                                    "project": "/apps/cartoview_workforce_manager/api/v1/project/" + this.state.id + "/",
                                    "worker": {"username":workers[j]}
                                })
                            })
                                .then(function (response) {
                                    if (response.status >= 400) {
                                        throw new Error("Bad response from server");
                                    }






                                })

                        }
                        
                      


                         this.setState({success: true})
                         window.location.href = "/apps/cartoview_workforce_manager/" + this.state.id + "/view/"

                          
                            
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
