import React, { Component } from 'react'
import FieldConfigModal from "./FieldConfigModal"
import t from 'tcomb-form';

const Code = t.struct({
    label: t.String,
    value: t.String
})



export default class FormFields extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: true,
            showModal: false,
            selected:"",
            workOrderConf:"",
            code:"",
            priority:"",
            status:""
        }
    }


    includeChanged = (id) => {

        this.setState({ checked: "false" })
    }


    generateForm = () => {

        const fieldConfig = t.struct({
            required: t.Boolean,
            option: t.list(Code),

        })
        const fieldConfigwork = t.struct({
            required: t.Boolean,
           

        })


    this.setState({ fieldConfig: fieldConfigwork, fieldConfig: fieldConfig,  })

      
    }
    
    openModal = (selected) => {
        this.generateForm()
        this.setState({selected: selected, showModal: true })
    }
    handleHideModal = ( ) => {
        this.setState( { showModal: false } )
    }

    updateAttribute = ( attribute ) => {
        // let { attributes } = this.state
        // let currentAtrribute = this.searchById( attribute.id )
        // if ( currentAtrribute ) {
        //     const id = attributes.indexOf( currentAtrribute )
        //     let updatedObj = update( currentAtrribute, { $merge: attribute } )
        //     attributes[ id ] = updatedObj
            this.setState( { attribute: attribute } )
        // }
    }
    // searchById = ( id ) => {
    //     let result = this.state.attributes.find( ( attribute, index ) => {
    //         return attribute.id === id
    //     } )
    //     return result
    // }
    save=()=>{
        this.props.onComplete()
    }
    setFormValue=(value,s)=>{
        console.log("ss",s)
        var obj={}
        obj[s]=value
        console.log("obj",obj)
  this.setState(obj,()=>{console.log("states",this.state)})
    }
    render() {
        return (
<div>

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
				
            <div  className="col-lg-6">
                <div className="input-group">
                    <span className="input-group-addon">
                        <input
                            defaultChecked={true}
                            onChange={() => this.includeChanged(attribute.id)}
                            ref="code_check"
                            type="checkbox" />
                    </span>
                    <input type="text" value="code" className="form-control" disabled />
                    <span className="input-group-addon" id="basic-addon2">
                        <i className="fa fa-cog" onClick={() => this.openModal("code")}></i>
                    </span>
                </div>

                <div className="input-group">
                    <span className="input-group-addon">
                        <input
                            defaultChecked={true}
                            onChange={() => this.includeChanged(attribute.id)}
                            ref="status_check"
                            type="checkbox" />
                    </span>
                    <input type="text" value="priority" className="form-control" disabled />
                    <span className="input-group-addon" id="basic-addon2">
                        <i className="fa fa-cog" onClick={() => this.openModal("priority")}></i>
                    </span>
                </div>
                <div className="input-group">
                    <span className="input-group-addon">
                        <input
                            defaultChecked={true}
                            onChange={() => this.includeChanged(attribute.id)}
                            ref="status_check"
                            type="checkbox" />
                    </span>
                    <input type="text" value="status" className="form-control" disabled />
                    <span className="input-group-addon" id="basic-addon2">
                        <i className="fa fa-cog" onClick={() => this.openModal("status")}></i>
                    </span>
                </div>
              
            </div>



           { this.state.showModal
                        ? <FieldConfigModal
                            selected={this.state.selected}
                            fieldConfig={this.state.fieldConfig}
                            onComplete={this.props.onComplete}
                            setFormValue={this.setFormValue}
                            handleHideModal={this.handleHideModal} updateAttribute={this.updateAttribute} />
                        : null}
</div>






        )


    }


}