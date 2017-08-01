import React, { Component } from 'react';

import ReactTags from 'react-tag-autocomplete'
import 'react-tag-autocomplete/example/styles.css'

import slugify from 'slugify'

export default class KeywordsInput extends Component {

	state = {
		tags: this.props.keywords
			? this.props.keywords.map(( keyword, i ) => {
				return { id: i, name: keyword }
			})
			: [],
		suggestions: [ ]
	}

	handleDelete( i ) {
		const tags = this.state.tags.slice( 0 )
		tags.splice( i, 1 )
		this.setState({
			tags
		}, ( ) => {
			this.props.updateKeywords( this.state.tags )
		})
	}

	handleAddition( tag ) {
		const tags = this.state.tags
		tag.name = slugify( tag.name, '_' )
		if ( tags.indexOf( tag ) != -1 )
			return false
		tags.push( tag )
		this.setState({
			tags
		}, ( ) => {
			this.props.updateKeywords( this.state.tags )
		})
	}

	loadKeywords( ) {
		let url = `/api/keywords`
		fetch(url, { credentials: 'include' }).then(( res ) => res.json( )).then(( keywords ) => {
			keywords = keywords.objects.map(( keyword ) => {
				return { name: keyword.name }
			})
			this.setState({ suggestions: keywords })
		})
	}

	componentWillMount( ) {
		this.loadKeywords( );
	}

	render( ) {
		return (
			<div>
				<label>Keywords (optional)</label>
				<ReactTags
					tags={this.state.tags}
					suggestions={this.state.suggestions}
					placeholder={'Add a new keyword'}
					delimiters={[ 188, 13 ]}
					handleDelete={this.handleDelete.bind( this )}
					handleAddition={this.handleAddition.bind( this )}
					allowNew={true}
					autofocus={false}/>
			</div>
		)
	}
}
