import React, { Component } from 'react'
import FieldConfigModal from "./FieldConfigModal"
import t from 'tcomb-form';

const category = t.struct({
    label: t.String

})
const Color = t.enums({
    red: 'red',
    green: 'green',
    blue: 'blue',
    black:'black',
    yellow:'yellow'
  });
const cat = t.struct({
    label: t.String,
    status_color:t.maybe(Color)

})

export default class FormFields extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: true,
            showModal: false,
            selected: "",
            workOrderConf: "",
            category: "",
            priority: "",
            status: "",
            checkedValues:isNaN(id)? ["category","priority","status"]:[],
            value:""
        }
   console.log("checked",this.state.checkedValues)
    if(!isNaN(id)){
                this.loadProject()
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
                console.log(data)
                this.setState({"project": data,"category":data.category?data.category:"","priority":data.priority?data.priority:"","status":data.status?data.status:"", "value":{category:data.category?data.category:"",
               status: data.status?data.status:"", priority: data.priority?data.priority:""
               }})
            
               if(this.state.priority!=""){this.state.checkedValues.push("priority")}
               if(this.state.status!=""){this.state.checkedValues.push("status")}
               if(this.state.category!=""){this.state.checkedValues.push("category")}
               console.log("ssassss",this.state.checkedValues)
            });
}

    includeChanged = (e) => {

        
    { 
            var checkedArray =this.state.checkedValues;
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

    }}
    
    }


    generateForm = () => {
        console.log("selected",this.state.selected)
        let x = {
            required_input: t.Boolean
        }
        if(this.state.selected=='status')
            {x[this.state.selected] = t.list(cat)}
        else{x[this.state.selected] = t.list(category)}
        
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
        this.props.onComplete(this.state.priority, this.state.status, this.state.category)
    }
    setFormValue = (value, s) => {
        console.log("ss", s)
        var obj = {}
        obj[s] = value
        console.log("obj", obj)
        this.setState(obj, () => { console.log("states", this.state) })
    }
    check = (value) => {
        // console.log(value,this.state.checkedValues,this.state.checkedValues.includes(value))
        // return this.state.checkedValues.includes(value);
        if( this.state.checkedValues.includes(value)){
            if( this.state[value] == ""){ return true}
            else{return false}
        }
        else {return false}
    }
    render() {
        console.log(this.state)
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
                            disabled={this.check("status") ||this.check("priority")||this.check("category")}
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
                                value='category'
                                defaultChecked={this.props.checkedValues.includes("category")}
                                onChange={(e) => this.includeChanged(e)}
                                ref="category_check"
                                type="checkbox" />
                        </span>
                        <input type="text" value="category" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2">
                            <i className="fa fa-cog" onClick={() => this.openModal("category")}></i>
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
                        <input type="text" value="priority" className="form-control" disabled />
                        <span className="input-group-addon" id="basic-addon2">
                            <i className="fa fa-cog" onClick={() => this.openModal("priority")}></i>
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
                        defaultValue={this.state.value}
                        handleHideModal={this.handleHideModal} updateAttribute={this.updateAttribute} />
                }
            </div>






        )


    }


}