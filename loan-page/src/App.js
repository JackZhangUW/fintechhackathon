import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
// react-bootstrap
import { Button, Form } from 'react-bootstrap';
// firebase
import firebase from 'firebase/app';
import 'firebase/auth';


export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			signIn: true,
			loanForm: false,
			loanOffer: false,
			userID: ''
		}
	}

	signIn = (email, password) => {
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			console.log(errorMessage);
			console.log('email: ' + email);
		}).then(() => {
			this.setState({
				signIn: false,
				loanForm: true
			})
		})
	}

	render() {
		return (
			<div className="App">
				<SignInForm signIn={this.signIn} />
			</div>
		);
	}
}

/*
props:
	signIn(email, password)

*/
class SignInForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}

	updateEmail = (event) => {
		this.setState({
			email: event.target.value
		});
	}

	updatePassword = (event) => {
		this.setState({
			password: event.target.value
		});
	}

	signIn = () => {
		this.props.signIn(this.state.email, this.state.password);
	}


	render() {
		return (
			<Form>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control type="email" placeholder="Enter email" onChange={this.updateEmail} />
					<Form.Text className="text-muted">
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password" onChange={this.updatePassword} />
				</Form.Group>
				<Button variant="primary" type="submit" onClick={this.signIn}>
					Submit
				</Button>
			</Form>
		);
	}
}

/*
	props:

	states:

*/
class LoanForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: ''

		}
	}

	render() {
		return (
			<form>
				<div class="form-group">
					<label for="exampleInputEmail1">Email address</label>
					<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
					<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
				</div>
			</form>
		)
	}
	

}

