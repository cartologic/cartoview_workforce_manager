import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';
import Img from 'react-image';
import Spinner from 'react-spinkit'
import Switch from 'react-toggle-switch'
import 'react-toggle-switch/dist/css/switch.min.css'

import Search from "./Search.jsx";


export default class ResourceSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      loading: true,
      showPagination: true,
      pageCount: 0,
      mymaps:true
    }
  console.log(this.props)
  }


  loadResources(off) {
    this.setState({loading: true})

    const limit = typeof(this.props.limit) === "undefined"
      ? 100
      : this.props.limit;

    const offset = typeof(off) === "undefined"
      ? 0
      : off;

    let userMapsFilter = this.state.mymaps
      ? ("&" +
      "owner__username" +
      "=" + this.props.username + "")
      : "";

    fetch(this.props.resourcesUrl + "?limit=" + limit + "&" + "offset=" + offset + userMapsFilter).then((response) => response.json()).then((data)=>{
      this.setState({
        resources: data.objects,
        pageCount: Math.ceil(data.meta.total_count / limit),
        loading: false
      })
    }).catch((error) => {
      console.error(error);
    });
  }


  componentDidMount() {
    this.loadResources(0)
  }


  handlePageClick = (data) => {
    let selected = data.selected;
    const offset = data.selected * this.props.limit;
    this.loadResources(offset)
  };


  handleUserMapsChecked() {
    const flag_maps=this.state.mymaps
    this.setState({mymaps:!flag_maps},()=>{
      this.props.selectMap(undefined)
      this.loadResources(0)});
  }


  searchResources(mapTitle){
    if(mapTitle){
      let url = `/api/maps/?&title__icontains=${mapTitle}`
      fetch(url, {credentials: 'include',})
      .then((res) => res.json())
      .then((resources) => {
        this.setState({resources:resources.objects, showPagination: false})
      })
    }
    else{
      // clear button
      this.setState({showPagination: true}, ()=>this.loadResources())
    }
  }


  handleSearch() {
    if (this.refs.search.value != '') {
      this.setState({loading: true});

      let userMapsFilter = this.state.mymaps
        ? ("&" +
        "owner__username" +
        "=" + this.props.username + "")
        : "";

      fetch(this.props.resourcesUrl + "?" + "title__icontains" + "=" + this.refs.search.value + userMapsFilter).then((response) => response.json()).then((data) => {
        this.setState({resources: data.objects, loading: false})
      }).catch((error) => {
        console.error(error);
      });
    }
  }


  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-5 col-md-4">
            <h4>{'Select Map'}</h4>
          </div>
          <div className="col-xs-7 col-md-8">
            {(this.props.instance ? this.props.instance : false)
              ?<button
                style={{display:"inline-block", margin:"0px 3px 0px 3px"}}
                className="btn btn-primary btn-sm pull-right" onClick={() => this.props.onComplete()}>{"next >>"}</button>
              :<button
                style={{display:"inline-block", margin:"0px 3px 0px 3px"}}
                className="btn btn-primary btn-sm pull-right disabled" onClick={() => this.props.onComplete()}>{"next >>"}</button>
            }
          </div>
        </div>
        <hr></hr>

        <div className="row" style={{paddingBottom: 10}}>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4"
            style={{display: 'flex'}}>
            <span style={{fontWeight: 500,marginRight: 10}}>{'All Maps'}</span>
          <Switch
            on={this.state.mymaps}
            onClick={this.handleUserMapsChecked.bind(this)}/>
            <span style={{fontWeight: 500,marginLeft: 10}}>{'My Maps'}</span>
          </div>

          <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8">
            <Search
              username = {this.state.mymaps===true?this.props.username:null}
              searchResources={(mapTitle)=>{this.searchResources(mapTitle)}} />
          </div>
        </div>

        {(!this.state.resources || this.state.loading) && <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3 text-center"><Spinner name="line-scale-pulse-out" color="steelblue"/></div>
        </div>}

        {!this.state.loading && this.state.resources.map((resource) => {
          return (
            <div
              onClick={() => this.props.selectMap(resource)}
              key={resource.id}
              className={(this.props.instance
              ? (this.props.instance && this.props.instance == resource.id)
              : false)
              ? "row resource-box bg-success"
              : "row resource-box"}>

              <div
                className="col-xs-12 col-sm-4 col-md-4 col-lg-4 resource-box-img-container">
                <Img
                  className="resource-box-img img-responsive"
                  src={[resource.thumbnail_url, "/static/app_manager/img/no-image.jpg"]}
                  loader={< Spinner name = "line-scale-pulse-out" color = "steelblue" />}/>
              </div>

              <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 resource-box-text">
                <h4 style={{marginTop: "2%"}}>{resource.title}</h4>
                <hr></hr>
                <p>
                  {resource.abstract.length > 30
                    ? resource.abstract.substr(0, 30) + '...'
                    : resource.abstract}
                </p>
                <div className="row">
                  <div className="col-md-4">
                    <p>owner: {resource.owner__username}</p>
                  </div>
                  <div className="col-md-8">
                    <a type="button"
                      href={`/maps/${resource.id}`}
                      target="_blank"
                      className="btn btn-primary"
                      style={{margin: "5px", float: "right"}}>
                      Map Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {(!this.state.loading && this.state.resources.length==0 && this.state.mymaps) && <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3 text-center">
            <h3>{'You have not created  any maps! please create a Map'}</h3>
          </div>
        </div>}

        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={< a href = "javascript:;" > ...</a>}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} />
      </div>
    )
  }
}
