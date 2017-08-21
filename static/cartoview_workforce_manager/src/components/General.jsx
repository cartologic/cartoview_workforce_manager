import React, {Component} from 'react';
import t from 'tcomb-form';


const projectConfig = t.struct({title: t.String, abstract: t.String,});
const options = {
    fields: {
        title: {
            label: "Project Title"
        }

    }
};
const Form = t.form.Form;

export default class General extends Component {
    constructor(props) {
        super(props)
         if(!isNaN(id)){
                this.loadProject()
                        }
        this.state = {
        project:"",
        value:this.props.value?this.props.value:"",
        }



    }
loadProject=()=>{
      var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id

        fetch(url, {
            method: "GET",
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

                this.setState({"project": data,   "value":{title:data.title,
               abstract: data.abstract
               }})
            });
}
    save() {
        var basicConfig = this.refs.form.getValue();
        if (basicConfig) {
            let properConfig = {
                title: basicConfig.title,
                abstract: basicConfig.abstract,
                app: app,
                map:this.state.project.mapid
            }
            this.props.onComplete(properConfig)
        }
    }


    render() {
        return (
			<div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4">
						<h4>{'General'}</h4>
					</div>
					<div className="col-xs-7 col-md-8">
						<button
							style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
							className="btn btn-primary btn-sm pull-right"
							onClick={this.save.bind(this)}>{"next "}
							<i className="fa fa-arrow-right"></i>
						</button>


					</div>
				</div>
				<hr></hr>

				<Form
					ref="form"
					value={this.state.value}
					type={projectConfig}
					options={options}/>


			</div>
        )
    }
}
