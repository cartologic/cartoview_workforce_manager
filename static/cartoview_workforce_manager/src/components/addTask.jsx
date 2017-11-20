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
import UploadIcon from 'material-ui-icons/FileUpload';

import CommentIcon from 'material-ui-icons/Comment';
import LocationIcon from 'material-ui-icons/LocationOn'; const Form = t.form.Form;
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';
import MobileStepper from 'material-ui/MobileStepper';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import { CircularProgress } from 'material-ui/Progress';
import { DatePicker, local } from 'rd-react-datepicker';
const drawerWidth = 240



const styles = theme => ({
  root: {
    // width: '100%',
    // height: 'auto', marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    // overflow: 'overlay'
  },
  appFrame: {
  
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
    marginLeft: 10,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    
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
      Description: "",
      assigned_to: null,
      due_date: null,
      priority: "",
      status: "",
      work_order: "",
      Category: ""
      ,
      priorityList: null,
      CategoryList: null,
      statusList: null,
      checked: this.props.project.Project_config,
      loading: false,
      step: 0,
      comment: "",
      image: "",
      commentDone: false,
      imageDone: false,
      commentValue:"",
      clicked:false,
      due_dat:null
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
          this.setState({ priorityList: priority, CategoryList: Category, statusList: status }, () => {
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

    
    if (this.refs.image) {
      this.setState({ image: this.refs.image.value })
    }
    console.log("value",this.state.value)
    
    var value = this.state.value;
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
console.log("copy",copy)
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

          if (this.state.commentValue != "") {
            var comment = { "comment": this.state.commentValue, "task": { "pk": data.id } }
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

          this.setState({ "success": true, "loading": false , 
    title:"",Category:"",assigned_to:null,priority:"",status:"",work_order:"" ,Description:"",due_date:null,due_dat:null,step:0,clicked:false})


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
      "description": this.state.Description,
      "priority": this.state.priority,
      "status": this.state.status,
      "Category": this.state.Category,
      "work_order": this.state.work_order,
       "assigned_to": this.state.assigned_to?{pk:this.state.assigned_to}:null,
       "due_date": this.state.due_date
    }
  
    this.setState({ value ,clicked:true},()=>{
      console.log(value)
      if(!this.validate("title")&&!this.validate("Description")&&!this.validate("Category")&&!this.validate("work_order")&&!this.validate("assigned_to")&&!this.validate("status")&&!this.validate("priority")&&!this.validate("due_date")){
      var step = this.state.step + 1
      this.setState({ step: step, value: value }, () => {
        this.map.setTarget(ReactDOM.findDOMNode(this.refs.map))
      })
      }
    })

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
    this.setState({ success: false, value: "", point: [], comment: null,
    title:"",Category:"",assigned_to:null,priority:"",status:"",work_order:"" ,Description:"",due_dat:null,due_date:null,step:0,clicked:false})

  }

  renderComments() {
    return (<div>
      <div style={{"marginLeft": "4%"}}>
       
        {/* <textarea ref="comment" className="form-control" rows="3" id="comment" defaultValue={this.state.comment} ></textarea> */}
        <TextField
                        ref="comment"
                        id="comment"
                        defaultValue={this.state.comment}
                        onChange={this.handleChange('commentValue')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Add Comment"

                        fullWidth
                        margin="normal"
                    />
      </div>

    </div>
    )
  }

  handleChooseFileClick=()=> {
    setTimeout(() => {
      this._inputLabel.click();
    }, 50);
  }
 handleRequestClose = () => {
    this.setState({ success: false});
  };

  handleChange = name => event => {
    console.log(event.target.value)
    // console.log(this.state.title)
    this.state[name] = event.target.value
    this.setState({ [name]: event.target.value }, console.log(this.state));
  };
  renderImage() {
    return (<div className={"photo"}>
     
      <div>
      <input type="file" name="file" ref="image" id="file" className="input-file"  defaultValue={this.state.image} style={{ "marginBottom": "2%" }} />
        
  
  <label htmlFor="file" ref={x => this._inputLabel = x} className="para">
    <Button dense fab color="primary" label="Choose a File" onTouchTap={this.handleChooseFileClick.bind(this)}>
    <UploadIcon/>
   
    </Button>
    &nbsp; Upload Photo
  </label>
</div>
    

    </div>
    )
  }
  validate=(field)=>{

    console.log("this.state[field]",this.props.project.field)
    if (field=="title"&&!this.state[field]){
     return true
    }
   else{ console.log("----->",field,this.state.checked.includes(field),this.state[field])
  if  ( this.props.project[field].required_input&&!this.state[field]){
    console.log("in if",field)
    return true
  }}
  return false
  }
  render() {
    const { classes } = this.props
    return (
      <div>
        <Grid container direction={"row"} spacing={16} align="center" justify="center">
          <Grid item xs={12} sm={12} md={9} lg={10}>
            {this.state.auth && this.state.step == 0 &&



              <Paper style={{ "padding":"10%" }}>
              
                {this.state.workers &&
                  <div>

                    <form className={classes.container} autoComplete="off">
                      <TextField
                       fullWidth
                       
                        error={this.state.clicked&&this.validate("title")}
                        label="Title"
                        className={classes.textField}
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        margin="normal"
                      />
                      <br />
                      {this.state.checked.includes("description") && <TextField
                       fullWidth

                        label="Description"
                        error={this.state.clicked&&this.validate("Description")}
                        className={classes.textField}
                        value={this.state.Description}
                        multiline
                        rowsMax="4"
                        onChange={this.handleChange('Description')}
                        margin="normal"
                      />}<br />
                      {this.state.checked.includes("assigned_to") && <TextField
                       error={this.state.clicked&&this.validate("assigned_to")}
                       fullWidth
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
                     
                      {this.state.checked.includes("due_date") &&     
                       <div style={{marginLeft:"1%","marginTop": "7%"}}>
                      <p  className={"datepicker"}> Due Date</p> 
                      <DatePicker
                      placeholder="date"
                        value={this.state.due_dat}
                        
                        change={(newDate) => {this.setState({due_dat: newDate,due_date:newDate._d}) }} />
                      
                      </div>}
                      <br />
                      {this.state.checked.includes("priority") && 
                      <TextField
                       error={this.state.clicked&&this.validate("priority")}
                       fullWidth
                        select
                        label="priority"
                        className={classes.textField}
                        SelectProps={{

                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        value={this.state.priority}
                        onChange={this.handleChange('priority')}
                        margin="normal"
                      >
                        {this.state.priorityList.map(option => (
                          <MenuItem key={option.label} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>}
                      <br />
                      {this.state.checked.includes("status") && 
                      <TextField
                       error={this.state.clicked&&this.validate("status")}
                       fullWidth
                        select
                        label="status"
                        className={classes.textField}
                        SelectProps={{

                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        value={this.state.status}
                        onChange={this.handleChange('status')}
                        margin="normal"
                      >

                        {this.state.statusList.map(option => (
                          <MenuItem key={option.label} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>}
                      <br />
                      {this.state.checked.includes("Category") && 
                      <TextField
                       error={this.state.clicked&&this.validate("Category")}
                       fullWidth
                        select
                        label="Category"
                        className={classes.textField}
                        SelectProps={{

                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        value={this.state.Category}
                        onChange={this.handleChange('Category')}
                        margin="normal"
                      >
                        {this.state.CategoryList.map(option => (
                          <MenuItem key={option.label} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>}
                      <br />
                      {this.state.checked.includes("work_order") && 
                      <TextField
                       error={this.state.clicked&&this.validate("work_order")}
                       fullWidth

                        label="Work Order"
                        className={classes.textField}
                        defaultValue={this.state.work_order}
                        onChange={this.handleChange('work_order')}
                        margin="normal"
                      />}
                      
                    </form>


                  </div>



                }

              </Paper>
            }
            {this.state.step == 1 && !this.state.success &&
              <Paper style={{ "paddingBottom": "10%" }}>
                <p style={{ padding: "2%" }}>Click to Add Task Location
            {!this.state.point.length && <small> (loctaion is not set)</small>}</p>
                
                <div style={{ height: "250px" }} ref="map" className={'map-ct'}>
                  {this.props.children}
                </div>
                </Paper>}
            {this.state.step == 2 && !this.state.success && <Paper style={{ "padding": "4%", "paddingBottom": "10%" }}>
              {this.renderComments()}
              {this.renderImage()}
             
            </Paper>}
            {this.state.success &&
             
      
        <Snackbar
          open={this.state.success}
          onRequestClose={this.handleRequestClose}
          transition={Fade}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Your Task was created successfully</span>}
        />
  

            }

            {!this.state.auth && <div >
              <br />
              <div className="danger">
                <p> Only Dispatchers can create new task </p>
              </div>
            </div>}

            <div ></div>
                     {this.state.workers &&
                     <Paper><MobileStepper
        type="dots"
        steps={3}
        position="static"
        activeStep={this.state.step}
        className={classes.root}
         
        nextButton={
          this.state.step!=2?<Button dense onClick={this.next} >
          Next
            {<KeyboardArrowRight /> }
          </Button>:<Button dense onClick={this.save} >
          {this.state.loading&&<CircularProgress className={classes.progress} />}
          Save
            {<KeyboardArrowRight /> }
          </Button>
          


        }
        backButton={
          <Button dense onClick={this.prev} disabled={this.state.step === 0}>
            {<KeyboardArrowLeft />}
            Back
          </Button>
        }
      /></Paper>}
          </Grid>
        </Grid>
          
      </div>
    )
  }
}
export default withStyles(styles)(AddTask)