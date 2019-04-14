import React, { Component } from 'react';
import './App.css';
// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
// react-bootstrap
import { Button, Form, Card, Col } from 'react-bootstrap';
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
			respond: false,
			respondFromAPI: null
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
			loanForm: true
		});
	}

	signOut = () => {
		firebase.auth().signOut().then(function() {
			alert("Sign out successful!");
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
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(() => this.completeSignIn)
			.catch(error => {
				switch(error.code) {
					case 'auth/weak-password':
						alert('Error: The password must be 6 characters long or more!')
						break;
					case 'auth/email-already-in-use':
						alert('Email: "' + email + '" is already in use')
						break;
					case 'auth/invalid-email':
						alert('Email: "' + email + '" is NOT valid!')
						break;
				}
			});
	}

	signIn = (email, password) => {
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => this.completeSignIn)
			.catch(error => {
				switch(error.code) {
					case 'auth/user-not-found':
						alert('Email: "' + email + '" has not been registered!')
						break;
					case 'auth/wrong-password':
						alert('Password is incorrect!')
						break;
				}
			});
	}

	completeResopnse = (res) => {
		this.setState({
			loanForm: false,
			loanOffer: true,
			respondFromAPI: res
		});
	}

	render() {

		let builder = <div></div>;

		if (this.state.signIn) {
			builder = <SignInForm signIn={this.signIn} signUp={this.signUp} />;
		} else if (this.state.loanForm) {
			builder = <PersonalInformationForm completeResponse={this.completeResponse}/>;
		} else if (this.state.loanOffer) {
			builder = <LoanOffer getResult={this.getResult} result={this.state.respondFromAPI} />;
		}
		if (!this.state.signIn) {
			return (
				<div className="App">
					<Button id="signout-btn" onClick={this.signOut}>Sign Out</Button>
					{builder}
				</div>
			);
		} else {
			return <div>{builder}</div>;
		}
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
			<Form id="alah">
				<Form.Group controlId="formBasicEmail">
					<Form.Label className="sign-label">Email address</Form.Label>
						<Form.Control type="email" className="form-control" placeholder="Enter email" onChange={this.updateEmail} />
					<Form.Text className="text-muted">
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label className="sign-label">Password</Form.Label>
					<Form.Control type="password" className="form-control" placeholder="Password" onChange={this.updatePassword} />
				</Form.Group>
				<div id="buttons">
					<Button variant="primary" onClick={this.signIn}>
						Sign In
					</Button>
					<Button variant="primary" onClick={this.signUp}>
						Sign Up
					</Button>
				</div>
			</Form>
		);
	}
}

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

class PersonalInformationForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validDOB:false,
			validNums:false
		}
		this.changeEmployment = this.changeEmployment.bind(this);
		this.changeDegree = this.changeDegree.bind(this);
		this.changePurpose = this.changePurpose.bind(this);
		this.verifyDOB = this.verifyDOB.bind(this);
		this.verifyNum = this.verifyNum.bind(this);

	}

	$ = (str) => {
		return document.getElementById(str);
	}

	makeRequestBody = () => {
		let requestBody = {"productTypes": ["loan"]};
		let personalInformation = {
			"firstName":document.getElementById("formGridFName").value,
			"lastName":document.getElementById("formGridLName").value,
			"email":document.getElementById("Email").value,
			"primaryPhone":document.getElementById("phone").value,
			"dateOfBirth":document.getElementById("formGridDateOfBirth").value.replace(/\//g, "-"),
		}
		let loanInformation = {
			"purpose": this.state.purpose,
			"loanAmount": document.getElementById("loanAmount").value
		}
		let financialInformation = {
			"employmentStatus": this.state.employ,
			"annualIncome": document.getElementById("income").value
		}
		requestBody["personalInformation"] = personalInformation;
		requestBody["loanInformation"] = loanInformation;
		requestBody["creditInformation"] = {"providedNumericCreditScore": 750};
		return requestBody;
	}

	changeEmployment = (event) => {
		this.setState({employ: event.target.value});
	}

	changeDegree = (event) => {
		this.setState({degree: event.target.value});
	}

	changePurpose = (event) => {
		this.setState({purpose: event.target.value});
	}

	verifyDOB(event) {
		let pattern = /^\d{4}[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])$/;
		let validInput = pattern.test(event.target.value);
		console.log(validInput);
		this.setState({validDOM: true});
	}
	verifyNum = (event) => {
		let numReg = /^\d+$/ 
		let validInput = numReg.test(event.target.value);
		this.setState({validNums: true});
	}

	submit = () => {
		const ACCESS_CODE = "e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2";
		const POST_URL = "https://api.evenfinancial.com/leads/rateTables";

		console.log(this.makeRequestBody())
		let data = JSON.stringify(this.makeRequestBody());
		let myHeader = new Headers();
		myHeader.append('Content-Type', 'application/json');
		myHeader.append('Authorization', 'Bearer e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2');
		console.log(data);
		fetch("https://api.evenfinancial.com/leads/rateTables", {
				method: 'POST',
				headers: myHeader,
				body: data
		})
		.then(res => res.json())
		.then(response => this.props.completeResopnse)
		.catch(error => console.error('Error:', error));
	}

	render() {
		//phone number, loan amount, annual income, and credit score all requires to be all numbers
		// Additionally, additionally, they are all non-negative
		return (
			<Form onSubmit={this.submit}>
  			<Form.Row>
    			<Form.Group as={Col} controlId="formGridFName">
      			<Form.Label>First Name</Form.Label>
      			<Form.Control type="text" placeholder="Enter your first name" />
    			</Form.Group>
    			<Form.Group as={Col} controlId="formGridLName">
      			<Form.Label>Last Name</Form.Label>
      			<Form.Control type="text" placeholder="Enter your last name" />
    			</Form.Group>
					<Form.Group as={Col} controlId="formGridDateOfBirth">
						<Form.Label>Date of Birth(yyyy/mm/dd)</Form.Label>
						<Form.Control type="text" placeholder="Enter your date of birth" onChange={this.verifyDOB}/>
					</Form.Group>
				</Form.Row>
				<Form.Row>
					<Form.Group as={Col} controlId="degree">
						<Form.Label>What's your current degree of education?</Form.Label>
						<Form.Control as="select" onChange={this.changeDegree}>
							<option value="associate">Associate</option>
							<option value="bachelors">Bachelors</option>
							<option value="high_school">High School</option>
							<option value="masters">Master</option>
							<option value="other_grad_degree">Other equivalent master degree</option>
							<option value="other">Other</option>
						</Form.Control>
					</Form.Group>
				</Form.Row>
				<Form.Row>
					<Form.Group as={Col} controlId="phone">
						<Form.Label>What's your number?</Form.Label>
						<Form.Control type="text" placeholder="Enter your number" onChange={this.verifyNum}/>
					</Form.Group>
					<Form.Group as={Col} controlId="Email">
						<Form.Label>What's your email?</Form.Label>
						<Form.Control type="text" placeholder="Enter your email" />
					</Form.Group>
				</Form.Row>
				<Form.Row>
					<Form.Group as={Col} controlId="income">
						<Form.Label>What's your annual income?</Form.Label>
						<Form.Control type="text" placeholder="Enter your annual income" onChange={this.verifyNum}/>
					</Form.Group>
					<Form.Group as={Col} controlId="employment">
						<Form.Label>Are you currently employed?</Form.Label>
						<Form.Control as="select" onChange={this.changeEmployment}>
							<option value="employed">Employed</option>
							<option value="not_employed">Unemployed</option>
							<option value="self_employed">Self Employed</option>
							<option value="military">Military</option>
							<option value="retired">Retired</option>
							<option value="other">Other</option>
						</Form.Control>
					</Form.Group>
				</Form.Row>
				<Form.Row>
					<Form.Group as={Col} controlId="creditScore">
						<Form.Label>What's your credit score?</Form.Label>
						<Form.Control type="text" placeholder="Enter your credit score" onChange={this.verifyNum}/>
					</Form.Group>
					<Form.Group as={Col} controlId="loanAmount">
						<Form.Label>How much (at most) are you looking to loan?</Form.Label>
						<Form.Control type="text" placeholder="Enter your approximate loan amount" onChange={this.verifyNum}/>
					</Form.Group>
				</Form.Row>
				<Form.Row>
					<Form.Group as={Col} controlId="loaningPurpose">
						<Form.Label>What's the purpose you are loaning?</Form.Label>
						<Form.Control as="select" onChange={this.changePurpose}>
							<option value="auto">Automobile</option>
							<option value="boat">Boat Purchase</option>
							<option value="debt_consolidation">Debt Consolidation</option>
							<option value="student_loan">Student Loan</option>
							<option value="home_improvement">Home Improvement</option>
							<option value="business">Business Expanse</option>
							<option value="large_purchases">Large Purchase</option>
							<option value="green">Green Loan</option>
							<option value="household_expenses">Household Spending</option>
							<option value="medical_dental">Medical and Dental Bill</option>
							<option value="moving_relocation">Moving</option>
							<option value="taxes">Taxes</option>
							<option value="vacation">Vacation</option>
							<option value="wedding">Wedding Payments</option>
							<option value="other">Other</option>
						</Form.Control>
					</Form.Group>
				</Form.Row>
				<Button variant="primary" onClick={this.submit}>
					Submit
				</Button>
			</Form>
		)
	}
}
