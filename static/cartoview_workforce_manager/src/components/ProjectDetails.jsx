import React, {Component} from 'react';
import {getCRSFToken} from '../helpers/helpers.jsx'
import Paper from 'material-ui/Paper';
import ShowAllLocationMap from './showAllLocationMap.jsx';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import Grid from 'material-ui/Grid';
export default class ProjectDetails extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
            project: "",

        }

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

                this.setState({project: data})
            });

    }

    componentDidMount() {

    }

    render() {
        const classes=this.props.classes
        return (
        <Grid container spacing={0} align="center" justify="center">
            <Grid item xs={12} sm={12} md={8} lg={8}>
                {this.state.project && 
               <Paper>
                  <div className={classes.root} >
                        <List>
                            <ListItem > 
                            <p> <b>Project Title </b>: {this.state.project.title}</p>
                            </ListItem>
                                <Divider />
                            <ListItem >
                            <p> <b>Project Abstract </b>: {this.state.project.abstract} </p>
                            </ListItem>
                            <Divider />
                            <ListItem >
                            <p><b>Project was created by </b> : {this.state.project.owner} </p>
                            </ListItem>
                            <Divider />
                            <ListItem >
                            <div>
                            <p><b>Project Dispatchers </b> : </p>
                            <br/>
                            {this.props.project.dispatchers.map((dispatcher, i) => {
                                  return <p key={i}> {dispatcher.username}</p>
                                                        })}
                                                        </div>
                            </ListItem>
                            <Divider />
                            <ListItem >
                            <div>
                            <p><b>Project Workers </b> : </p>
                            <br/>
                            {this.props.workers.map((worker, i) => {
                                  return <p key={i}>{worker.worker.username}</p>
                                                        })}
                             </div>
                            </ListItem>
                            <Divider />
                            <ListItem style={{"display":"block"}}>
                                <p><b>Project map</b></p>
                                <ShowAllLocationMap mapId={this.props.mapid} project={this.state.project.id} />
                            </ListItem>
                            <Divider />
                        </List>
                    
                        
                        </div>
                </Paper>
                }
               </Grid>
               </Grid>
           )
    }
}
