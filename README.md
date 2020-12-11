# react-native-lite-credit-card-input
Minimal credit card input for RN using React hooks.

<img src="https://github.com/khkwan0/react-native-lite-credit-card-input/raw/master/demo/react-native-lite-credit-card-input-demo.gif" width="300" />

Description:

This module is a reimplementation of Lite Credit Card Input from https://github.com/sbycrosz/react-native-credit-card-input/tree/master/src.

As of this writing, the previous module has not been updated in 3+ years and uses older, deprecated react life cycle methods causing yellow box messages.

This reimplementation is a standalone implementation using React hooks.

# Installation

yarn add react-native-lite-credit-card-input

or

npm install react-native-lite-credit-card-input

# Props
<table>
 <tr><th>Prop</th><th></th></tr>
 <tr><td>onChange</td><td>Returns a card object * see below</td></tr>
</table>

# Usage
import {LiteCreditCardInput} from 'react-native-lite-credit-card-input'
 
 card's structure:
 <pre>
 {
   valid: boolean,
   type: string, // ('visa', 'american-express', et al.)
   values: {
     number: string,  // card number, no spaces
     expiry: string,  // expiry date "MM/YY"  --- with slash
     cvc: string, // 3 or 4 digit
   }
 }
</pre>
