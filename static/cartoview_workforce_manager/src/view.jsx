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
import List, { ListItem, ListItemSecondaryAction, ListItemIcon, ListItemText } from 'material-ui/List';
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
import { MuiThemeProvider } from 'material-ui/styles';

injectTapEventPlugin();
addLocaleData(enLocaleData);
const drawerWidth = 250;

const styles = theme => {

    return ({

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
            marginLeft: drawerWidth + 100,
            width: `calc(100% - ${drawerWidth + 50}px)`,
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
}



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
            category: "",
            work_order: "",
            created_by: "",
            assigned_to: "",
            filter: [],
            result: false,
            selectedtask2: "", currentComponent: "list",
            pageCount: 0,
            perPage: 7,
            pagedTasks: [],
            selected: null,
            filtertask: null,
            flag: false,
            page: "tasks",
            filterMenu: false,
            open: false,
            filterOpen: false,


        }
        this.loadTasks()
        this.loadProject()
        this.loadWorkers()
        this.loadDispatchers()

    }

    openFilterMenu = () => {
        this.setState({ page: "tasks", filterOpen: !this.state.filterOpen });
    };

    sendFilter = () => {
        this.setState({ page: "tasks" })
        var priority = "", status = "", work_order = "", worker = "", dispatcher = "", category = ""
        if (this.state.priority) {

            priority = "priority=" + this.state.priority + "&"
        }
        if (this.state.category) {

            category = "Category=" + this.state.category + "&"
        }
        if (this.state.status) {
            status = "status=" + this.state.status + "&"
        }
        if (this.state.work_order) {
            work_order = "work_order=" + this.state.work_order + "&"
        }
        if (this.state.created_by) {
            dispatcher = "created_by__username=" + this.state.created_by + "&"
        }
        if (this.state.assigned_to) {
            worker = "assigned_to__username=" + this.state.assigned_to + "&"
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
                    // this.state.priority ? this.refs.priority = "" : false
                    // this.refs.category ? this.refs.category = "" : false
                    // this.refs.status ? this.refs.status = "" : false
                    // this.refs.worker ? this.refs.worker = "" : false
                    // this.refs.work_order ? this.refs.work_order = "" : false
                    // this.refs.dispatcher ? this.refs.dispatcher = "" : false
                    this.setState({
                        priority: "", status: "", category: "", work_order: "", assigned_to: "",
                        created_by: ""
                    })

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
    handleFilter = name => event => {
        this.setState({
            [name]: event.target.value,
        }, console.log(this.state));
    };

    myProjects = () => {
        window.location.href = '/apps/appinstances/?app__title=Cartoview%20Workforce%20Manager&limit=100&offset=0&owner__username=' + username
    }
    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };
    renderAppBar = () => {
        const { classes } = this.props;
        return (<div className={classes.root}>
            <div className={classes.appFrame}>
                <AppBar className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
                    <Toolbar disableGutters={!this.state.open}>
                        <IconButton
                            color="contrast"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, this.state.open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" noWrap>
                            Responsive drawer
              </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    type="persistent"
                    style={{
                        paper: classes.drawerPaper, "width": "200px"
                    }}
                    open={this.state.open}
                >
                    <div className={classes.drawerInner}>

                        <Divider />
                        <List>
                            <ListItem dense button style={{
                                paper: classes.drawerPaper, "width": "250px"
                            }}>
                                <Avatar src={this.state.project.logo ? this.state.project.logo.base64 : URLS.static + 'nologo.png'} />
                                <ListItemText primary={this.state.project.title} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={this.handleDrawerClose}>

                                        <ChevronLeftIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />

                            <ListItem dense button onClick={() => {
                                this.setState({ "selectedtask": null, result: false, page: "tasks" })
                                this.loadTasks()
                            }} >
                                <ListItemIcon>
                                    <AssignmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Tasks" />
                            </ListItem>
                            <ListItem dense button onClick={() => this.setState({ currentComponent: "add", page: "new" })}
                            >
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary='New Task' />
                            </ListItem>
                            <ListItem dense button onClick={this.openFilterMenu}>
                                <ListItemIcon>
                                    <FindIcon />
                                </ListItemIcon>
                                <ListItemText primary="Filters" />
                                {this.state.filterOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={this.state.filterOpen} transitionDuration="auto" unmountOnExit>
                                <ListItem className={classes.nested}>
                                    {<ul  >
                                        {this.state.project.priority && this.state.project.Project_config.includes("priority") &&

                                            <TextField
                                                style={{ "width": "200px" }}
                                                id="priority"
                                                value={this.state.priority}
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                        className: classes.menu,
                                                    },
                                                }}
                                                className={styles.textField}
                                                onChange={this.handleFilter('priority')}
                                                helperText="Filter By Priority"
                                                margin="normal">

                                                {this.state.project.priority.priority.map(option => (
                                                    <MenuItem key={option.label} value={option.label}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        }
                                        <br />
                                        {this.state.project.status && this.state.project.Project_config.includes("status") &&
                                            <TextField
                                                style={{ "width": "200px" }}
                                                id="status"
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                        className: styles.menu,
                                                    },
                                                }}
                                                className={styles.textField}


                                                value={this.state.status}
                                                onChange={this.handleFilter('status')}
                                                helperText="Filter By Status"
                                                margin="normal">

                                                {this.state.project.status.status.map(option => (
                                                    <MenuItem key={option.label} value={option.label}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        }  <br />
                                        {this.state.project.Category && this.state.project.Project_config.includes("Category") &&

                                            <TextField
                                                style={{ "width": "200px" }}
                                                id="category"
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                        className: styles.menu,
                                                    },
                                                }}
                                                className={styles.textField}


                                                value={this.state.category}
                                                onChange={this.handleFilter('category')}
                                                helperText="Filter By Category"
                                                margin="normal">

                                                {this.state.project.Category.Category.map(option => (
                                                    <MenuItem key={option.label} value={option.label}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>}

                                        <br />
                                        {this.state.project.Project_config.includes("work_order") &&


                                            <TextField
                                                id="workorder"
                                                label="work_order"
                                                className={classes.textField}
                                                value={this.state.work_order}
                                                onChange={this.handleFilter('Work_order')}
                                                margin="normal"
                                            />
                                        }
                                        <br />
                                        {this.state.dispatchers &&
                                            <TextField
                                                style={{ "width": "200px" }}
                                                id="dispatcher"
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                        className: styles.menu,
                                                    },
                                                }}
                                                className={styles.textField}
                                                value={this.state.created_by}
                                                onChange={this.handleFilter('created_by')}
                                                helperText="Filter By Creator "
                                                margin="normal">

                                                {this.state.dispatchers.map(option => (
                                                    <MenuItem key={option.dispatcher.username} value={option.dispatcher.username}>
                                                        {option.dispatcher.username}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        }
                                        <br />
                                        {this.state.project.Project_config.includes("assigned_to") && this.state.project &&
                                            <TextField
                                                style={{ "width": "200px" }}
                                                id="assignee"
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                        className: styles.menu,
                                                    },
                                                }}
                                                className={styles.textField}
                                                value={this.state.assigned_to}
                                                onChange={this.handleFilter('assigned_to')}
                                                helperText="Filter By assignee "
                                                margin="normal">
                                                {this.state.workers.map(option => (
                                                    <MenuItem key={option.worker.username} value={option.worker.username}>
                                                        {option.worker.username}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        }
                                        <Button raised color="primary" style={{ "marginLeft": "50%" }} onClick={this.sendFilter} >Filter </Button>

                                    </ul>}
                                </ListItem>
                            </Collapse>
                            <ListItem dense button onClick={() => this.setState({ currentComponent: "details", page: "details" })}>
                                <ListItemIcon>
                                    <AssignmentIcon />
                                </ListItemIcon>
                                <ListItemText primary='Project Details' />
                            </ListItem>

                            <ListItem dense button onClick={this.myProjects}>
                                <ListItemIcon>
                                    <WorkIcon />
                                </ListItemIcon>
                                <ListItemText primary='My Projects' />
                            </ListItem>

                            <ListItem dense button onClick={() => this.setState({ page: "about" })}>
                                <ListItemIcon>
                                    <InfoIcon />
                                </ListItemIcon>
                                <ListItemText primary='About' />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>

            </div>
        </div>)
    }


    renderResponsiveDrawer = () => {
        const { classes, theme } = this.props;

        const drawer = (
            <div className={classes.drawerInner}>

                <Divider />
                <List>
                    <ListItem dense button style={{
                        paper: classes.drawerPaper,
                    }}>
                        <Avatar src={this.state.project.logo ? this.state.project.logo.base64 : URLS.static + 'nologo.png'} />
                        <ListItemText primary={this.state.project.title} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={this.handleDrawerClose}>

                                <ChevronLeftIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem dense button onClick={() => {
                        this.setState({ "selectedtask": null, result: false, page: "tasks" })
                        this.loadTasks()
                    }} >
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </ListItem>
                    <ListItem dense button onClick={() => this.setState({ currentComponent: "add", page: "new" })}
                    >
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary='New Task' />
                    </ListItem>
                    <ListItem dense button onClick={this.openFilterMenu}>
                        <ListItemIcon>
                            <FindIcon />
                        </ListItemIcon>
                        <ListItemText primary="Filters" />
                        {this.state.filterOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.filterOpen} transitionDuration="auto" unmountOnExit>
                        <ListItem className={classes.nested}>
                            {<ul  >
                                {this.state.project.priority && this.state.project.Project_config.includes("priority") &&

                                    <TextField
                                        style={{ "width": "200px" }}
                                        id="priority"
                                        value={this.state.priority}
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                className: classes.menu,
                                            },
                                        }}
                                        className={styles.textField}
                                        onChange={this.handleFilter('priority')}
                                        helperText="Filter By Priority"
                                        margin="normal">

                                        {this.state.project.priority.priority.map(option => (
                                            <MenuItem key={option.label} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }
                                <br />
                                {this.state.project.status && this.state.project.Project_config.includes("status") &&
                                    <TextField
                                        style={{ "width": "200px" }}
                                        id="status"
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                className: styles.menu,
                                            },
                                        }}
                                        className={styles.textField}


                                        value={this.state.status}
                                        onChange={this.handleFilter('status')}
                                        helperText="Filter By Status"
                                        margin="normal">

                                        {this.state.project.status.status.map(option => (
                                            <MenuItem key={option.label} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }  <br />
                                {this.state.project.Category && this.state.project.Project_config.includes("Category") &&

                                    <TextField
                                        style={{ "width": "200px" }}
                                        id="category"
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                className: styles.menu,
                                            },
                                        }}
                                        className={styles.textField}


                                        value={this.state.category}
                                        onChange={this.handleFilter('category')}
                                        helperText="Filter By Category"
                                        margin="normal">

                                        {this.state.project.Category.Category.map(option => (
                                            <MenuItem key={option.label} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>}

                                <br />
                                {this.state.project.Project_config.includes("work_order") &&


                                    <TextField
                                        id="workorder"
                                        label="work_order"
                                        className={classes.textField}
                                        value={this.state.work_order}
                                        onChange={this.handleFilter('Work_order')}
                                        margin="normal"
                                    />
                                }
                                <br />
                                {this.state.dispatchers &&
                                    <TextField
                                        style={{ "width": "200px" }}
                                        id="dispatcher"
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                className: styles.menu,
                                            },
                                        }}
                                        className={styles.textField}
                                        value={this.state.created_by}
                                        onChange={this.handleFilter('created_by')}
                                        helperText="Filter By Creator "
                                        margin="normal">

                                        {this.state.dispatchers.map(option => (
                                            <MenuItem key={option.dispatcher.username} value={option.dispatcher.username}>
                                                {option.dispatcher.username}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }
                                <br />
                                {this.state.project.Project_config.includes("assigned_to") && this.state.project &&
                                    <TextField
                                        style={{ "width": "200px" }}
                                        id="assignee"
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                className: styles.menu,
                                            },
                                        }}
                                        className={styles.textField}
                                        value={this.state.assigned_to}
                                        onChange={this.handleFilter('assigned_to')}
                                        helperText="Filter By assignee "
                                        margin="normal">
                                        {this.state.workers.map(option => (
                                            <MenuItem key={option.worker.username} value={option.worker.username}>
                                                {option.worker.username}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }
                                <Button raised color="primary" style={{ "marginLeft": "50%" }} onClick={this.sendFilter} >Filter </Button>

                            </ul>}
                        </ListItem>
                    </Collapse>
                    <ListItem dense button onClick={() => this.setState({ currentComponent: "details", page: "details" })}>
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary='Project Details' />
                    </ListItem>

                    <ListItem dense button onClick={this.myProjects}>
                        <ListItemIcon>
                            <WorkIcon />
                        </ListItemIcon>
                        <ListItemText primary='My Projects' />
                    </ListItem>

                    <ListItem dense button onClick={() => this.setState({ page: "about" })}>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary='About' />
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <AppBar className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
                        <Toolbar disableGutters={!this.state.open}>
                            <IconButton
                                color="contrast"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(classes.menuButton, this.state.open && classes.hide)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography type="title" color="inherit" noWrap>

                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                        <Drawer
                            type="temporary"

                            open={this.state.open}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            onRequestClose={this.handleDrawerClose}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden mdDown implementation="css">
                        <Drawer
                            type="persistent"
                            style={{
                                paper: classes.drawerPaper,
                            }}
                            open={this.state.open
                            }
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <main className={classes.content}>
                        <Typography type="body1" noWrap>
                            {this.renderAll()}
                        </Typography>
                    </main>
                </div>
            </div>
        );
    }

    renderAll = () => {
        return (<div id="">

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
                            <div className="container" style={{ "marginTop": "-250" }}>
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
                                                                                        {this.state.project.Project_config.includes("assigned_to") && <td>{item.assigned_to.username ? item.assigned_to.username : "-"}</td>}
                                                                                        {this.state.project.Project_config.includes("priority") && <td>{item.priority ? item.priority : '-'}
                                                                                        </td>}
                                                                                        {this.state.project.Project_config.includes("status") && <td>{item.status ? item.status : '-'}
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
        </div>)
    }
    render() {
        console.log(this.props)
        let { currentComponent } = this.state
        return (
            <div >
                {this.renderAppBar()}
                {this.renderAll()}

            </div>
        )
    }
}

ReactClient.childContextTypes = {
    muiTheme: React.PropTypes.object
};
ReactClient.propTypes = {
    classes: PropTypes.object.isRequired,
};
let App = withStyles(styles)(ReactClient)
export default withStyles(styles)(ReactClient)
render(
    <MuiThemeProvider >
        <App />
    </MuiThemeProvider>
    , document.getElementById('root'))

