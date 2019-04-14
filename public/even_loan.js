/* global fetch */

"use strict";

(function() {

	const ACCESS_CODE = "e7675dd3-ff3b-434b-95aa-70251cc3784b_88140dd4-f13e-4ce3-8322-6eaf2ee9a2d2";

	const POST_URL = "https://api.evenfinancial.com/leads/rateTables";
	//const BASE_URL = "https://api.evenfinancial.com/originator/rateTables/"

	window.onload = function() {
   		showInfo(name);
   	};

   	function showInfo() {
  //  		let data = JSON.stringify({
		//     "productTypes": [
		//         "loan"
		//     ],
		//     "personalInformation": {
		//         "firstName": "John",
		//         "lastName": "Doe",
		//         "email": "john@example.com",
		//         "city": "New York",
		//         "state": "NY",
		//         "workPhone": "2125551234",
		//         "primaryPhone": "2125556789",
		//         "address1": "45 West 21st Street",
		//         "address2": "5th Floor",
		//         "zipcode": "10010",
		//         "monthsAtAddress": 5,
		//         "driversLicenseNumber": "111222333",
		//         "driversLicenseState": "NY",
		//         "ipAddress": "8.8.8.8",
		//         "activeMilitary": false,
		//         "militaryVeteran": true,
		//         "dateOfBirth": "1993-10-09",
		//         "educationLevel": "bachelors",
		//         "ssn": "111-22-3333"
		//     }
		// });

		let data = JSON.stringify({"productTypes":["loan"],
		"personalInformation":{
			"firstName": "dasd",
			"lastName": "dsad",
			"email": "samleeusa@yahoo.com",
			"primaryPhone": "9132746066",
			"dateOfBirth": "1111-11-11"},
		"loanInformation": {
			"purpose": "vacation",
			"loanAmount": 2122222},
		"creditInformation": {
			"providedNumericCreditScore":750
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
		.then(checkStatus)
		.then(JSON.parse)
		.then(fillMyInfo)
		.catch(handleError);
		// .then(res => res.json())
		// .then(response => console.log('Success:', JSON.stringify(response)))
		// .catch(error => console.error('Error:', error));
   	}

    function fillMyInfo(responseText) {
    	$("test").innerText = JSON.stringify(responseText);
    }

    function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			console.log("good");
			return response.text();
		} else {
			console.log("bad");
			return Promise.reject(new Error(response.status + ": " + response.statusText));
		}
	}

	function handleError(errorMsg) {
        alert(errorMsg);
    }

	/**
    * Returns document.getElementById(id).
    * @param {String} tag id.
	 * @return {element} the element that has the ID attribute with the 
	 *                   specified value.
	 */
   function $(id) {
  		return document.getElementById(id);
	}

})();