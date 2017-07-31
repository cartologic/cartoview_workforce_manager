import UrlAssembler from 'url-assembler'
export const getCRSFToken = ( ) => {
	let csrfToken,
		csrfMatch = document.cookie.match( /csrftoken=(\w+)/ );
	if ( csrfMatch && csrfMatch.length > 0 ) {
		csrfToken = csrfMatch[1];
	}
	return csrfToken;
};
export const hasTrailingSlash = ( str ) => {
	return ( /.*\/$/ ).test( str );
};
export const removeTrailingSlash = ( str ) => {
	return hasTrailingSlash( str )
		? str.slice( 0, -1 )
		: str;
};
export const addTrailingSlash = ( str ) => {
	return hasTrailingSlash( str )
		? str
		: str + "/";
};
//TODO:TEST THIS FUNCTION
export const wfsQueryBuilder = ( geoserverUrl, query ) => {
	return decodeURIComponent(UrlAssembler( addTrailingSlash( geoserverUrl ) + "wfs" ).query( query ).toString( ))
}
