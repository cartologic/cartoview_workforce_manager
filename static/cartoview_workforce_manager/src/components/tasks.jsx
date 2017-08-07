import React, { Component } from 'react';
import { getCRSFToken, hasTrailingSlash } from '../helpers/helpers.jsx'

export default class Tasks extends Component {
	constructor( props ) {
		super( props )
		this.state={
			 tasks: [],
			selectedtask:""
		 }
        var url='/apps/cartoview_workforce_manager/api/v1/project/'+this.props.id+'/tasks'
		 fetch(url,{method:"GET",headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="})})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                        return response.json();
                    })
                    .then((data)=> {
                    console.log(data.objects)
                     this.setState({tasks:data.objects})
                    });


	}


	

	render( ) {
		return (  

<div className="container">
 
       <br/>
    {this.state.tasks.length!=0 && <table className="table table-hover table-bordered table-responsive">
    <thead>
      <tr>
        <th>Title </th>
        <th>Description </th>
		<th> Created By </th>
        <th> Assigned To </th>
		<th>Priority </th>
        <th>Status </th>
	
        
      </tr>
    </thead>
    <tbody>

 { this.state.tasks.map((item,i) =>{

       return <tr key="i">
                <td>{item.title}</td>
                <td>{item.short_description}</td>
                <td>{item.created_by.username}</td>
                <td>{item.assigned_to.username}</td>
                <td>{item.priority==1 &&<span>High</span>}
                    {item.priority==0 &&<span>Critical</span>}
                    {item.priority==2 &&<span>Medium</span>}
                    {item.priority==3 &&<span>Low</span>}
                    {item.priority==4 &&<span>Very Low</span>}

                </td>
                <td>{item.status==1 &&<span>Open</span>}
                    {item.status==2 &&<span>Reopened</span>}
                    {item.status==3 &&<span>Closed</span>}
                    {item.status==4 &&<span>Duplicate</span>}
                    {item.status==5 &&<span>Resolved</span>}
                </td>

              </tr>
        }


    )}




      
    </tbody>
  </table>}

    {!this.state.tasks.length && <div>
        <p>No tasks yet for this project</p>
    </div>

    }
</div>


		 )
	}
}
