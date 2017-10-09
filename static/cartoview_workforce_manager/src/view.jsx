import React from 'react';
import { render } from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import './app.css';
import AddTask from './components/addTask';
import ProjectDetails from './components/ProjectDetails';
import MyTasks from './components/myTasks';
import { getCRSFToken } from './helpers/helpers.jsx'
import TaskDetails from './components/taskDetails.jsx'
import './css/project.css'
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import ReactPaginate from 'react-paginate';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemSecondaryAction,ListItemIcon, ListItemText } from 'material-ui/List';
import AssignmentIcon from 'material-ui-icons/Assignment';
import AddIcon from 'material-ui-icons/PlaylistAdd';
import InfoIcon from 'material-ui-icons/InfoOutline';
import WorkIcon from 'material-ui-icons/Work';
import FindIcon from 'material-ui-icons/FindInPage';
import DetailsIcon from 'material-ui-icons/ChromeReaderMode';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import StarBorder from 'material-ui-icons/StarBorder';
import Collapse from 'material-ui/transitions/Collapse';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
injectTapEventPlugin();
addLocaleData(enLocaleData);
const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
    row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },


  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menu: {
    width: 200,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: '25%',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
   nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  content: {
    width: '100%',
    marginLeft: -drawerWidth,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64,
      },
    },
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});

class ReactClient extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            project: { Project_config: [] },
            tasks: "",
            workers: "",
            dispatchers: "",
            tasks: [],
            selectedtask: null,
            priority: "",
            status: "",
            filter: [],
            result: false,
            selectedtask2: "", currentComponent: "list",
            pageCount: 0,
            perPage: 7,
            pagedTasks: [],
            category: "",
            selected: null,
            filtertask: null,
            flag: false,
            page: "tasks",
            filterMenu: false,
            open:false,
            filterOpen:false,


        }
        this.loadTasks()
        this.loadProject()
        this.loadWorkers()
        this.loadDispatchers()

    }

