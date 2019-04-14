import React, { Component } from 'react';
import './App.css';
// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
// react-bootstrap
import { Button, Form, Card } from 'react-bootstrap';
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
			result: []
		}
	}

	componentDidMount = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.completeSignIn();
			} else {
				this.setState({signIn: true});
			}
		});
	}

	completeSignIn = () => {
		this.setState({
			signIn: false,
			loanOffer: true
		});
	}

	signOut = () => {
		firebase.auth().signOut().then(function() {
			alert("Sign out successful");
		 }).catch(function(error) {
			alert(error.message);
		 });
		this.setState({
			signIn: true,
			loanForm: false,
			loanOffer: false
		})
	}

	signUp = (email, password) => {
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			console.log(errorMessage);
			console.log('email: ' + email);
		}).then(() => this.completeSignIn);
	}

	signIn = (email, password) => {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
		}).then(() => this.completeSignIn);
	}

	// fetch from api, store in this.state.result
	getResult = () => {
		const ACCESS_CODE = "e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2";
		const POST_URL = "https://api.evenfinancial.com/leads/rateTables";

		let data = JSON.stringify({
			"productTypes": [
					"loan",
					"savings"
			],
			"personalInformation": {
					"firstName": "John",
					"lastName": "Doe",
					"email": "john@example.com",
					"city": "New York",
					"state": "NY",
					"workPhone": "2125551234",
					"primaryPhone": "2125556789",
					"address1": "45 West 21st Street",
					"address2": "5th Floor",
					"zipcode": "10010",
					"monthsAtAddress": 5,
					"driversLicenseNumber": "111222333",
					"driversLicenseState": "NY",
					"ipAddress": "8.8.8.8",
					"activeMilitary": false,
					"militaryVeteran": true,
					"dateOfBirth": "1993-10-09",
					"educationLevel": "bachelors",
					"ssn": "111-22-3333"
			}
		});

		let myHeader = new Headers();
		myHeader.append('Content-Type', 'application/json');
		myHeader.append('Authorization', 'Bearer e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2');
		myHeader.append('mode', 'cors');
		
		fetch("https://api.evenfinancial.com/leads/rateTables", {
				method: 'POST',
				headers: myHeader,
				body: data
		})
		.then(res => res.json())
		.then(response => {this.setState({result: response})})
		.catch(error => console.error('Error:', error));

	}

	render() {

		let builder = <div></div>;

		console.log(this.state);

		if (this.state.signIn) {
			builder = <SignInForm signIn={this.signIn} signUp={this.signUp} />;
		}/* else if (this.state.loanForm) {
			builder = <LoanForm />;
		} */else if (this.state.loanOffer) {
			builder = <LoanOffer getResult={this.getResult} result={this.state.result} />;
		}

		return (

			<div className="App">
				<Button onClick={this.signOut}>Sign Out</Button>
				{builder}
			</div>
		);
	}
}

/*
props:
	signUp(email, password)
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

	signUp = () => {
		this.props.signUp(this.state.email, this.state.password);
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
				<Button variant="primary" onClick={this.signUp}>
					Sign Up
				</Button>
				<Button variant="primary" onClick={this.signIn}>
					Sign In
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
			result: ''
		}
	}

	apiCall = () => {
		const ACCESS_CODE = "e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2";
		const POST_URL = "https://api.evenfinancial.com/leads/rateTables";

		let data = JSON.stringify({
			"productTypes": [
					"loan",
					"savings"
			],
			"personalInformation": {
					"firstName": "John",
					"lastName": "Doe",
					"email": "john@example.com",
					"city": "New York",
					"state": "NY",
					"workPhone": "2125551234",
					"primaryPhone": "2125556789",
					"address1": "45 West 21st Street",
					"address2": "5th Floor",
					"zipcode": "10010",
					"monthsAtAddress": 5,
					"driversLicenseNumber": "111222333",
					"driversLicenseState": "NY",
					"ipAddress": "8.8.8.8",
					"activeMilitary": false,
					"militaryVeteran": true,
					"dateOfBirth": "1993-10-09",
					"educationLevel": "bachelors",
					"ssn": "111-22-3333"
			}
		});

		let myHeader = new Headers();
		myHeader.append('Content-Type', 'application/json');
		myHeader.append('Authorization', 'Bearer e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2');
		myHeader.append('mode', 'cors');
		
		fetch("https://api.evenfinancial.com/leads/rateTables", {
				method: 'POST',
				headers: myHeader,
				body: data
		})
		.then(res => res.json())
		.then(response => {this.setState({result: response})})
		.catch(error => console.error('Error:', error));
	}

	render() {
		return (
			<div>
				{this.state.result}
			</div>
		)
	}
}


/*
props:
	getResult()
	result

*/
class LoanOffer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			offers: []
		}
	}

	getResult = () => {
		this.props.getResult();
		this.setState({
			offers: this.props.result.loanOffers
		})
	}

	render() {
		let builder = <Form><Button variant="primary" onClick={this.getResult}>
			Get</Button></Form>;

		if (this.props.result != null && this.props.result.loanOffers != null) {
			let offers = this.props.result.loanOffers;
			let builder = offers.map((offer) => {
				return (
					<Card style={{ width: '18rem' }} key={offer.uuid} >
						<Card.Img variant="top" src="holder.js/100px180" />
						<Card.Body>
							<Card.Title>Card Title</Card.Title>
							<Card.Text>
								maxAmount: {offer.maxAmount}
								maxApr: {offer.maxApr}
								originator: {offer.originator}
								url: {offer.url}
							</Card.Text>
							<Button variant="primary">Go somewhere</Button>
						</Card.Body>
					</Card>
				)
			})
		}
		return(
			<div className="container-fluid">
				{builder}
			</div>
		)
	}
}

