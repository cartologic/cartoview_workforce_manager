import React, {Component} from 'react';
import Moment from 'react-moment';
import TaskDetails from './taskDetails.jsx'
export default class FilterTask extends Component {
    constructor(props) {
        super(props)
        this.state={
            priority:"",
            status:"",
            filter:[],
            result:false,
            selectedtask2:""
        }

    }

    sendFilter = () => {

var priority="",status="",work_order="",worker="",dispatcher=""
if(this.state.priority){
    console.log("in prioirt")
    priority= "priority="+this.state.priority+"&"
}
if(this.state.status){
    status= "status="+this.state.status+"&"
}
if(this.refs.work_order.value){
    work_order="work_order="+this.refs.work_order.value+"&"
}
if(this.refs.dispatcher.value){
    console.log(this.refs.dispatcher)
     console.log(this.refs.dispatcher.value)
    work_order="created_by__username="+this.refs.dispatcher.value+"&"
}
if(this.refs.worker.value){
    work_order="assigned_to__username="+this.refs.worker.value+"&"
}

 var url = '/apps/cartoview_workforce_manager/api/v1/project/'+id+'/tasks/?'+priority+status+work_order

        fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
      
            }),
           
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                      
                }
                   return response.json();
            }).then((data) => {
                      this.setState({"filter":data.objects,"result":true})
           
        })
     

    }


   

   
    render() {


        return (
            <div>
		{ !this.state.filter.length&& !this.state.result&&
        <div className="panel panel-default" style={{"padding":"0"}}>
                <div className="panel-body" style={{"padding":"0"}}>
                    <div className="panel panel-primary">
                            <div className="panel-heading" >Priority</div>
                            <div className="panel-body">
                                    <label className="radio"><input type="radio" name="optradio" value="0" onChange={()=>{this.setState({"priority":0})}}/>Critical</label>
                                    <label className="radio"><input type="radio" name="optradio" value="1" onChange={()=>{this.setState({"priority":1})}}/>High</label>
                                    <label className="radio"><input type="radio" name="optradio" value="2" onChange={()=>{this.setState({"priority":2})}}/>Medium</label>
                                     <label className="radio"><input type="radio" name="optradio" value="3" onChange={()=>{this.setState({"priority":3})}}/>Low</label>
                                    <label className="radio"><input type="radio" name="optradio" value="4" onChange={()=>{this.setState({"priority":4})}}/>Very Low</label>
                            
                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Status</div>
                            <div className="panel-body">
                            
                               
                                    <label className="radio"><input type="radio" name="optradio2" value="1" onChange={()=>{this.setState({"status":1})}}/>Open</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="2" onChange={()=>{this.setState({"status":2})}}/>Re-open</label>
                                     <label className="radio"><input type="radio" name="optradio2" value="3" onChange={()=>{this.setState({"status":3})}}/>Closed</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="4" onChange={()=>{this.setState({"status":4})}}/>Resolved</label>
                                    <label className="radio"><input type="radio" name="optradio2" value="5" onChange={()=>{this.setState({"status":5})}}/>Duplicate</label>
                        
                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Work Order</div>
                            <div className="panel-body"><input type="number" className="form-control" ref="work_order" /></div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Task creator</div>
                            <div className="panel-body">       
                                <div className="form-group">
                              
                                    <select className="form-control" ref="dispatcher">
                                     <option  value=""></option>
                                         {this.props.dispatchers.map((dispatcher,i)=>{
                                      
                                        return <option key={i} value={dispatcher.dispatcher.username}>{dispatcher.dispatcher.username}</option>
                                    })}
                                    
                                    </select>
                                    </div>
                        
                            </div>
                    </div>
                    <div className="panel panel-primary">
                            <div className="panel-heading">Assignee</div>
                            <div className="panel-body">
                             <div className="form-group">
                              
                                <select className="form-control" id="sel1" ref="worker">
                                 <option  value=""></option>
                                    {this.props.workers.map((worker,i)=>{
                                      
                                        return <option key={i} value={worker.worker.username}>{worker.worker.username}</option>
                                    })}
                                    
                                </select>
                                </div>
                                                
                            </div>
                    </div>
                   
                      <button className="btn btn-primary pull-right" style={{"margin":"2%"}} onClick={this.sendFilter} >Filter</button>
                
                
                </div>
            </div>}
{this.state.result&&this.state.filter.length==0 &&<p>No result found</p>}
{this.state.result&&this.state.filter.length>0 &&!this.state.selectedtask2&&







 <table className="table table-hover table-bordered table-responsive">
                                                <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th> Created By</th>
                                                    <th> Assigned To</th>
                                                    <th>Priority</th>
                                                    <th>Status</th>


                                                </tr>
                                                </thead>
                                                <tbody>

                                                {this.state.filter.map((item, i) => {

                                                        return <tr key={i} onClick={() => {
                                                            this.setState({"selectedtask2": item})
                                                        }} style={{"cursor": "pointer"}}>
                                                            <td>{item.title}</td>
                                                            <td>{item.short_description}</td>
                                                            <td>{item.created_by.username}</td>
                                                            <td>{item.assigned_to.username}</td>
                                                            <td>{item.priority == 1 && <span>High</span>}
                                                                {item.priority == 0 && <span>Critical</span>}
                                                                {item.priority == 2 && <span>Medium</span>}
                                                                {item.priority == 3 && <span>Low</span>}
                                                                {item.priority == 4 && <span>Very Low</span>}

                                                            </td>
                                                            <td>{item.status == 1 && <span>Open</span>}
                                                                {item.status == 2 && <span>Reopened</span>}
                                                                {item.status == 3 && <span>Closed</span>}
                                                                {item.status == 4 && <span>Duplicate</span>}
                                                                {item.status == 5 && <span>Resolved</span>}
                                                            </td>

                                                        </tr>
                                                    }
                                                )}


                                                </tbody>
                                            </table>





}
  {
                                                this.state.selectedtask2 &&
                                                <div>
                                                    

                                                        <TaskDetails task={this.state.selectedtask2}/>
                                                   
                                                  
                                                </div>}


            </div>

        )
    }
}
