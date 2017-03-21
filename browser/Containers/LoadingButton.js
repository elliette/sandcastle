import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class LoadingButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false
		};

		this.handleClick = this.handleClick.bind(this);
	}

		handleClick() {
			this.setState({isLoading: true});
			// This probably where you would have an `ajax` call
			this.props.handlers

			this.props.handlers.forEach(handler => {
				console.log('HANDLER', handler)
			})

			setTimeout(() => {
				// Completed of async action, set loading state back
				this.setState({isLoading: false});
			}, 2000);
		}

		render() {
			console.log('props for loading button', this.props);
			let isLoading = this.state.isLoading;
			return (
				<Button
					bsStyle="primary"
					disabled={isLoading}
					onClick={!isLoading ? this.handleClick : null}>
					{isLoading ? 'Running your code...' : 'Run'}
				</Button>
			);
		}
}
