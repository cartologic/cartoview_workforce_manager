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
            save_error:false,
            project: null,
            workers:[],
            dispatchers: [],
            step: 0,
            Category: [],
            priority: [],
            status: [],
            logo:"",
            selectedResource: this.props.config.instance ? this.props.config.instance.map : undefined,
            value: {},
            map: 0,
            auth:false,
            done:false,
            generalConfig: {},
            selectedResource: this.props.config.instance ? this.props.config.instance.map : undefined,
            checkedValues:isNaN(id)? ["work_order","description","due_date","assigned_to","Category","priority","status"]:[],
        }
            if(!isNaN(id)){
                this.loadProject()
                this.loadWorkers()
                this.loadDispatchers()
                        }
        this.editService = new EditService({ baseUrl: '/' })

    }
    checkDispatcher = (dispatchers) => {
        dispatchers.map((dispatcher) => {
        if (dispatcher.dispatcher.username === username) {
          this.setState({ auth: true })
        }
      })
    this.setState({done:true})}
    save=()=>{
      
        if(this.state.generalConfig && this.state.workers.length>0&&this.state.dispatchers.length>0)
        {this.editService.save(this.state.generalConfig, this.state.workers, this.state.dispatchers).then(() => {
            this.setState({ success: true })

            if (this.state.id) {
                //  window.location.href = "/apps/cartoview_workforce_manager/" + this.state.id + "/view/"

            }

        })
    }
    else if (this.state.project&&this.state.project.dispatchers){
        this.editService.save(this.state.generalConfig, this.state.project.workers,this.state.project.dispatchers).then(() => {
            this.setState({ success: true })

            if (this.state.id) {
                //  window.location.href = "/apps/cartoview_workforce_manager/" + this.state.id + "/view/"

            }

        })
    }
else{
    this.setState({save_error:true})
}
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


    loadDispatchers=()=>{
    var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/dispatchers"
    fetch(url,  {
                    method:"GET", 
                    headers:new Headers( {
                    "Content-Type":"application/json; charset=UTF-8", 
                    "X-CSRFToken":getCRSFToken(), 
                    })
                    })
                    .then(function (response) {
                    if (response.status >= 400) {
                    throw new Error("Bad response from server"); 
                    }
                    return response.json(); 
                    })
                    .then((data) =>  {
                        this.checkDispatcher(data.objects)
                        this.setState( {selectedDis:data.objects},
                        ()=>{this.state.selectedDis.map((user)=>{
                        this.state.dispatchers.push(user.dispatcher.username)})
                            this.setState({dispatchers:this.state.dispatchers})
                        })
                    }); 
                    }
    loadWorkers=()=>{
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/workers"
        fetch(url,  {
                    method:"GET", 
                    headers:new Headers( {
                    "Content-Type":"application/json; charset=UTF-8", 
                    "X-CSRFToken":getCRSFToken(), 
    
                    })
                    })
                    .then(function (response) {
                    if (response.status >= 400) {
                    throw new Error("Bad response from server"); 
                    }
                    return response.json(); 
                    })
                    .then((data) =>  {
                    
                    this.setState( {selectedwor:data.objects},
                    ()=>{this.state.selectedwor.map((user)=>{
                        
                        this.state.workers.push(user.worker.username)})
                            this.setState({workers:this.state.workers})
                        })
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
                logo:this.state.logo,
                config: this.props.config.instance ? this.props.config.instance.config : undefined,
                onComplete: (basicConfig, project,logo) => {
                  
                    var conf=Object.assign(basicConfig, { "logo":logo})
                    this.setState({
                        generalConfig: Object.assign(this.state.generalConfig,conf)
                    })
                    this.setState({ value: basicConfig,  map:project? project.mapid:null, generalConfig: conf, success: true, id: project?project.id :null,logo:logo},this.save())
                    let { step } = this.state;
                    // this.goToStep(++step)
                    
                }
                ,next: (basicConfig, project,logo) => {
                  
                    var conf=Object.assign(basicConfig, { "logo":logo})
                    this.setState({
                        generalConfig: Object.assign(this.state.generalConfig,conf)
                    })
                    this.setState({ value: basicConfig, map:project? project.mapid:null, generalConfig: conf, success: true, id: project?project.id :null,logo:logo})
                    let { step } = this.state;
             
                    
                }
            }

        }, {
            label: "Select Map",
            component: ResourceSelector,
            props: {
                resourcesUrl: this.props.config.urls.resources_url,
                instance: this.state.selectedResource || { "id": this.state.map },
                username: this.props.username,
                resource:this.state.selectedResource,
                selectMap: (resource) => {
                    this.setState({ selectedResource: resource })
                },
                limit: this.props.config.limit,
                onComplete: () => {
                    var { step } = this.state;
                    this.setState({
                        generalConfig: Object.assign(this.state.generalConfig, { "mapid": this.state.selectedResource ? this.state.selectedResource.id : this.state.mapid })
                    }, () => {
                      
                        let {step} = this.state;
                        // this.goToStep(++step)
                    })
            this.save()    
                },
                next: () => {
                    var { step } = this.state;
                    this.setState({
                        generalConfig: Object.assign(this.state.generalConfig, { "mapid": this.state.selectedResource ? this.state.selectedResource.id : this.state.mapid })
                    }, () => {
                      
                        let {step} = this.state;
                        // this.goToStep(++step)
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
                    this.setState({ generalConfig: Object.assign(this.state.generalConfig, {"priority": priority, "status": status, "Category": Category ,"Project_config":checked,"due_date":due_date,"work_order":work_order,"Description":description,"assigned_to":assigned_to}) })
                    let { step } = this.state;
                    // this.goToStep(++step)
                    this.save() 
                },
                next: (priority, status, Category,checked,due_date,work_order,description,assigned_to) => {
                    this.setState({"priority": priority, "status": status, "Category": Category})
                     this.setState({ generalConfig: Object.assign(this.state.generalConfig, {"priority": priority, "status": status, "Category": Category ,"Project_config":checked,"due_date":due_date,"work_order":work_order,"Description":description,"assigned_to":assigned_to}) })
                     let { step } = this.state;
                     // this.goToStep(++step)
                  
                 }
            }
           
        },

        {
            label: "Users",
            component: Users,
            props: {
                error:this.state.save_error,
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
            ,   next: (dispatchers, workers) => {
                this.setState({ dispatchers: dispatchers, workers: workers }, () => {
    
})

}
            }
        }


        ]
        if(this.state.auth && !isNaN(id)|| isNaN(id) ){return (
       
        <div className="wrapping"> 
       { this.state.step==0&&this.state.generalConfig&& <FormFields    style={{display:"none"}}
        display={true}
        checkedValues={this.state.checkedValues}
        work_order={this.state.work_order}
        due_date={this.state.due_date}
        assigned_to={this.state.assigned_to}
        description={this.state.description}
        priority={this.state.priority}
        status={this.state.status}
        Category={this.state.Category}
        next={ (priority, status, Category,checked,due_date,work_order,description,assigned_to) => {
         
             this.setState({"priority": priority, "status": status, "Category": Category})
             this.setState({ generalConfig: Object.assign(this.state.generalConfig, {"priority": priority, "status": status, "Category": Category ,"Project_config":checked,"due_date":due_date,"work_order":work_order,"Description":description,"assigned_to":assigned_to},console.log("___",this.state.generalConfig)) })
             let { step } = this.state;
             // this.goToStep(++step)
          
         }}
        
     />}
         <Navigator
            save_error={this.state.save_error}
            steps={steps}
            step={step}
            onStepSelected={(step) => this.goToStep(step)} />  <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel" >  {steps.map((s, index) => index == step && < s.component key={index} {...s.props} />)} </div>  
            
            </div>
        )}else if(this.state.done&&!this.state.auth){
            return(
                <div className="container">
            
              
                <div className="alert alert-danger">
                  <strong>Only dispatchers can edit projects setttings </strong>
                </div>
              </div>
            )
        }
        else return (
            <div className={"row"}>
                <div className={"col-md-4"}>
                </div>
                <div className={"col-md-4"}>
                  <img src={'/static/loader'} />
                </div>
                <div className={"col-md-4"}>
                </div>
            </div>
        )
    }
}
