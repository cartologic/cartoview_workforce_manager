import React, { Component } from 'react'
import FieldConfigModal from "./FieldConfigModal"
import t from 'tcomb-form';

const Category = t.struct({
    label: t.String
})
const Color = t.enums({
    red: 'red',
    green: 'green',
    blue: 'blue',
    black: 'black',
    yellow: 'yellow'
});
const cat = t.struct({
    label: t.String,
    status_color: t.maybe(Color)
})

export default class FormFields extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: true,
            showModal: false,
            selected: "",
            workOrderConf: "",
            Category: this.props.Category?this.props.Category:[],
            priority: this.props.priority?this.props.priority:[],
            status: this.props.status?this.props.status:[],
            due_date:isNaN(id) ?{"required_input":false}:this.props.due_date,
            work_order:isNaN(id) ?{"required_input":false}:this.props.work_order,
            description: isNaN(id) ?{"required_input":false}:this.props.description,
            assigned_to:isNaN(id) ?{"required_input":false}:this.props.assigned_to,
            checkedValues: this.props.checkedValues ? this.props.checkedValues: ["work_order","description","due_date","assigned_to"],
            value: []
        }
       
        if (!isNaN(id)) {
            this.loadProject()
        }

    }
    loadProject = () => {
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
                console.log(data)
                this.setState({
                    "project": data, "Category": data.Category&&data.Category.Category ? data.Category : "", "priority": data.priority&&data.priority.priority ? data.priority : "", "status": data.status&&data.status.status ? data.status : "", 
                    "value": {
                        Category: data.Category ? data.Category : "",
                        status: data.status ? data.status : "", 
                        priority: data.priority ? data.priority : "",
                        checkedValues:data.Project_config,
                        description:data.Description?data.Description:"",
                        due_date:data.due_date?data.due_date:"",
                        work_order:data.work_order?data.work_order:"",
                        assigned_to:data.assigned_to?data.assigned_to:""
                    }
                })
            });
    }
    includeChanged = (e) => {
        {
            var checkedArray = this.state.checkedValues;
            var selectedValue = e.target.value;
            if (e.target.checked === true) {
                checkedArray.push(selectedValue);
                this.setState({
                    checkedValues: checkedArray
                });
            } else {
                let valueIndex = checkedArray.indexOf(selectedValue);
                checkedArray.splice(valueIndex, 1);
                this.setState({
                    checkedValues: checkedArray
                });

            }
        }

    }


    generateForm = () => {
        let x = {
            required_input: t.Boolean
        }
        if (this.state.selected == 'status')
        { x[this.state.selected] = t.list(cat) }
        else if(this.state.selected == 'priority'||this.state.selected == 'Category'){
        x[this.state.selected] = t.list(Category)
        }
        const fieldConfig = t.struct(x)
        this.setState({ fieldConfig, showModal: true })
    }
    openModal = (selected) => {
        this.setState({ selected: selected }, () => this.generateForm())
    }
    handleHideModal = () => {
        this.setState({ showModal: false })
    }
    updateAttribute = (attribute) => {
        this.setState({ attribute: attribute })
    }
    save = () => {
      
        this.props.onComplete(this.state.priority, this.state.status, this.state.Category,this.state.checkedValues,this.state.due_date,this.state.work_order,this.state.description,this.state.assigned_to)
    }
    setFormValue = (value, s) => {  
        var obj = {}
        obj[s] = value
        this.setState(obj)
    }
    check = (value) => {
    console.log(this.state)
    console.log(this.state.checkedValues)
        if (this.state.checkedValues.includes(value)) {
            console.log("inside if",value)
            if (this.state[value] == "") { 
                console.log("btn should be disabled")
                return true }
            else { return false }
        }
        else { return false }
    }
    render() {
        return (
            <div>
                <div>
                    <div className="col-xs-5 col-md-4">
                    </div>
                    <div className="col-xs-7 col-md-8">
                        <button
                            style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
                            disabled={this.check("status") || this.check("priority") || this.check("Category")}
                            className="btn btn-primary btn-sm pull-right"
                            onClick={this.save.bind(this)}>{"next"}
                            <i className="fa fa-arrow-right"></i>
                        </button>


                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                value='Category'
                                defaultChecked={this.props.checkedValues.includes("Category")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="Category_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="Category" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2" onClick={() => this.openModal("Category")}>
                            <i className="fa fa-cog" ></i>
                        </span>
                    </div>

                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                value='priority'
                                defaultChecked={this.props.checkedValues.includes("priority")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="status_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="Priority" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2" onClick={() => this.openModal("priority")}>
                            <i className="fa fa-cog" ></i>
                        </span>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                value='status'
                                defaultChecked={this.props.checkedValues.includes("status")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="status_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="Status" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2" onClick={() => this.openModal("status")}>
                            <i className="fa fa-cog" ></i>
                        </span>
                    </div>

                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                value='work_order'
                                defaultChecked={this.props.checkedValues.includes("work_order")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="work_order_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="Work Order" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2"  onClick={() => this.openModal("work_order")}>
                            <i className="fa fa-cog"></i>
                        </span>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                value='description'
                                defaultChecked={this.props.checkedValues.includes("description")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="work_order_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="Description" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2" onClick={() => this.openModal("description")}>
                            <i className="fa fa-cog" ></i>
                        </span>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                value='due_date'
                                defaultChecked={this.props.checkedValues.includes("due_date")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="work_order_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="Due Date" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2" onClick={() => this.openModal("due_date")}>
                            <i className="fa fa-cog" ></i>
                        </span>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                value='assigned_to'
                                defaultChecked={this.props.checkedValues.includes("assigned_to")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="work_order_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="Assigned to" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2" onClick={() => this.openModal("assigned_to")}>
                            <i className="fa fa-cog" ></i>
                        </span>
                    </div>

                </div>
                {this.state.showModal
                    && <FieldConfigModal
                        selected={this.state.selected}
                        fieldConfig={this.state.fieldConfig}
                        onComplete={this.props.onComplete}
                        setFormValue={this.setFormValue}
                        defaultValue={this.state.value}
                        val={this.state[this.state.selected]}
                        handleHideModal={this.handleHideModal} updateAttribute={this.updateAttribute} />
                }
            </div>






        )


    }


}