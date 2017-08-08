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

const options = {
	fields: {
			description: {

				type: "textarea",

				attrs:{
					rows:"4"
				}
		}
	}
};

export default class AddTask extends Component {
	constructor( props ) {
		super( props )
		this.state={
			success: false,
			assign:[],
            person:null
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

   var url='/apps/cartoview_workforce_manager/api/v1/task/'

		 fetch(url,{method:"POST",
		            credentials: "same-origin",
		            headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="}),
					body:JSON.stringify({copy})
					})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }

                    })



    }
  }


	render( ) {
		return (
			<div>
			<div className="col-md-2"></div>
                {!this.state.success && < div className="col-md-8">
                    <br/>
                    {this.state.person && <Form
                    ref="form"
										options={options}
                    type={this.state.person}

                    />}
                    <button className="btn btn-primary" onClick={this.save}>Save</button>
                    </div>
                }


				{this.state.success && <div className="col-md-8">
					<br/>
				<div className="alert alert-info">
  Your Task was created successfully.
</div>

				 </div>}

		<div className="col-md-2"></div>
			</div>
		 )
	}
}
