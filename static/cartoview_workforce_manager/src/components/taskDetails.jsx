import React, {Component} from 'react';
import Details from './details.jsx';
import Edit from './edit.jsx';
import TaskHistroy from './taskhistory.jsx'
export default class TaskDetails extends Component {
    constructor(props) {
        super(props)
         this.state={
             task:this.props.task
         }
    }
loadTask=()=>{
    this.setState({task: false})
        var url = '/apps/cartoview_workforce_manager/api/v1/task/' + this.props.task.id 
          fetch(url, {  method: "GET",
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

                this.setState({task: data})
            });


}


    render() {
        return (



















            
            <div>

             
                    <br/>
                    <ul className="nav nav-tabs">

                        <li className="active" onClick={this.loadTask}><a data-toggle="tab" href="#detail">Details</a></li>
                        <li onClick={this.loadTask}><a data-toggle="tab" href="#edit" >Edit</a></li>
                        <li ><a data-toggle="tab" href="#history" >History</a></li>

                    </ul>

                    <div className="tab-content" style={{"padding":0}}>
                        <div id="detail" className="tab-pane fade in active">
                           { this.state.task &&<Details task={this.state.task} mapid={this.props.mapid} project={this.props.project} />}
                        </div>
                        <div id="edit" className="tab-pane fade">
                            <br/>
                             { this.state.task &&<Edit task={this.state.task} mapid={this.props.mapid} project={this.props.project} />}
                        </div>
                        <div id="history" className="tab-pane fade">
                            <br/>
                             { this.state.task &&<TaskHistroy task={this.state.task}/>}
                        </div>
                         
                    </div>
                    
               
            </div>
        )
    }
}
