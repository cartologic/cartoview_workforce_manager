import React, {Component} from 'react';
import t from 'tcomb-form';
import FileBase64 from 'react-file-base64'
import PropTypes from 'prop-types'

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
            
            if(!isNaN(id))
            {
                this.loadProject()
                        }
            this.state = {
                project:"",
                value:this.props.value?this.props.value:"",
                file: this.props.config ? this.props.logo : null,
                messages: ""
            }
    }

      getFiles=( file )=> {
          this.setState({value:this.refs.form.getValue()})
        let imageRegx = new RegExp( '^image\/*', 'i' )
        if ( imageRegx.test( file.type ) ) {
            if ( Math.ceil( file.file.size / Math.pow( 1024, 2 ), 2 ) >
                3 ) {
                this.setState( { messages: "Max File Size is 3 MB" } )
            } else {
                this.setState( { file: file, messages: "" } )
            }
        } else {
            this.setState( { messages: "this file isn't an image" } )
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

                this.setState({"project": data,   file:data.logo ,"value":{title:data.title,
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
            }
            this.props.onComplete(properConfig,this.state.project,this.state.file)
        }
    }


    render() {
        console.log(this.state)
         let { file, messages } = this.state
        return (
			<div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4">
						
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
				

				<Form
					ref="form"
					value={this.state.value}
					type={projectConfig}
					options={options}/>


                    <div className="row">
                    <div className="col-xs-5 col-md-4">
                        <h5>{'Logo'}</h5>
                    </div>
                  
                </div>
                
                <FileBase64
                    multiple={false}
                    onDone={this.getFiles.bind(this)} 
                    />
                <h4 style={{color:"red"}}>{messages}</h4>
                {file&&<div className="row" style={{ width: "500px" }}>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-md-offset-3">
                 
                        <img className="img-responsive" src={file.base64} />
                    </div>
                </div>}


			</div>
        )
    }
}
