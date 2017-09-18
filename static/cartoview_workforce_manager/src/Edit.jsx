import React, { Component } from 'react'
import './css/app.css'
import Navigator from './components/Navigator.jsx'
import General from './components/General.jsx'
import EditService from './services/editService'
import { getCRSFToken } from './helpers/helpers.jsx'

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
            Category: [],
            priority: [],
            status: [],
           
            selectedResource: this.props.config.instance ? this.props.config.instance.map : undefined,
            value: {},
            map: 0,
            generalConfig: {},
            selectedResource: this.props.config.instance ? this.props.config.instance.map : undefined,
            checkedValues:isNaN(id)? ["work_order","description","due_date","assigned_to"]:[],
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
              
               this.setState({"checkedValues":data.Project_config})
                this.setState({"project": data,"Category":data.Category?data.Category:"","priority":data.priority?data.priority:"","status":data.status?data.status:"", "value":{Category:data.Category?data.Category:"",
               status: data.status?data.status:"", priority: data.priority?data.priority:"",mapid:data.mapid?data.mapid:"",
               work_order:data.work_order,assigned_to:data.assigned_to,due_date:data.due_date,description:data.Description}})            
            //    if(this.state.priority!=""){this.state.checkedValues.push("priority")}
            //    if(this.state.status!=""){this.state.checkedValues.push("status")}
            //    if(this.state.Category!=""){this.state.checkedValues.push("Category")}

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
                    this.setState({ value: basicConfig, map: project.mapid, generalConfig: basicConfig, success: true, id: project.id })
                    let { step } = this.state;
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
                      
                        let {step} = this.state;
                        this.goToStep(++step)
                    })

                }
            }
        }, {
            label: "Form Customization",
            component: FormFields,
            props: {
                checkedValues:this.state.checkedValues,
                work_order:this.state.work_order,
                due_date:this.state.due_date,
                assigned_to:this.state.assigned_to,
                description:this.state.description,
                priority:this.state.priority,
                status:this.state.status,
                Category:this.state.Category,
                onComplete: (priority, status, Category,checked,due_date,work_order,description,assigned_to) => {
                   this.setState({"priority": priority, "status": status, "Category": Category})
                    this.setState({ genralConfig: Object.assign(this.state.generalConfig, {"priority": priority, "status": status, "Category": Category ,"Project_config":checked,"due_date":due_date,"work_order":work_order,"Description":description,"assigned_to":assigned_to}) })
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
