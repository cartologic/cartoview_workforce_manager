import React, { Component } from 'react';


export default class Tasks extends Component {
	constructor( props ) {
		super( props )
		
	}


	

	render( ) {
		return (  

<div className="container">
 
       <br/>
  <table className="table table-hover table-bordered table-responsive">
    <thead>
      <tr>
        <th>Title </th>
        <th>Description </th>
		<th> Created By </th>
        <th> Assigned To </th>
		<th>Priority </th>
        <th>Status </th>
	
        
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John</td>
        <td>Doe</td>
        <td>john@example.com</td>
		<td>John</td>
        <td>low</td>
        <td>open</td>
		
      </tr>
      
    </tbody>
  </table>
</div>


		 )
	}
}
