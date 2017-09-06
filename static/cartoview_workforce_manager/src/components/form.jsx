import React, { Component } from 'react'
import FieldConfigModal from "./FieldConfigModal"
import t from 'tcomb-form';

const Code = t.struct({
    label: t.String
   
}, )



export default class FormFields extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: true,
            showModal: false,
            selected: "",
            workOrderConf: "",
            code: null,
            priority: null,
            status: null
        }
    }


    includeChanged = (id) => {

        this.setState({ checked: "false" })
    }


    generateForm = () => {
        let x = {
            required: t.Boolean
        }
        x[this.state.selected] = t.list(Code)
        const fieldConfig = t.struct(x)


        this.setState({ fieldConfig, showModal: true })


    }

    openModal = (selected) => {
        console.log(selected)
        this.setState({ selected: selected }, () => this.generateForm())
    }
    handleHideModal = () => {
        this.setState({ showModal: false })
    }

    updateAttribute = (attribute) => {
        this.setState({ attribute: attribute })

    }

    save = () => {
        this.props.onComplete(this.state.priority, this.state.status, this.state.code)
    }
    setFormValue = (value, s) => {
        console.log("ss", s)
        var obj = {}
        obj[s] = value
        console.log("obj", obj)
        this.setState(obj, () => { console.log("states", this.state) })
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

                <div className="col-lg-6">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                defaultChecked={true}
                                onChange={() => this.includeChanged()}
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
                                onChange={() => this.includeChanged()}
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
                                onChange={() => this.includeChanged()}
                                ref="status_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="status" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2">
                            <i className="fa fa-cog" onClick={() => this.openModal("status")}></i>
                        </span>
                    </div>

                </div>



                {this.state.showModal
                    && <FieldConfigModal
                        selected={this.state.selected}
                        fieldConfig={this.state.fieldConfig}
                        onComplete={this.props.onComplete}
                        setFormValue={this.setFormValue}
                        handleHideModal={this.handleHideModal} updateAttribute={this.updateAttribute} />
                }
            </div>






        )


    }


}