import React, { Component } from 'react';
import t from 'tcomb-form';
import ReactDOM from 'react-dom';
import { getCRSFToken } from '../helpers/helpers.jsx'
import AddLocationMap from './addLocationMap.jsx';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import ol from 'openlayers';
// import Button from 'react-bootstrap-Button-loader';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import ImageIcon from 'material-ui-icons/Image';
import CommentIcon from 'material-ui-icons/Comment';
import LocationIcon from 'material-ui-icons/LocationOn'; const Form = t.form.Form;
import Grid from 'material-ui/Grid';

const drawerWidth = 240



const styles = theme => ({
  root: {
    // width: '100%',
    // height: 'auto', marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    // overflow: 'overlay'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    // height: '100%'
  },
  rootGrid: {
    flexGrow: 1
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create([
      'margin', 'width'
    ], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create([
      'margin', 'width'
    ], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth
  },
  drawerPaper2: {

    height: '100%',
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px'
  },
  content: {
    width: '100%',
    marginLeft: `-${drawerWidth + 1}px`,
    [theme.breakpoints.down('lg')]: {
      marginLeft: `0px`
    },
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    // height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64
      }
    }
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 500,
  },
});


var tComb = {}
class AddTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      success: false,
      auth: false,
      assign: [],
      person: null,
      point: [],
      extent: null,
      value: {},
      title: "",
      description: "",
      assigned_to: "",
      due_date: "",
      priorityValue: "",
      statusValue: "",
      work_order: "",
      CategoryValue: ""
      ,
      priority: null,
      Category: null,
      status: null,
      checked: this.props.project.Project_config,
      loading: false,
      step: 1,
      comment: "",
      image: "",
      commentDone: false,
      imageDone: false,
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
    fetch(url, { method: "GET", headers: new Headers({ "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() }) })
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((data) => {

        this.setState({ assign: data.objects }, () => {
          var workers = []
          this.state.assign.forEach((user, i) => {

            workers[i] = { "id": user.worker.id, "username": user.worker.username }
          }

          )
          this.setState({ workers })
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
            // const Priority = t.enums(this.state.priority)
            // const Category = t.enums(this.state.Category)
            // const Status = t.enums(this.state.status)
            const PersonObj = {
              title: t.String,
              // assigned_to: t.enums(tCombEnum),

            }
            //       if (this.state.checked.includes("description")) {
            //         PersonObj['description'] = this.props.project.Description.required_input?t.String:t.maybe(t.String)
            //       }
            //       if (this.state.checked.includes("assigned_to")) {
            //         PersonObj['assigned_to'] = this.props.project.assigned_to.required_input?t.enums(tCombEnum):t.maybe(t.enums(tCombEnum))
            //       }
            //       if (this.state.checked.includes("Category")) {
            //         PersonObj['Category'] =this.props.project.Category.required_input?Category: t.maybe(Category)
            //       }
            //       if (this.state.checked.includes("priority")) {
            //         PersonObj['priority'] = this.props.project.priority.required_input?Priority:t.maybe(Priority)
            //       }
            //       if (this.state.checked.includes("status")) {
            //         PersonObj['status'] = this.props.project.status.required_input?Status:t.maybe(Status)
            //       }
            //       if (this.state.checked.includes("due_date")) {
            //         PersonObj['due_date'] = this.props.project.due_date.required_input?t.Date:t.maybe(t.Date)
            //       }
            //       if (this.state.checked.includes("work_order")) {
            //         PersonObj['work_order'] = this.props.project.work_order.required_input?t.String:t.maybe(t.String)
            //       }
            //       const Person = t.struct(PersonObj)
            //       this.setState({ person: Person })
          })
        })
      });

    this.save = this.save.bind(this)
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
          //  this.props.onMapReady(this.map)
        }
      });
    }
  }

  checkDispatcher = () => {
    this.props.dispatchers.forEach((dispatcher) => {
      if (dispatcher.dispatcher.username == username) {
        this.setState({ auth: true })
      }
    })
  }
  init = (map) => {
    var point_feature = new ol.Feature({});
    map.on('singleclick', (e) => {
      this.setState({ point: e.coordinate, extent: map.getView().calculateExtent(map.getSize()), value: this.state })
      var point_geom = new ol.geom.Point(e.coordinate)
      point_feature.setGeometry(point_geom);
      var vector_layer = new ol.layer.Vector({ source: new ol.source.Vector({ features: [point_feature] }) })
      var style = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          anchor: [0.5, 45],
          // offset: [0, 20],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: URLS.static + 'marker.png'
        }))
      });
      vector_layer.setStyle(style);
      map.addLayer(vector_layer);
    })
  }

  save() {

    if (this.refs.comment) {
      this.setState({ comment: this.refs.comment.value })
    }
    if (this.refs.image) {
      this.setState({ image: this.refs.image.value })
    }
    var value = this.state;
    if (value) {
      var project = { "project": { "pk": id } }
      if (this.state.point.length) {
        var mapconf = { "x": this.state.point[0], "y": this.state.point[1], "extent": this.state.extent.toString() }
        var copy1 = Object.assign(mapconf, value);
        var copy = Object.assign(project, copy1);
      }
      else {
        var copy = Object.assign(project, value);
      }

      this.setState({ loading: true })
      var url = '/apps/cartoview_workforce_manager/api/v1/task/'
      fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: new Headers({ "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() }),
        body: JSON.stringify(copy)
      })
        .then(function (response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server", response);
          }
          return response.json()
        }).then((data) => {

          if (this.state.comment != "") {
            var comment = { "comment": this.refs.comment.value, "task": { "pk": data.id } }
            var url = '/apps/cartoview_workforce_manager/api/v1/comment/'
            fetch(url, {
              method: "POST",
              credentials: "same-origin",
              headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
              }),
              body: JSON.stringify(comment)
            })
              .then(function (response) {

                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }

              }).then(() => {
                this.setState({ commentDone: true }, () => {

                })

              })

          }
          else {
            this.setState({ commentDone: true })
          }


          if (this.state.image != "") {
            console.log("image not empty")
            var formdata = new FormData();

            formdata.append('task', "/apps/cartoview_workforce_manager/api/v1/task/" + data.id + "/");
            formdata.append('image', this.refs.image.files[0])

            var url = '/apps/cartoview_workforce_manager/api/v1/attachment/'
            fetch(url, {
              method: "POST",
              credentials: "same-origin",
              headers: new Headers({}),
              body: formdata
            })
              .then(function (response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response

              }).then(() => {
                console.log("done")
                this.setState({ imageDone: true })

              })
          }
          else {
            this.setState({ imageDone: true })
          }

          this.setState({ "success": true, "loading": false })


        })
    }
  }
  sendImg = () => {
    let data = new FormData();
    data.append('action', 'ADD');
    data.append('task', `/apps/cartoview_workforce_manager/api/v1/task/${this.props.task}/`);
    data.append('image', this.refs.img.files[0])
    var url = '/apps/cartoview_workforce_manager/api/v1/attachment/'
    fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: new Headers({}),
      body: data
    })
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response

      }).then(() => {

      })


  }
  componentWillMount() {
    this.checkDispatcher()
  }
  componentDidMount() {
    console.log(this.props.children)
    if (this.state.next) {
      this.map.setTarget(ReactDOM.findDOMNode(this.refs.map));
      console.log("nect")
    }
    console.log(this.refs.map)
    this.update(this.props.mapid);
    this.init(this.map)
    setTimeout(() => {
      this.map.updateSize()
      this.map.render()
    }, 3000)

  }

  next = () => {
    console.log(this.state.step)
    var value = {
      "title": this.state.title,
      "description": this.state.description,
      "priority": this.state.priorityValue,
      "status": this.state.statusValue,
      "Category": this.state.CategoryValue,
      "work_order": this.state.work_order,
      "assigned_to": this.state.assigned_to,
      "due_date": this.state.due_date
    }
    this.setState({ value })

    if (this.state.value) {


      var step = this.state.step + 1
      this.setState({ step: step, value: value }, () => {
        this.map.setTarget(ReactDOM.findDOMNode(this.refs.map))
      })

    }

    if (this.state.step == 2) {
      var step = this.state.step + 1
      this.setState({ step: step, value: this.state.value })
    }


    console.log(this.state)

  }
  prev = () => {
    if (this.state.step == 3) {
      if (this.refs.comment) {
        this.setState({ comment: this.refs.comment.value })
      }
      if (this.refs.image) {
        console.log("resssssssssss", this.refs.image.value)
        this.setState({ image: this.refs.image.value }, console.log(this.state))
      }
    }
    this.setState({ step: --this.state.step }, () => {
      console.log("dec step")
      if (this.state.step == 2) {
        this.map.setTarget(ReactDOM.findDOMNode(this.refs.map))
      }


    })

  }
  check = () => {

  }
  componentWillReceiveProps(nextProps) {

    console.log("will")
    this.setState({ success: false, value: "", step: 1, point: [], comment: null })

  }

  renderComments() {
    return (<div>
      <div>
        <label>Add comment </label>
        <textarea ref="comment" className="form-control" rows="3" id="comment" defaultValue={this.state.comment} ></textarea>
      </div>

    </div>
    )
  }

  handleChange = name => event => {
    console.log(event.target.value)
    // console.log(this.state.title)
    this.state[name] = event.target.value
    this.setState({ [name]: event.target.value }, console.log(this.state));
  };
  renderImage() {
    return (<div>
      <label> Add Photo </label>
      <input type="file" className="form-control" ref="image" name="image" defaultValue={this.state.image} style={{ "marginBottom": "2%" }} />
    </div>
    )
  }
  render() {
    const { classes } = this.props
    return (
      <div>
        <Grid container direction={"row"} spacing={16} align="center" justify="center">
          <Grid item sm={8}>
            {this.state.auth && this.state.step == 1 &&



              <Paper style={{ "paddingBottom": "10%", "padding": "5%" }}>
                <br />
                {this.state.workers &&
                  <div>

                    <form className={classes.container} autoComplete="off">
                      <TextField
                        fullWidth
                        required
                        label="Title"
                        className={classes.textField}
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        margin="normal"
                      />
                      <br />
                      {this.state.checked.includes("description") && <TextField

                        label="Description"
                        className={classes.textField}
                        value={this.state.description}
                        multiline
                        rowsMax="4"
                        onChange={this.handleChange('description')}
                        margin="normal"
                      />}<br />
                      {this.state.checked.includes("assigned_to") && <TextField
                        select
                        label="Assigned To"
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        className={classes.textField}
                        value={this.state.assigned_to}
                        onChange={this.handleChange('assigned_to')}
                        margin="normal"
                      >
                        {this.state.workers.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.username}
                          </MenuItem>
                        ))}
                      </TextField>}
                      <br />
                      {this.state.checked.includes("due_date") && <TextField
                        type="date"
                        label="Due Date"
                        className={classes.textField}
                        value={this.state.due_date}
                        onChange={this.handleChange('due_date')}
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />}
                      <br />
                      {this.state.checked.includes("priority") && <TextField
                        select
                        label="priority"
                        className={classes.textField}
                        SelectProps={{

                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        value={this.state.priorityValue}
                        onChange={this.handleChange('priorityValue')}
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
                        select
                        label="status"
                        className={classes.textField}
                        SelectProps={{

                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        value={this.state.statusValue}
                        onChange={this.handleChange('statusValue')}
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
                        select
                        label="Category"
                        className={classes.textField}
                        SelectProps={{

                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        value={this.state.CategoryValue}
                        onChange={this.handleChange('CategoryValue')}
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

                        label="Work Order"
                        className={classes.textField}
                        defaultValue={this.state.work_order}
                        onChange={this.handleChange('work_order')}
                        margin="normal"
                      />}

                    </form>

                    <Button  raised className={classes.button} style={{ "float":"right"}} onClick={this.next} >Next <i className="fa fa-arrow-right"></i></Button>

                  </div>



                }

              </Paper>
            }
            {this.state.step == 2 && !this.state.success &&
              <Paper style={{ "paddingBottom": "10%" }}>
                <label style={{ padding: "1%" }}>Click to Add Task Location</label>
                {!this.state.point.length && <small> (loctaion is not set)</small>
                }
                <div style={{ height: "100%" }} ref="map" className={'map-ct'}>
                  {this.props.children}
                </div>
                <Button  raised className={classes.button} style={{ "float":"right",margin: "1%"}} onClick={this.next} > Next <i className="fa fa-arrow-right"></i></Button>
                <Button  raised className={classes.button} style={{ "float":"right",margin: "1%"}} onClick={this.prev}> <i className="fa fa-arrow-left"></i>Back</Button>
              </Paper>}
            {this.state.step == 3 && !this.state.success && <Paper style={{ "padding": "4%", "paddingBottom": "10%" }}>
              {this.renderComments()}
              {this.renderImage()}
              {/* <Button  raised className={classes.button} loading={this.state.loading} className="btndefault pull-right" style={{ "float":"right",margin: "1%"}} spinColor="#444" onClick={this.save}  >Save</Button> */}
              <Button  raised className={classes.button} className="btndefault pull-right" style={{ "float":"right",margin: "1%"}} onClick={this.save}  >Save</Button>
            
              <Button  raised className={classes.button} style={{ "float":"right",margin: "1%"}} onClick={this.prev}> <i className="fa fa-arrow-left"></i>Back</Button>

            </Paper>}
            {this.state.success &&
              <div className="succ">
                <p> Your Task was created successfully.</p>
              </div>

            }

            {!this.state.auth && <div >
              <br />
              <div className="danger">
                <p> Only Dispatchers can create new task </p>
              </div>
            </div>}

            <div ></div>
          </Grid>
        </Grid>
      </div>
    )
  }
}
export default withStyles(styles)(AddTask)
