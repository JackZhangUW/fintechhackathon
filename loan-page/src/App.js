import React, { Component } from 'react';
import './App.css';
// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
// react-bootstrap
import { Button, Form, Card, Col, CardColumns } from 'react-bootstrap';
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
			respondFromAPI: null,
			result: null
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
		this.apiCall();
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

	completeResponse = (res) => {
		this.setState({
			loanForm: false,
			loanOffer: true,
			respondFromAPI: res
		});
		console.log(res);
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

		let builder = <div></div>;

		if (this.state.signIn) {
			builder = <SignInForm signIn={this.signIn} signUp={this.signUp} />;
		} else if (this.state.loanForm) {
			builder = <PersonalInformationForm completeResponse={this.completeResponse}/>;
		} else if (this.state.loanOffer) {
			builder = <LoanOffer result={this.state.result} />;
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

	componentDidMount = () => {
		this.setState({offers: this.props.result.loanOffers});
		console.log(this.state.offers);
	}

	getResult = () => {
		this.props.getResult();
		this.setState({
			offers: this.props.result.loanOffers
		})
	}

	render() {
		let builder = [];
		console.log(this.props.result);

		if (true) {
			let offers = this.props.result.loanOffers;
			console.log(offers);
			builder = offers.map((offer) => (
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
					</Card>)
			);
			console.log(builder);
		}
		return(
			<CardColumns>
				<Card style={{ width: '18rem' }} >
					<Card.Img variant="top" src="holder.js/100px180" />
					<Card.Body>
						<Card.Title>Lending Club</Card.Title>
						<Card.Text>
							<p>
							maxAmount: 2000
							</p>
							<p>
							maxApr: 2
							</p>
							<p>
							originator: Lending Club
							</p>
						</Card.Text>
						<Button variant="primary" href="https://offers.evenfinancial.com/ref/7d907bbf-247b-4e8c-9ee5-c211dfc642aa">Details</Button>
					</Card.Body>
				</Card>

				<Card style={{ width: '18rem' }} >
					<Card.Img variant="top" src="holder.js/100px180" />
					<Card.Body>
						<Card.Title>Lending Club</Card.Title>
						<Card.Text>
							<p>
							maxAmount: 1000
							</p>
							<p>
							maxApr: 22
							</p>
							<p>
							originator: Lending Club
							</p>
						</Card.Text>
						<Button variant="primary" href="https://offers.evenfinancial.com/ref/6d71780a-0d22-4aee-b5ac-49dcbec464d9">Details</Button>
					</Card.Body>
				</Card>

				<Card style={{ width: '18rem' }} >
					<Card.Img variant="top" src="holder.js/100px180" />
					<Card.Body>
						<Card.Title>Marcus</Card.Title>
						<Card.Text>
							<p>
							maxAmount: 60000
							</p>
							<p>
							maxApr: 0.8
							</p>
							<p>
							originator: Marcus
							</p>
						</Card.Text>
						<Button variant="primary" href="https://offers.evenfinancial.com/ref/5fee7cb9-bfb6-4049-9b4e-8d4c0da84c22">Details</Button>
					</Card.Body>
				</Card>

				<Card style={{ width: '18rem' }} >
					<Card.Img variant="top" src="holder.js/100px180" />
					<Card.Body>
						<Card.Title>Best Egg</Card.Title>
						<Card.Text>
							<p>
							maxAmount: 15000
							</p>
							<p>
							maxApr: 100
							</p>
							<p>
							originator: Best Egg
							</p>
						</Card.Text>
						<Button variant="primary" href="https://offers.evenfinancial.com/ref/3248cba9-6a0e-4208-94b4-960c56bd7b5d">Details</Button>
					</Card.Body>
				</Card>

				<Card style={{ width: '18rem' }} >
					<Card.Img variant="top" src="holder.js/100px180" />
					<Card.Body>
						<Card.Title>Best Egg</Card.Title>
						<Card.Text>
							<p>
							maxAmount: 80000
							</p>
							<p>
							maxApr: 12.5
							</p>
							<p>
							originator: Best Egg
							</p>
						</Card.Text>
						<Button variant="primary" href="https://offers.evenfinancial.com/ref/398fc2b4-2256-4b55-a9dc-6147f44321b2">Details</Button>
					</Card.Body>
				</Card>

				<Card style={{ width: '18rem' }} >
					<Card.Img variant="top" src="holder.js/100px180" />
					<Card.Body>
						<Card.Title>ZippyLoan</Card.Title>
						<Card.Text>
							<p>
							maxAmount: 30000
							</p>
							<p>
							maxApr: 10
							</p>
							<p>
							originator: ZippyLoan
							</p>
						</Card.Text>
						<Button variant="primary" href="https://offers.evenfinancial.com/ref/595a7d92-6f66-478a-b4d8-a2e6dc57f102">Details</Button>
					</Card.Body>
				</Card>
			</CardColumns>
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
			"educationLevel":document.getElementById("degree").value
		}
		let loanInformation = {
			"purpose": this.state.purpose,
			"loanAmount": parseInt(document.getElementById("loanAmount").value)
		}
		let financialInformation = {
			"employmentStatus": this.state.employ,
			"annualIncome": parseInt(document.getElementById("income").value)
		}
		requestBody["personalInformation"] = personalInformation;
		requestBody["loanInformation"] = loanInformation;
		requestBody["creditInformation"] = {"providedNumericCreditScore": parseInt(document.getElementById("creditScore").value)};
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

	completeResponse = (response) => {
		this.props.completeResponse(response);
	}

	submit = () => {
		const ACCESS_CODE = "e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2";
		const POST_URL = "https://api.evenfinancial.com/leads/rateTables";

		let data = JSON.stringify(this.makeRequestBody());
		let myHeader = new Headers();
		myHeader.append('Content-Type', 'application/json');
		myHeader.append('Authorization', 'Bearer ' + ACCESS_CODE);
		myHeader.append('Accept', 'application/vnd.evenfinancial.v1+json');
		console.log(JSON.stringify(this.makeRequestBody()));
		fetch(POST_URL, {
				method: 'POST',
				headers: myHeader,
				body: data
		})
		.then(res => JSON.parse)
		.then(response => this.completeResponse())
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
      			<Form.Control type="text" placeholder="Enter your first name"defaultValue="John" />
    			</Form.Group>
    			<Form.Group as={Col} controlId="formGridLName">
      			<Form.Label>Last Name</Form.Label>
      			<Form.Control type="text" placeholder="Enter your last name" defaultValue="Doe" />
    			</Form.Group>
					<Form.Group as={Col} controlId="formGridDateOfBirth">
						<Form.Label>Date of Birth(yyyy/mm/dd)</Form.Label>
						<Form.Control type="text" placeholder="Enter your date of birth" defaultValue="1993/10/09" onChange={this.verifyDOB}/>
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
						<Form.Control type="text" placeholder="Enter your number" defaultValue="2125551234" onChange={this.verifyNum}/>
					</Form.Group>
					<Form.Group as={Col} controlId="Email">
						<Form.Label>What's your email?</Form.Label>
						<Form.Control type="text" placeholder="Enter your email" defaultValue="john@example.com" />
					</Form.Group>
				</Form.Row>
				<Form.Row>
					<Form.Group as={Col} controlId="income">
						<Form.Label>What's your annual income?</Form.Label>
						<Form.Control type="text" placeholder="Enter your annual income" defaultValue="120000" onChange={this.verifyNum}/>
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
						<Form.Control type="text" placeholder="Enter your credit score" defaultValue="750" onChange={this.verifyNum}/>
					</Form.Group>
					<Form.Group as={Col} controlId="loanAmount">
						<Form.Label>How much (at most) are you looking to loan?</Form.Label>
						<Form.Control type="text" placeholder="Enter your approximate loan amount" defaultValue="10000" onChange={this.verifyNum}/>
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
				<Button variant="primary" onClick={this.completeResponse}>
					Submit
				</Button>
			</Form>
		)
	}
}
