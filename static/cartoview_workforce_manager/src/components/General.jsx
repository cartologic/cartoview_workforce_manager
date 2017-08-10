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
        this.state = {
            defaultConfig: {
                // title: this.props.state.config.title
                // 	? this.props.state.config.title
                // 	: this.props.instance.title || "No Title Provided",
                // abstract: this.props.state.config.abstract
                // 	? this.props.state.config.abstract
                // 	: this.props.instance.abstract || "No Abstract Provided",
                // access: this.props.state.config.access
                // 	? this.props.state.config.access
                // 	: this.props.config
                // 		? this.props.config.access
                // 		: 'private'
            }
        }
    }

    save() {
        var basicConfig = this.refs.form.getValue();
        if (basicConfig) {
            let properConfig = {
                title: basicConfig.title,
                abstract: basicConfig.abstract,

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
					value={this.state.defaultConfig}
					type={projectConfig}
					options={options}/>


			</div>
        )
    }
}