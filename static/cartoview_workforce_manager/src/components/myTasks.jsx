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
								<td>{item.description.substring(0,75) } {item.description.length>75 ? "...":""}</td>
								<td>{item.created_by.username}</td>
								<td>{item.assigned_to.username}</td>
								<td>{item.priority}

								</td>
								<td>{item.status}
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

							<TaskDetails task={this.state.selectedtask}/>
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
