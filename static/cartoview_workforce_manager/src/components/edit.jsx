import React, { Component } from 'react';
import t from 'tcomb-form';
import { getCRSFToken } from '../helpers/helpers.jsx'
import ReactDOM from 'react-dom';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk//services/MapConfigService';
const Form = t.form.Form;
import Comments from './comments';
import Attachments from './attachments.jsx';
var tComb = {}
import ol from 'openlayers';
import Button from 'react-bootstrap-button-loader';
import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import ImageIcon from 'material-ui-icons/Image';
import CommentIcon from 'material-ui-icons/Comment';
import LocationIcon from 'material-ui-icons/LocationOn';
import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';

const styles = theme => ({
    container: {

        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,

    },
    menu: {

    },
});

class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            success: false,
            assign: [],
            task: null,
            loading: true,
            btnLoading: false,
            x: this.props.task.x,
            y: this.props.task.y,
            extent: this.props.task.extent,
            history: "",
            checked: this.props.project.Project_config,
            options: {
                "fields": {
                    "description": {
                        "type": "textarea",
                        "attrs": {
                            rows: "4"
                        }
                    }
                }
            },
            value: {
                title: this.props.task.title,
                description: this.props.task.description ? this.props.task.description : "",
                assigned_to: this.props.task.assigned_to.id ? this.props.task.assigned_to.id : null,
                due_date: this.props.task.due_date ? this.props.task.due_date : null,
                priority: this.props.task.priority ? this.props.task.priority : "",
                status: this.props.task.status ? this.props.task.status : "",
                work_order: this.props.task.work_order != 0 ? this.props.task.work_order : "",
                Category: this.props.task.Category ? this.props.task.Category : "",
                "created_by": { "username": username }
            },
            open: false,
        }
       
        this.map = new ol.Map({
            //controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],
            layers: [new ol.layer.Tile({ title: 'OpenStreetMap', source: new ol.source.OSM() })],
            view: new ol.View({
                center: [
                    0, 0
                ],
                zoom: 3
            })
        });

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/workers"
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),
            })
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({ assign: data.objects }, () => {
                    var workers = []
                    var worker = {}
                    this.state.assign.forEach((user, i) => {
                        worker[user.worker.id] = user.worker.username
                        workers[i] = { "id": user.worker.id, "username": user.worker.username }
                    }

                    )
                    this.setState({ workers, worker })

                    var priority = []
                    var Category = []
                    var status = []

                    if (this.state.checked.includes("priority")) {
                        for (var i = 0; i < this.props.project.priority.priority.length; i++) {
                            priority[i] = { "label": this.props.project.priority.priority[i].label }

                        }
                    }

                    if (this.state.checked.includes("Category")) {
                        for (var j = 0; j < this.props.project.Category.Category.length; j++) {
                            Category[j] = { "label": this.props.project.Category.Category[j].label }

                        }
                    }
                    if (this.state.checked.includes("status")) {

                        for (var z = 0; z < this.props.project.status.status.length; z++) {
                            status[z] = { "label": this.props.project.status.status[z].label }

                        }
                    }
                    this.setState({ priority: priority, Category: Category, status: status }, () => {


                        const TaskObj = {
                            title: t.String,

                        }

                        const Task = t.struct(TaskObj)
                        this.setState({ task: Task, loading: false })
                    })
                })
            });
        this.save = this.save.bind(this)
        //  this.init( this.map )
    }
    handleRequestClose = () => {
        this.setState({ success: false });
      };
    sendHistory = () => {

        var text = { "text": this.state.history, "task": { "pk": this.props.task.id } }
        var url = '/apps/cartoview_workforce_manager/api/v1/history/'

        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",

            }),
            body: JSON.stringify(text)
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }

            }).then(() => {

            })
    }


    update(mapId) {

        if (mapId) {
            var url = `/maps/${mapId}/data`
            fetch(url, {
                method: "GET",
                credentials: 'include'
            }).then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
            }).then((config) => {
                if (config) {
                    MapConfigService.load(MapConfigTransformService.transform(config), this.map);
                }
            });
        }
    }
    handleChange = name => event => {
        console.log(event.target.value)
        this.state.value[name] = event.target.value
        this.setState({ [this.state.value.name]: event.target.value }, console.log(this.state.value));
    };
    init = (map) => {
        var point_feature = new ol.Feature({});
        map.on('singleclick', (e) => {
            this.setState({ x: e.coordinate[0], y: e.coordinate[1], extent: map.getView().calculateExtent(map.getSize()), value: this.state.value })
            var point_geom = new ol.geom.Point(e.coordinate)
            point_feature.setGeometry(point_geom);
            var vector_layer = new ol.layer.Vector({ source: new ol.source.Vector({ features: [point_feature] }) })
            var style = new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    anchor: [0.5, 45],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: URLS.static + 'marker.png'
                }))
            });
            vector_layer.setStyle(style);
            map.addLayer(vector_layer);

        })

        if (this.state.x && this.state.y) {
            setTimeout(() => {
                var point_geom = new ol.geom.Point([this.state.x, this.state.y])
                point_feature.setGeometry(point_geom);
                var vector_layer = new ol.layer.Vector({ source: new ol.source.Vector({ features: [point_feature] }) })
                map.setView(new ol.View({
                    center: [parseInt(this.state.x), parseInt(this.state.y)],
                    zoom: 3
                }));
                var style = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                        anchor: [0.5, 45],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: URLS.static + 'marker.png'
                    }))
                });
                vector_layer.setStyle(style);
                map.addLayer(vector_layer);
            }, 500)
        }
    }

    historyCheck = () => {

        var date = new Date()
        var dt = date.toUTCString()
        if (this.state.value.status && this.state.value.status != this.props.task.status) {
            if (this.props.task.status) {
                this.state['history'] = this.state['history'] + username + "  changed the status from " + this.props.task.status + " to " + this.state.value.status + " at " + dt
            }
            else {
                this.state['history'] = this.state['history'] + username + "  changed the status to " + this.state.value.status + " at " + dt
            }
            this.sendHistory()
        }
        if (this.state.value.priority && this.state.value.priority != this.props.task.priority) {
            if (this.props.task.priority) {
                this.state['history'] = username + "  changed the priority from " + this.props.task.priority + " to " + this.state.value.priority + " at " + dt

            }
            else {
                this.state['history'] = username + "  changed the priority to " + this.state.value.priority + " at " + dt

            }
            this.sendHistory()
        }
        if (this.state.value.Category && this.state.value.Category != this.props.task.Category) {
            if (this.props.task.Category) {
                this.state['history'] = username + "  changed the Category from " + this.props.task.Category + " to " + this.state.value.Category + " at " + dt
            }
            else {
                this.state['history'] = username + "  changed the Category to " + this.state.value.Category + " at " + dt
            }
            this.sendHistory()

        }
        if (this.state.value.due_date && this.state.value.due_date != this.props.task.due_date) {
            if (this.props.task.due_date) {
                this.state['history'] = username + "  changed the due date from " + this.props.task.due_date + " to " + this.state.value.due_date + " at " + dt
            }
            else {
                this.state['history'] = username + "  changed the due date to " + this.state.value.due_date + " at " + dt

            }
            this.sendHistory()

        }

        // console.log("assign",this.state.value.assigned_to,this.state.workers[this.state.assigned_to],this.state.workers[this.state.assigned_to].username)
        if (this.state.value.assigned_to != "/apps/cartoview_workforce_manager/api/v1/user/undefined/" && this.state.value.assigned_to != this.props.task.assigned_to.id) {
            this.state['history'] = username + "  reassigned the task to " + this.state.worker[this.state.value.assigned_to] + " at " + dt
            this.sendHistory()
        }
    }
    save() {


        var value = this.state.value
        // this.setState({value:this.refs.form.getValue()})
        if (value) {
            let newValue = value.assigned_to ? { ...value, assigned_to: `/apps/cartoview_workforce_manager/api/v1/user/${value.assigned_to}/` } : value

            this.setState({ btnLoading: true })
            var project = { "project": { "pk": id } }
            if (this.state.x && this.state.y) {
                var mapconf = { "x": this.state.x, "y": this.state.y, "extent": this.state.extent.toString() }
                var copy1 = Object.assign(mapconf, newValue);
                var copy = Object.assign(project, copy1);
            }
            else {
                var copy = Object.assign(project, newValue)
            }
            this.setState({ btnLoading: true })
            var url = '/apps/cartoview_workforce_manager/api/v1/task/' + this.props.task.id + '/'
            fetch(url, {
                method: "PUT",
                credentials: "same-origin",
                headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-CSRFToken": getCRSFToken(),
                }),
                body: JSON.stringify(copy)
            })
                .then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                }).then((res) => {
                    this.historyCheck()
                    this.setState({ "success": true, "btnLoading": false })

                })

        }
    }
    componentDidMount() {
        this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
        this.init(this.map)
        setTimeout(() => {
            this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
            this.map.updateSize()
            this.map.render()
        }, 2000)
        console.log(this.props.due_date)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.children != this.props.children) {

        }

    }
    render() {
        const { classes } = this.props
        console.log("------------------------kll",this.props)
        var date=null
        if(this.props.task.due_date){
        var fields = this.props.task.due_date.split('T');
        
        date = fields[0];
        var time = fields[1];
    console.log(date,time,"0000000000000")
    }
        return (
            <div>
                {!this.state.task &&
                    <div>
                        <div ></div>
                        <div ><img src={URLS.static + 'cartoview_workforce_manager/loader'} />
                        </div>
                        <div ></div>
                    </div>
                }

                < div className=" ">

                    <div style={{ "padding": "2%" }}>


                        {this.state.task &&
                            <form className={classes.container} noValidate autoComplete="off">
                                <TextField
                                    fullWidth
                                    label="Title"
                                    className={classes.textField}
                                    defaultValue={this.state.value.title}
                                    onChange={this.handleChange('title')}
                                    margin="normal"
                                />
                                <br />
                                {this.state.checked.includes("description") && <TextField
                                    fullWidth

                                    label="Description"
                                    className={classes.textField}
                                    defaultValue={this.props.task.description}
                                    multiline
                                    rowsMax="4"
                                    onChange={this.handleChange('description')}
                                    margin="normal"
                                />}<br />
                                {this.state.checked.includes("assigned_to") && <TextField
                                    fullWidth
                                    select
                                    label="Assigned To"
                                    SelectProps={{
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    className={classes.textField}
                                    value={this.state.value.assigned_to}
                                    onChange={this.handleChange('assigned_to')}
                                    margin="normal"
                                >
                                    {this.state.workers.map(option => (
                                        <MenuItem key={option.id} value={option.id} >
                                            {option.username}
                                        </MenuItem>
                                    ))}
                                </TextField>}
                                <br />
                                {this.state.checked.includes("due_date") && <TextField
                                    fullWidth
                                    type="date"
                                    label="Due Date"
                                    className={classes.textField}
                                    value={date}
                                    onChange={this.handleChange('due_date')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />}
                                <br />
                                {this.state.checked.includes("priority") && <TextField
                                    fullWidth
                                    select
                                    label="priority"
                                    className={classes.textField}
                                    SelectProps={{

                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    value={this.state.value.priority}
                                    onChange={this.handleChange('priority')}
                                    margin="normal"
                                >
                                    {this.state.priority.map(option => (
                                        <MenuItem key={option.label} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>}
                                <br />
                                {this.state.checked.includes("status") && <TextField
                                    fullWidth
                                    select
                                    label="status"
                                    className={classes.textField}
                                    SelectProps={{

                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    value={this.state.value.status}
                                    onChange={this.handleChange('status')}
                                    margin="normal"
                                >

                                    {this.state.status.map(option => (
                                        <MenuItem key={option.label} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>}
                                <br />
                                {this.state.checked.includes("Category") && <TextField
                                    fullWidth
                                    select
                                    label="Category"
                                    className={classes.textField}
                                    SelectProps={{

                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    value={this.state.value.Category}
                                    onChange={this.handleChange('Category')}
                                    margin="normal"
                                >
                                    {this.state.Category.map(option => (
                                        <MenuItem key={option.label} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>}
                                <br />
                                {this.state.checked.includes("work_order") && <TextField
                                    fullWidth

                                    label="Work Order"
                                    className={classes.textField}
                                    defaultValue={this.state.value.work_order}
                                    onChange={this.handleChange('work_order')}
                                    margin="normal"
                                />}

                            </form>

                        }




                        {this.state.task &&
                            <div>
                                <label>Click to Edit Task Location</label>
                                <div style={{ height: "100%" }} ref="map" className={' map-ct'}>
                                    {this.props.children}
                                </div>

                                <div className="row">
                                    <Button loading={this.state.btnLoading} className="btn btn-primary pull-right" style={{ "margin": "2%" }} onClick={this.save}>Save</Button>

                                </div>
                            </div>}
                        {this.state.success && 
                           

                    <Snackbar
                            open={this.state.success}
                            onRequestClose={this.handleRequestClose}
                            transition={Fade}
                            SnackbarContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            message={<span id="message-id"> Your changes were saved successfully.</span>}
                            />
                       }
                        {this.state.task &&
                            <div >
                                <Paper style={{ "marginTop": "2%" }}>
                                    <p style={{ "padding": "1.5%", "color": "rgba(0, 0, 0, 0.54)" }}><CommentIcon /> <b>Comments</b></p>
                                    <Divider />
                                    <div>
                                        <Comments task={this.props.task.id} />
                                    </div>
                                </Paper>
                                <Paper style={{ "marginTop": "2%" }}>
                                    <p style={{ "padding": "1.5%", "color": "rgba(0, 0, 0, 0.54)" }}><CommentIcon /> <b>Images</b></p>
                                    <Divider />
                                    <div>
                                        <Attachments task={this.props.task.id} />
                                    </div>
                                </Paper>


                            </div>}

                    </div>
                </div>




            </div>
        )
    }
}

export default withStyles(styles)(Edit);