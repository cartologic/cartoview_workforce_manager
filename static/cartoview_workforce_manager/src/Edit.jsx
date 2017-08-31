import React,  {Component}from 'react'
import './css/app.css'
import Navigator from './components/Navigator.jsx'
import General from './components/General.jsx'
import EditService from './services/editService'
import MapEditService from './services/MapEditService'
import {getCRSFToken}from './helpers/helpers.jsx'
import Dispatchers from './components/dispatchers.jsx'
import Workers from './components/workers.jsx'
import ResourceSelector from './components/ResourceSelector.jsx'
import Users from './components/users.jsx'; 
import FormFields from './components/form.jsx'
export default class Edit extends Component {
constructor(props) {
    super(props)
    this.state =  {
            project:null, 
            workers:"", 
            dispatchers:"", 
            step:0, 
            selectedResource:this.props.config.instance?this.props.config.instance.map:undefined, 
            value: {}, 
            map:0, 
            generalConfig: {}, 
            selectedResource:this.props.config.instance?this.props.config.instance.map:undefined, 


}
    this.editService = new EditService( {baseUrl:'/'})

    this.mapeditService = new MapEditService( {baseUrl:'/'})
}

goToStep(step) {
    this.setState( {step}); 
}

onPrevious() {
    let {step} = this.state; 
    this.goToStep(step -= 1)
}



render() {
var {step} = this.state
        const steps = [ {
    label:"General", 
    component:General, 
    props: {
        state:this.state, 
        value:this.state.value, 
        keywords:this.props.keywords, 
        urls:this.props.config.urls, 
        instance:this.state.selectedResource, 
        project:this.state.project, 
        config:this.props.config.instance?this.props.config.instance.config:undefined, 
        onComplete:(basicConfig, project) =>  {
            console.log("project", project)
            this.setState( {value:basicConfig, map:project.mapid, generalConfig:basicConfig, success:true, id:project.id}, () =>  {console.log(this.state.config, this.state.generalConfig)})
            let {step} = this.state; 
            console.log(this.state.config, this.state.generalConfig)
            this.goToStep(++step)

                    }
             }

        },  {
    label:"Select Map", 
    component:ResourceSelector, 
    props: {
        resourcesUrl:this.props.config.urls.resources_url, 
        instance:this.state.selectedResource ||  {"id":this.state.map}, 
        username:this.props.username, 
        selectMap:(resource) =>  {
        this.setState( {selectedResource:resource})
        }, 
        limit:this.props.config.limit, 
        onComplete:() =>  {
            var {step} = this.state; 
            this.setState( {
            genralConfig:Object.assign(this.state.generalConfig,  {"mapid":this.state.selectedResource.id})
            }, () =>  {console.log(this.state.generalConfig)
            let {step} = this.state; 
            this.goToStep(++step)




})

}
}
},  {
label:"Form Customization", 
component:FormFields, 
props: {

onComplete:(priority, status, code) =>  {
console.log(priority, status, code)
this.setState( {
genralConfig:Object.assign(this.state.generalConfig,  {"priority":priority, "status":status, "code":code})
}, () =>  {console.log(this.state.generalConfig)})


let {step} = this.state; 
this.goToStep(++step)



}
}
    },  {
    label:"Users", 
    component:Users, 
    props: {
        id:this.state.id, 
        dispatchers:this.state.dispatchers, 
        workers:this.state.workers, 
        state:this.state, 
        value:this.state.value, 
        keywords:this.props.keywords, 
        urls:this.props.config.urls, 
        instance:this.state.selectedResource, 
        project:this.state.project, 
        config:this.props.config.instance?this.props.config.instance.config:undefined, 
        onComplete:(dispatchers, workers) =>  {
            console.log(dispatchers, workers)
            this.setState( {dispatchers:dispatchers, workers:workers}, () =>  {
            this.editService.save(this.state.generalConfig, this.state.workers, this.state.dispatchers).then((res) =>  {
            this.setState( {success:true})
            console.log(res)
            if (this.state.id) {
            window.location.href = "/apps/cartoview_workforce_manager/" + this.state.id + "/view/"

}

})


})


}




}
}







]
        return ( <div className = "wrapping">  <Navigator
					steps =  {steps}
					step =  {step}
					onStepSelected =  {(step) => this.goToStep(step)}/>  <div className = "col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel" >  {steps.map((s, index) => index == step &&  < s.component key =  {index} {...s.props}/> )} </div>  </div> )
}
}
