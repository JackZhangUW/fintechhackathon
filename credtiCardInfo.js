import React from 'react';
import ReactDOM from 'react-dom';

const cardRegs = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/ig,
    masterCard: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/ig,
    americanExpress: /^3[47][0-9]{13}$/ig,
    discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/ig,
    other: /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/ig
}

// in render, onChange = {verify}
export class CreditCardForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verified: false, 
            bank: null
        }
    }
    verify() {
        inputNums = document.getElementById("credit_card_input").value.replace(/ |-/g, "");
        // str.match(regexp)
        for (var provider in cardRegs) {
            if (inputNums.match(cardRegs[provider])) {
                this.setState({bank: provider, verified: true});
                break;
            }
        }
    }
}