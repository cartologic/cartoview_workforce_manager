import React, { Component } from 'react';
export default class Navigator extends Component {
	state = {}

	onClick( e, index ) {
		if ( index < this.props.step ) {
			this.props.onStepSelected( index )
		}
	}

	item( label, index ) {
		const { step, onStepSelected } = this.props;
		const className = index == step
			? "list-group-item active"
			: index > step
				? "list-group-item disabled"
				: "list-group-item";
		return (
			<li key={index} className={className} onClick={e => this.onClick( e, index )}>
				{index < step && <i className="fa fa-check" aria-hidden="true"></i>}
				{label}
			</li>
		)
	}

	render( ) {
		const { steps } = this.props;
		return (
			<div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 list-group">
				<ul className={"list-group"}>
					{steps.map(( s, index ) => this.item( s.label, index ))}
				</ul>
			</div>
		)
	}
}
