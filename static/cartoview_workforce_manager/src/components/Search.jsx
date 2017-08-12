import React, {Component} from 'react';
import Select from 'react-select'

import "react-select/dist/react-select.min.css";

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state={
      inputValue: "",
      mapTypeNames: [],
    }
  }

  loadMaps(){
    let url = this.props.username!=null
        ?`/api/maps/?owner__username=${this.props.username}`
        :`/api/maps/`
    fetch(url, {credentials: 'include',})
    .then((res) => res.json())
    .then((maps) => {
      let mapTypeNames = maps.objects.map((map)=>{
        return {value:map.title, label:map.title}
      })
      this.setState({mapTypeNames})
    })
  }


  // componentDidMount(){
  //   this.loadMaps()
  // }


  componentWillReceiveProps(){
    this.loadMaps()
  }


  logChange(val){
    if (val)
      this.setState({inputValue: val.value}, ()=>this.props.searchResources(val.value));
    else {
      this.setState({inputValue: ""}, ()=>this.props.searchResources(null))
    }
  }


  render(){
    return (
      <Select
        name="form-field-name"
        placeholder = "Search Maps"
        value = {this.state.inputValue}
        options={this.state.mapTypeNames!=undefined?this.state.mapTypeNames:[]}
        onChange={(value)=>this.logChange(value)}
        arrowRenderer = {()=> false}
        noResultsText={'No Maps Found!!'}
        />
    )
  }
}
