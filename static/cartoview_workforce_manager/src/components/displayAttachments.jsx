import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorderIcon from 'material-ui-icons/StarBorder';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
const styles = theme => ({
  root: {
   display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary[200],
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
});


class DisplayAttachments extends Component {
    getImage = () => {
        var url = '/apps/cartoview_workforce_manager/api/v1/attachment/?task__id=' + this.props.task
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
                return response.json()
            }).then((data) => {
            if (data.objects.length > 0) {
                this.setState({"flag": true})
            }
            this.setState({"attachments": data.objects})
        })

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
            headers: new Headers({ }),
            body: data
        })
            .then(function (response) {

                if (response.status >= 400) {

                    throw new Error("Bad response from server");
                }

                return response

            }).then(() => {
            this.setState({"success": true})
            this.getImage()
        })


    }

    constructor(props) {
        super(props)

        this.state = {
            attachments: [],
            flag: null,
            success: false
        }

        this.getImage()
console.log(this.props)

    }

    componentWillMount() {
        this.setState({"flag": false})
    }

    render() {

 const { classes } = this.props;
        return (
            <div>
            

      {this.state.attachments &&<div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {this.state.attachments.map((tile,i) => (
          <GridListTile key={i}>
            <img src={tile.image}  />
            <GridListTileBar
             title=""
              classes={{
                root: classes.titleBar,
            
              }}
             
            />
          </GridListTile>
        ))}
      </GridList>
    </div>}

 {this.state.attachments.length==0 && <Paper  elevation={4}>
         <p style={{"padding": "20px"}}>
          No Photos Yet
        </p>
        
      </Paper>}

            </div>

        )
    }
}
export default withStyles(styles)(DisplayAttachments);