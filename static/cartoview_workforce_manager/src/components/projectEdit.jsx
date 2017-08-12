import React, {Component} from 'react';


export default class ProjectEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            success: false,
        }
    }


    save = () => {


        var project = {"title": this.refs.title.value, "abstract": this.refs.abstrac.value}
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id
        fetch(url, {
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
              'Authorization': `Basic ${hash}`
            })
            ,
            body: JSON.stringify(project)
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {

                this.setState({success: true})
            });


    }

    render() {
        return (<div className="container">
				<div className="col-md-2"></div>
				<div className="well col-md-8">
					<div className="headers"><b>General Edit </b></div>
					<div className="form-group">
						<br/>
						<label>Project Title</label>
						<input type="text" ref="title" className="form-control" id="usr"
							   defaultValue={this.props.project.title}/>
					</div>
					<div className="form-group">
						<label>Project Abstract</label>
						<input className="form-control" ref="abstrac" id="pwd"
							   defaultValue={this.props.project.abstract}/>
					</div>
					<button type="button" className="btn btn-primary" style={{"pullRight": "true"}} onClick={this.save}>
						Save
					</button>
                    {this.state.success &&
					<div className="alert alert-info">
						your changed was saved successfully.
					</div>
                    }


					<hr/>


				</div>
				<div className="col-md-2"></div>
			</div>
        )
    }
}
