import React, {Component} from 'react';
import {getCRSFToken} from '../helpers/helpers.jsx'
import TaskDetails from './taskDetails.jsx'
import TaskHistroy from './taskhistory.jsx'
export default class MyTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {

            loading:true,
            tasks: [],
            selectedtask:this.props.selected
        }
         
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + this.props.id + '/tasks/?assigned_to__username='+username
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),

            })
        })
            .then(function (response) {

                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {

                this.setState({tasks: data.objects,loading:false})
            });

    }

componentWillReceiveProps(nextprops)
{
    this.setState({selectedtask:null})

console.log("will reciedbde")
}
componentDidMount(){

}
  render() {
        return (
<div style={{"padding":"1%"}}>
			<div className="" style={{"overflowX":"auto"}}>
{this.state.loading && <img src={URLS.static +'marker.png'}/>}
				<br/>
                {this.state.tasks.length != 0 && !this.state.selectedtask && !this.state.loading&&
				<table className="table table-hover ">
					<thead>
					<tr>
                    <th>Title</th>
                    {this.props.project.Project_config.includes("description") && <th>Description</th>}
                    <th> Created By</th>
                    {this.props.project.Project_config.includes("assigned_to") &&<th> Assigned To</th>}
                    {this.props.project.Project_config.includes("priority") && <th>Priority</th>}
                    {this.props.project.Project_config.includes("status")&& <th>Status</th>}
					</tr>
					</thead>
					<tbody>

                    {this.state.tasks.map((item, i) => {

                            return <tr key={i} onClick={() => {
                             this.setState({"selectedtask": item})
                            }} style={{"cursor": "pointer"}}>
								 <td>{item.title}</td>
                                {this.props.project.Project_config.includes("description") &&<td>{item.description.substring(0, 75)} {item.description.length > 75 ? "..." : ""}</td>}
                                <td>{item.created_by.username}</td>
                                {this.props.project.Project_config.includes("assigned_to") &&<td>{item.assigned_to.username?item.assigned_to.username:'-'}</td>}
                                {this.props.project.Project_config.includes("priority") && <td>{item.priority?item.priority:'-'}
                                 </td>}
                                {this.props.project.Project_config.includes("status") &&<td>{item.status?item.status:'-'}
                                </td>}

                                            

							</tr>
                        }
                    )}


					</tbody>
				</table>}

                {
                    this.state.selectedtask &&
					<div>
						
							

							<TaskDetails task={this.state.selectedtask} project={this.props.project}/>
						
					</div> }

                {!this.state.tasks.length && !this.state.loading &&
                <div>
					<p> You don&#39;t have Tasks </p>
				</div>

                }
			</div>

</div>
        )
    }
}
