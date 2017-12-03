import React,  {Component}from 'react'; 
import {getCRSFToken}from '../helpers/helpers.jsx'
import Chips, { Chip } from 'react-chips';
import Button from 'react-bootstrap-button-loader';
export default class Users extends Component {
constructor(props) {
super(props)
this.state =  {
users:"",
usernames:[], 
selectedDispatchers:[], 
selectedworkers:[],
loading:false

    

}



var url = '/apps/cartoview_workforce_manager/api/v1/user/'
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

                this.setState({users:data.objects},()=>{
                    
                    this.state.users.map((user)=>
                      { if(user.id>0){
                          this.state.usernames.push(user.username)}})
                  
                      })
                                }); 






if(!isNaN(id)){ 

this.loadWorkers()
this.loadDispatchers()




}}
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
                
                this.setState( {selectedDis:data.objects},
                ()=>{this.state.selectedDis.map((user)=>{
                    this.state.selectedDispatchers.push(user.dispatcher.username)})
                        this.setState({selectedDispatchers:this.state.selectedDispatchers})
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
                    
                    this.state.selectedworkers.push(user.worker.username)})
                        this.setState({selectedworkers:this.state.selectedworkers})
                    })
                }); 
                


}


save() {   
this.props.onComplete(this.state.selectedDispatchers,this.state.selectedworkers)
}

onChangeDispatcher = selectedDispatchers => {
  this.setState({ selectedDispatchers});
  }
onChangeWorker = selectedworkers=> {
    this.setState({ selectedworkers});
  }
render() {
return (

   
   	<div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4">

					</div>
					<div className="col-xs-7 col-md-8">
						<Button loading={this.state.loading} 
							style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
							className="btn btn-primary btn-sm pull-right"
							onClick={
                                ()=>{
                                this.setState({loading:true},this.save.bind(this))
                                }}
                            disabled={this.state.selectedDispatchers.length==0||this.state.selectedworkers.length==0}>{"Save"}
							
						</Button>
					


					</div>
				</div>
       {this.state.users&&
       <div>
        <label>Choose Project&#39;s Dispatchers</label>
       <Chips
          value={this.state.selectedDispatchers}
          onChange={this.onChangeDispatcher}
          suggestions={this.state.usernames}
          fromSuggestionsOnly={true}
        />
         <label>Choose Project&#39;s Workers</label>
       <Chips
          value={this.state.selectedworkers}
          onChange={this.onChangeWorker}
          suggestions={this.state.usernames}
          fromSuggestionsOnly={true}
        />
        </div>
        }
     
      </div>
)
}
}
