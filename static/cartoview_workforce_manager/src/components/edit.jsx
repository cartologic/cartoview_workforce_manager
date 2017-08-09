import React, { Component } from 'react';
import t from 'tcomb-form';
import { getCRSFToken, hasTrailingSlash } from '../helpers/helpers.jsx'
const Form = t.form.Form;
var tComb={}
const Priority = t.enums({
	  0: 'Critical',
	  1: 'High',
	  2: 'Medium',
	  3: 'Low',
	  4: 'Very Low',
});
const Status= t.enums({

	  1: 'Open',
	  2: 'Re-opened',
	  3: 'Closed',
	  4: 'Duplicate',
	  5: 'Resolved',
});

const assign= t.enums({


});



export default class Edit extends Component {
	constructor( props ) {
		super( props )
		this.state={
			success: false,
			assign:[],
            person:null,
            options:{
                        "fields": {
                                "description": {
                                    "type": "textarea",
                                    "attrs":{
                                        rows:"4"
                                                }
                                        }
                                    }
		            },
            value: {
                        title: this.props.task.title,
                        short_description: this.props.task.short_description,
                        description: this.props.task.description,
                        assigned_to :"/apps/cartoview_workforce_manager/api/v1/user/1001/",
                        due_date: new Date(this.props.task.due_date),
                        priority: this.props.task.priority ,
                        status: this.props.task.status   ,
                        work_order:this.props.task.work_order       
                    }
                        
                        
                        
                    }
            




         var url='/apps/cartoview_workforce_manager/api/v1/project/'+id+"/workers"
		 fetch(url,{method:"GET",headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="})})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                        return response.json();
                    })
                    .then((data)=> {
                    console.log(data.objects)
                     this.setState({assign :data.objects},()=>{
                    	var tCombEnum={}
                                this.state.assign.forEach((user)=>{
                                    tCombEnum[user.worker.resource_uri]=user.worker.username
                                }

    )
                         const Person = t.struct({
                              title: t.String,
                              short_description: t.String,
                              description: t.String,
                              assigned_to :t.enums(tCombEnum),
                              work_order:t.maybe(t.Integer),
                              due_date: t.Date,
                              priority: Priority ,
                              status: Status,// enum,

                        })

                            this.setState({person:Person})

					 })
                    });



		this.save=this.save.bind(this)
	}


	 save() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();

    if (value) {
    	var project={"project":{"pk":id}}

var copy = Object.assign(project, value);

   var url='/apps/cartoview_workforce_manager/api/v1/task/'+this.props.task.id

		 fetch(url,{method:"PUT",
		            credentials: "same-origin",
		            headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="}),
					body:JSON.stringify(copy)
					})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                       
                    }).then(( res ) => {console.log("res":res)
                     this.setState({"success":true})
                    })



    }
  }


	render( ) {
		return (
			<div>
		{console.log("ops",this.state.options)}
             < div className=" ">
                    
                     <div style={{"padding": "2%"}}>
                    {this.state.person &&
                   
                     <Form
                    ref="form"
				    options={this.state.options}
                    type={this.state.person}
                    value={this.state.value}
                    />}
                    <button className="btn btn-primary" onClick={this.save}>Save </button>
                    </div>
                    </div>
                


				{this.state.success && <div >
					<br/>
				<div className="alert alert-info">
  Your changes were saved successfully.
</div>

				 </div>}

			</div>
		 )
	}
}
