import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import t from 'tcomb-form';

const Form = t.form.Form;
t.form.Form.i18n = {
    optional: ''
,   required: ''
,   add: '➕'
,   remove: '✖'
,   up: '▲'
,   down: '▼'
}
const options = {
    fields: {
        name: {
            disabled: true
        },
        dataType: {
            disabled: true
        },
        fieldType: {
            nullOption: {
                value: '',
                text: 'Choose Field Type'
            }
        },
        id: {
            type: 'hidden'
        }
    },
};
export default class FieldConfigModal extends Component {
    constructor(props) {
        super(props)
        var deafaultValues=
        {"Category": [{"label": "Health"},{"label": "Enviroment"}],"required_input": false,
         "priority": [{"label": "Low"},{"label": "Medium"},{"label":"High"}], "required_input": false,
         "status": [{"label": "Opened"},{"label": "Resolved"},{"label":"Closed"}], "required_input": false
        }
        this.state = {
            value:this.props.val!=''? this.props.val:deafaultValues
        }
    }
    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
    }
    save = () => {
        var valu = this.refs.form.getValue()
        var value = {}
        if (valu) {
            value[ this.props.selected] = valu
            this.setState({value})
            this.props.setFormValue(valu, this.props.selected)
    
            this.props.updateAttribute(valu)
            $(ReactDOM.findDOMNode(this)).modal('hide')
        }
    }
    render() {
        return (
            <div className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{this.props.selected}</h4>
                        </div>
                        <div className="modal-body">
                            <Form
                                ref="form"
                                type={this.props.fieldConfig}
                                value={this.state.value}
                                options={options} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" onClick={this.save} className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
FieldConfigModal.propTypes = {
    handleHideModal: PropTypes.func.isRequired,
    fieldConfig: PropTypes.func.isRequired,
    updateAttribute: PropTypes.func.isRequired,
};