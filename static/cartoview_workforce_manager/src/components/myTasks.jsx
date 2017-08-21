import React, {Component} from 'react';
import {getCRSFToken} from '../helpers/helpers.jsx'
import TaskDetails from './taskDetails.jsx'

export default class MyTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {

            loading:true,
            tasks: [],
            selectedtask: null
        }
          console.log("wiil mount")
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


componentDidMount(){

}
    render() {
        return (

			<div className="container">
{this.state.loading && <img src={URLS.static +'marker.png'}/>}
				<br/>
                {this.state.tasks.length != 0 && !this.state.selectedtask && !this.state.loading&&
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

                    {this.state.tasks.map((item, i) => {

                            return <tr key={i} onClick={() => {
                                this.setState({"selectedtask": item})
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
				</table>}

                {
                    this.state.selectedtask &&
					<div>
						<div className="col-md-1"></div>
						<div className="col-md-10">
							<button className="btn btn-link" onClick={() => {
                                this.setState({"selectedtask": null})
                            }}><span className="glyphicon glyphicon-chevron-left"></span>Back To List View
							</button>

							<TaskDetails task={this.state.selectedtask.i}/>
						</div>
						<div className="col-md-1"></div>
					</div>}

                {!this.state.tasks.length && !this.state.loading &&
                <div>
					<p> You don&#39;t have Tasks </p>
				</div>

                }
			</div>


        )
    }
}
