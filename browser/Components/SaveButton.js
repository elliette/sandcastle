import React, { Component } from 'react';
import axios from 'axios';
const randomstring = require('randomstring');



export default class SaveButton extends Component {
	constructor(props) {
		super(props)
		this.handleSave = this.handleSave.bind(this);
	}

	handleSave(event) {
		event.preventDefault();
		// console.log(typeof JSON.stringify(this.props.code));
		// post to db
		const hashedProjectId = randomstring.generate(10);

		console.log('clicked save');
		const stringifiedCode = JSON.stringify(this.props.code);
		axios.post(`/api/${this.props.user.userId}`, { code: stringifiedCode, hashedProjectId })
			.then(() => {
				console.log('posted successfully');
			});
	}

	render() {
		console.log('RANDO STRINGO', randomstring.generate(10));

		return (
			<div onClick={this.handleSave}>
				Save
			</div>
		);
	}
}
