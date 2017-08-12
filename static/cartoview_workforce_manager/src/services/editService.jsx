import { getCRSFToken, hasTrailingSlash } from '../helpers/helpers.jsx'
export default class EditService {
	constructor( urls ) {
		this.baseUrl = urls.baseUrl
		
	}
	save( instanceConfig, id ) {


 if(isNaN(id)){
	 	console.log("in save",id)
		const url =this.baseUrl + "apps/cartoview_workforce_manager/api/v1/project/"
			
		
		return fetch( url ,
			 {
			method: 'POST',
			credentials: "same-origin",
			headers: new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( )}),
			body: JSON.stringify( instanceConfig )
		}).then(( response ) => response.json( ))
 }
else{
const url =this.baseUrl + "apps/cartoview_workforce_manager/api/v1/project/"+id
			
		
		return fetch( url ,
			 {
			method: 'PUT',
			credentials: "same-origin",
			headers: new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( )}),
			body: JSON.stringify( instanceConfig )
		}).then(( response ) => response.json( ))

}




	
	}
}
