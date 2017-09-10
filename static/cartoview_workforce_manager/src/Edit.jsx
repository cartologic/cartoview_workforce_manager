import React, { Component } from 'react'
import './css/app.css'
import Navigator from './components/Navigator.jsx'
import General from './components/General.jsx'
import EditService from './services/editService'
import { getCRSFToken } from './helpers/helpers.jsx'
import Dispatchers from './components/dispatchers.jsx'
import Workers from './components/workers.jsx'
import ResourceSelector from './components/ResourceSelector.jsx'
import Users from './components/users.jsx';
import FormFields from './components/form.jsx'
export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project: null,
            workers: "",
            dispatchers: "",
            step: 0,
            selectedResource: this.props.config.instance ? this.props.config.instance.map : undefined,
            value: {},
            map: 0,
            generalConfig: {},
            selectedResource: this.props.config.instance ? this.props.config.instance.map : undefined,
            checkedValues:isNaN(id)? ["code","priority","status"]:[],
        }
            if(!isNaN(id)){
                this.loadProject()
                        }
        this.editService = new EditService({ baseUrl: '/' })

    }
 loadProject=()=>{
      var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id

        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",


            })
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {
                console.log("load peor",data)
                this.setState({"project": data,"code":data.code?data.code:"","priority":data.priority?data.priority:"","status":data.status?data.status:"", "value":{code:data.code?data.code:"",
               status: data.status?data.status:"", priority: data.priority?data.priority:"",mapid:data.mapid?data.mapid:""
               }})
            
               if(this.state.priority!=""){this.state.checkedValues.push("priority")}
               if(this.state.status!=""){this.state.checkedValues.push("status")}
               if(this.state.code!=""){this.state.checkedValues.push("code")}
               console.log("ssassss",this.state.checkedValues)
            });
}

    goToStep(step) {
        this.setState({ step });
    }

    onPrevious() {
        let { step } = this.state;
        this.goToStep(step -= 1)
    }
    render() {
        var { step } = this.state
        const steps = [{
            label: "General",
            component: General,
            props: {
                state: this.state,
                value: this.state.value,
                keywords: this.props.keywords,
                urls: this.props.config.urls,
                instance: this.state.selectedResource,
                project: this.state.project,
                config: this.props.config.instance ? this.props.config.instance.config : undefined,
                onComplete: (basicConfig, project) => {
                    console.log("project", project)
                    this.setState({ value: basicConfig, map: project.mapid, generalConfig: basicConfig, success: true, id: project.id }, () => { console.log(this.state.config, this.state.generalConfig) })
                    let { step } = this.state;
                    console.log(this.state.config, this.state.generalConfig)
                    this.goToStep(++step)

                }
            }

        }, {
            label: "Select Map",
            component: ResourceSelector,
            props: {
                resourcesUrl: this.props.config.urls.resources_url,
                instance: this.state.selectedResource || { "id": this.state.map },
                username: this.props.username,
                selectMap: (resource) => {
                    this.setState({ selectedResource: resource })
                },
                limit: this.props.config.limit,
                onComplete: () => {
                    var { step } = this.state;
                    this.setState({
                        genralConfig: Object.assign(this.state.generalConfig, { "mapid": this.state.selectedResource ? this.state.selectedResource.id : this.state.mapid })
                    }, () => {
                        console.log(this.state.generalConfig)
                        let { step } = this.state;
                        this.goToStep(++step)
                    })

                }
            }
        }, {
            label: "Form Customization",
            component: FormFields,
            props: {
                checkedValues:this.state.checkedValues,
                onComplete: (priority, status, code) => {
                    console.log(priority, status, code)
                    this.setState({ genralConfig: Object.assign(this.state.generalConfig, { "priority": priority, "status": status, "code": code }) }, () => { console.log(this.state.generalConfig) })
                    let { step } = this.state;
                    this.goToStep(++step)

                }
            }
        },

        {
            label: "Users",
            component: Users,
            props: {
                id: this.state.id,
                dispatchers: this.state.dispatchers,
                workers: this.state.workers,
                state: this.state,
                value: this.state.value,
                keywords: this.props.keywords,
                urls: this.props.config.urls,
                instance: this.state.selectedResource,
                project: this.state.project,
                config: this.props.config.instance ? this.props.config.instance.config : undefined,
                onComplete: (dispatchers, workers) => {
                    console.log(dispatchers, workers)
                    this.setState({ dispatchers: dispatchers, workers: workers }, () => {
                        this.editService.save(this.state.generalConfig, this.state.workers, this.state.dispatchers).then(() => {
                            this.setState({ success: true })

                            if (this.state.id) {
                                //  window.location.href = "/apps/cartoview_workforce_manager/" + this.state.id + "/view/"

                            }

                        })
                    })

                }

            }
        }


        ]
        return (<div className="wrapping">  <Navigator
            steps={steps}
            step={step}
            onStepSelected={(step) => this.goToStep(step)} />  <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel" >  {steps.map((s, index) => index == step && < s.component key={index} {...s.props} />)} </div>  </div>)
    }
}
