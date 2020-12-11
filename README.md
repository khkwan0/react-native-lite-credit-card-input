# react-native-lite-credit-card-input
Minimal credit card input for RN using React hooks.

![Lite Credit Card Input Demo](demo/react-native-lite-credit-card-input.gif)

Description:

This module is a reimplementation of Lite Credit Card Input from https://github.com/sbycrosz/react-native-credit-card-input/tree/master/src.

As of this writing, the previous module has not been updated in 3+ years and uses older, deprecated react life cycle methods causing yellow box messages.

This reimplementation is a standalone implementation using React hooks.

# Installation

yarn add react-native-lite-credit-card-input

or

npm install react-native-lite-credit-card-input

# Usage

import {LiteCreditCardInput} from 'react-native-lite-credit-card-input'

props:
 onChange(card) - required
 
 card's structure:
 
 {
   valid: boolean,
   type: string, // ('visa', 'american-express', et al.)
   values: {
     number: string,  // card number, no spaces
     expiry: string,  // expiry date "MM/YY"  --- with slash
     cvc: string, // 3 or 4 digit
   }
 }