openFilterMenu = () => {
    this.setState({ page:"tasks",filterOpen: !this.state.filterOpen });
  };

    sendFilter = () => {
        this.setState({page: "tasks"})
        var priority = "", status = "", work_order = "", worker = "", dispatcher = "", category = ""
        if (this.state.priority) {

            priority = "priority=" + this.state.priority + "&"
        }
        if (this.refs.category.value) {

            category = "Category=" + this.refs.category.value + "&"
        }
        if (this.refs.status.value) {
            status = "status=" + this.refs.status.value + "&"
        }
        if (this.refs.work_order.value) {
            work_order = "work_order=" + this.refs.work_order.value + "&"
        }
        if (this.refs.dispatcher.value) {
            dispatcher = "created_by__username=" + this.refs.dispatcher.value + "&"
        }
        if (this.refs.worker.value) {
            worker = "assigned_to__username=" + this.refs.worker.value + "&"
        }

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/tasks/?' + priority + status + work_order + worker + dispatcher + category

        fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",

            }),

        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");

                }
                return response.json();
            }).then((data) => {
                if (data.objects.length == 0) {
                    console.log("empty")
                    this.setState({ result: true })
                }
                else {
                    this.setState({ result: false })
                }
                this.setState({ tasks: data.objects, filtertask: data.objects, loading: false, pageCount: Math.ceil(data.objects.length / this.state.perPage) }, () => {
                    var pagedTasks = this.state.tasks.slice(0, this.state.perPage);
                    this.setState({ pagedTasks: pagedTasks })
                    console.log(url, data)
                    console.log(data.objects.length)
                    // this.state.priority ? this.refs.priority.value = "" : false
                    // this.refs.category.value ? this.refs.category.value = "" : false
                    // this.refs.status.value ? this.refs.status.value = "" : false
                    // this.refs.worker.value ? this.refs.worker.value = "" : false
                    // this.refs.work_order.value ? this.refs.work_order.value = "" : false
                    // this.refs.dispatcher.value ? this.refs.dispatcher.value = "" : false

                })
            })
    }

    loadTasks = () => {
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/tasks'
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

                this.setState({ tasks: data.objects, filtertask: data.objects, loading: false, pageCount: Math.ceil(data.objects.length / this.state.perPage) }, () => {
                    var pagedTasks = this.state.tasks.slice(0, this.state.perPage);
                    this.setState({ pagedTasks: pagedTasks })
                })

            });
    }
    loadProject = () => {
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id
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

                this.setState({ project: data })
            });
    }
    loadWorkers = () => {
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

                this.setState({ workers: data.objects })
            });
    }
    handlePageClick = (data) => {
        var pagedTasks = this.state.tasks.slice(data.selected * this.state.perPage, (data.selected + 1) * this.state.perPage);
        this.setState({ pagedTasks: pagedTasks })

    }
    loadDispatchers = () => {
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/dispatchers"
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

                this.setState({ dispatchers: data.objects })
            });
    }

    componentWillMount() {

    }

    getChildContext() {
        // return { muiTheme: getMuiTheme(CustomTheme) };
    }

    componentDidMount() {

    }

    _toggleBaseMapModal() {

    }
    search = (e) => {
        e.preventDefault()

    }
    toggle = () => {
        this.setState({ filterMenu: !this.state.filterMenu })
    }
    handlePriority =name=> event => {
        console.log(event.target.value)
    this.setState({
     [name]: event.target.value,
    });
  };
     
          

           


            myProjects=()=>{
                window.location.href='/apps/appinstances/?app__title=Cartoview%20Workforce%20Manager&limit=100&offset=0&owner__username='+username
            }
            handleDrawerOpen = () => {
                    this.setState({ open: true });
                };

            handleDrawerClose = () => {
                this.setState({ open: false });
            };
            renderAppBar=()=>{
                return( <div className={styles.root}>
                            <div className={styles.appFrame}>
                            <AppBar className={classNames(styles.appBar, this.state.open && styles.appBarShift)}>
                                <Toolbar disableGutters={!this.state.open}>
                                <IconButton
                                    color="contrast"
                                    aria-label="open drawer"
                                    onClick={this.handleDrawerOpen}
                                    className={classNames(styles.menuButton, this.state.open && styles.hide)}
                                >
                                    <MenuIcon />
                                </IconButton>
                               
                                </Toolbar>
                            </AppBar>
                            <Drawer
                                type="persistent"
                                style={{
                                paper: styles.drawerPaper,"width":"200px"
                                }}
                                open={this.state.open}
                            >
                                <div className={styles.drawerInner}>
                                
                                <Divider />
                          <List>
                        <ListItem  dense button  style={{
                                paper: styles.drawerPaper,"width":"250px"
                                }}>
                                    <Avatar  src={this.state.project.logo ? this.state.project.logo.base64 : URLS.static + 'nologo.png'} />
                                    <ListItemText primary={this.state.project.title} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={this.handleDrawerClose}>
                                        
                                            <ChevronLeftIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                    </ListItem>
                                        <Divider />
                          
                        <ListItem  dense button onClick={() => {
                            this.setState({ "selectedtask": null, result: false, page: "tasks" })
                            this.loadTasks()
                        }} >  
                         <ListItemIcon>
                               <AssignmentIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Tasks"/>
                        </ListItem>

                   
                         
                        <ListItem   dense button onClick={() => this.setState({ currentComponent: "add", page: "new" })}
                        >   
                          <ListItemIcon>
                               <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary='New Task'/>
                        </ListItem>
                        
                        
                       

<ListItem dense button onClick={this.openFilterMenu}>
 <ListItemIcon>
                               <FindIcon/>
                        </ListItemIcon>
                           <ListItemText primary="Filters"/>
          {this.state.filterOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.filterOpen} transitionDuration="auto" unmountOnExit>
          <ListItem className={styles.nested}>
             { <ul  >
                            {this.state.project.priority && this.state.project.Project_config.includes("priority") &&
    
                                  <TextField
                                        style={{"width":"200px"}}
                                        id="priority"
                                        select
                                            SelectProps={{
                                            MenuProps: {
                                            className: styles.menu,
                                            },
                                        }}
                                        className={styles.textField}
                                        value="ss"
                                        
                                        value={this.state.priority}
                                        onChange={this.handlePriority('priority')}
                                        helperText="Filter By Priority"
                                        margin="normal">
                                                                       
          {this.state.project.priority.priority.map(option => (
            <MenuItem key={option.label} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
                            }
                            {this.state.project.status && this.state.project.Project_config.includes("status") &&
                                <select className="form-control" ref="status">
                                    <option value="">status</option>
                                    {this.state.project.status && this.state.project.status.status.map((status, i) => {
                                        return <option key={i} value={status.label}>{status.label}</option>
                                    })
                                    }
                                </select>
                            }
                            {this.state.project.Category && this.state.project.Project_config.includes("Category") && <select className="form-control" ref="category">
                                <option value="">category</option>
                                {this.state.project.Category && this.state.project.Category.Category.map((cat, i) => {
                                    return <option key={i} value={cat.label}>{cat.label}</option>
                                })
                                }
                            </select>}
                            {this.state.project.Project_config.includes("work_order") &&
                                <input placeholder="work order" className="form-control" ref="work_order" style={{ "margin": "5px", "width": "82%" }} />
                            }
                            {this.state.dispatchers &&
                                <select className="form-control" ref="dispatcher">
                                    <option value="">task creator</option>
                                    {this.state.dispatchers.map((dispatcher, i) => {
                                        return <option key={i} value={dispatcher.dispatcher.username}>{dispatcher.dispatcher.username}</option>
                                    })}
                                </select>}
                            {this.state.project.Project_config.includes("assigned_to") && this.state.project &&
                                <select className="form-control" id="sel1" ref="worker">
                                    <option value=""> Assignee</option>
                                    {this.state.workers.map((worker, i) => {
                                        return <option key={i} value={worker.worker.username}>{worker.worker.username}</option>
                                    })}

                                </select>}
                                    <Button raised color="primary" style={{ "marginLeft": "50%" }} onClick={this.sendFilter} >Filter </Button>
      
                        </ul>}
          </ListItem>
        </Collapse>


                        
                        <ListItem  dense button onClick={() => this.setState({ currentComponent: "details", page: "details" })}>
                            <ListItemIcon>
                               <AssignmentIcon/>
                            </ListItemIcon>
                              <ListItemText primary='Project Details'/>
                        </ListItem>
                  
                        <ListItem dense button onClick={this.myProjects}>
                         <ListItemIcon>
                               <WorkIcon/>
                        </ListItemIcon>
                          <ListItemText primary='My Projects'/>
                        </ListItem>
                      
                        <ListItem dense button onClick={() => this.setState({ page: "about" })}>
                              <ListItemIcon>
                               <InfoIcon/>
                        </ListItemIcon>
                             <ListItemText primary='About'/>
                        </ListItem>
                   

</List>












                                </div>
                            </Drawer>
                         
                            </div>
                        </div>)
            }
    render() {
        
        let { currentComponent } = this.state
        // this.state.project['Project_config']=[]
        return (
            <div >
              {this.renderAppBar()}
            
                <div id="page-content-wrapper">
                   
                    <div className="">
                        <div className="">
                            <div className="col-md-6 col-md-offset-3">
                                {this.state.loading &&
                                    <div>
                                        <div className="col-md-4"></div>
                                        <div className="col-md-4"><img src={URLS.static + 'cartoview_workforce_manager/loader'} />
                                        </div>
                                        <div className="col-md-4"></div>
                                    </div>
                                }
                                {!this.state.loading && <div className="tab-content">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="tab" role="tabpanel">
                                                    {this.state.tasks.length > 0 && !this.state.loading && this.state.page == "tasks" && <ul className="nav nav-tabs" role="tablist">
                                                        <li role="presentation" className="active" onClick={() => {
                                                            this.setState({ "selectedtask": null, result: false })
                                                            this.loadTasks()
                                                        }}><a href="#all" aria-controls="home" role="tab" data-toggle="tab"><i className="fa fa-envelope-o"></i>All Tasks</a></li>
                                                        <li onClick={() => {
                                                            this.setState({ "selectedtask": null, result: false })
                                                            this.loadTasks()
                                                        }} role="presentation"><a href="#mine" aria-controls="profile" role="tab" data-toggle="tab"><i className="fa fa-cube"></i>My tasks</a></li>
                                                    </ul>}
                                                    {this.state.page == "tasks" && <div id="home" className="tab-pane fade in active">
                                                        <div className="tab-content">
                                                            <div id="all" className="tab-pane fade in active" role="tabpanel">
                                                                <div className="">
                                                                    <br />
                                                                    {this.state.pagedTasks.length != 0 && !this.state.selectedtask && !this.state.loading &&
                                                                        <div className="" style={{ "padding": "1%" }}>
                                                                            <div className="" style={{ "overflowX": "auto" }}>
                                                                                <table className="table table-hover ">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Title</th>
                                                                                            {this.state.project.Project_config.includes("assigned_to") && <th> Assigned To</th>}
                                                                                            {this.state.project.Project_config.includes("priority") && <th>Priority</th>}
                                                                                            {this.state.project.Project_config.includes("status") && <th>Status</th>}
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {this.state.pagedTasks.map((item, i) => {
                                                                                            return <tr key={i} onClick={() => {
                                                                                                this.setState({ "selectedtask": item })
                                                                                            }} style={{ "cursor": "pointer" }}>
                                                                                                <td>{item.title}</td>
                                                                                                {this.state.project.Project_config.includes("assigned_to") && <td>{item.assigned_to.username?item.assigned_to.username:"-"}</td>}
                                                                                                {this.state.project.Project_config.includes("priority") && <td>{item.priority?item.priority:'-'}
                                                                                                </td>}
                                                                                                {this.state.project.Project_config.includes("status") && <td>{item.status?item.status:'-'}
                                                                                                </td>}
                                                                                            </tr>
                                                                                        }
                                                                                        )}
                                                                                    </tbody>
                                                                                </table>
                                                                                {this.state.pageCount > 1 && <div className="commentBox">
                                                                                    <ReactPaginate previousLabel={"previous"}
                                                                                        nextLabel={"next"}
                                                                                        breakLabel={<a href="">...</a>}
                                                                                        breakClassName={"break-me"}
                                                                                        pageCount={this.state.pageCount}
                                                                                        marginPagesDisplayed={2}
                                                                                        pageRangeDisplayed={5}
                                                                                        onPageChange={this.handlePageClick}
                                                                                        containerClassName={"pagination"}
                                                                                        subContainerClassName={"pages pagination"}
                                                                                        activeClassName={"active"} />
                                                                                </div>}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {this.state.pagedTasks.length == 0 && this.state.result && <p style={{
                                                                        "fontSize": "25px",
                                                                        "fontStyle": "oblique", "padding": "2%"
                                                                    }}>No result found !</p>}
                                                                    {
                                                                        this.state.selectedtask &&
                                                                        <div>
                                                                            <TaskDetails task={this.state.selectedtask} mapid={this.state.project.mapid} project={this.state.project} />
                                                                        </div>}
                                                                    {!this.state.tasks.length && !this.state.loading && !this.state.result && <div style={{ "padding": "5%", "textAlign": "center" }}>
                                                                        <p style={{
                                                                            "fontSize": "25px",
                                                                            "fontStyle": "oblique"
                                                                        }}>No tasks yet for this project</p>
                                                                    </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div id="mine" className="tab-pane fade" role="tabpanel">
                                                                <MyTasks id={id} project={this.state.project} selected={this.state.selected} />
                                                            </div>
                                                        </div>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.page == "new" && <div id="menu1">
                                        {this.state.project && this.state.dispatchers && currentComponent === "add" &&
                                            <AddTask project={this.state.project} mapid={this.state.project.mapid} dispatchers={this.state.dispatchers} />
                                        }
                                    </div>}
                                    {this.state.page == "details" && <div id="menu2">
                                        {this.state.workers && this.state.project && currentComponent === "details" &&
                                            <ProjectDetails id={id} project={this.state.project} mapid={this.state.project.mapid} workers={this.state.workers} />
                                        }
                                    </div>}
                                    {this.state.page == "about" &&
                                        <div id="about">
                                            <section className="success" id="about">
                                                <div className="">
                                                    <h2 className="text-center">About</h2>
                                                    <hr className="star-light" />
                                                    <div className="text-center">
                                                        <p className="para"> Cartoview app to manage project/work group tasks. It provides a full management of a task status, priority, location ,attachments and comments
                                                        </p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    }
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactClient.childContextTypes = {
    muiTheme: React.PropTypes.object
};

render(

        <ReactClient></ReactClient>
   , document.getElementById('root'))

