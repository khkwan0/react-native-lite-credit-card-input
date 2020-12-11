# react-native-lite-credit-card-input
Minimal credit card input for RN using React hooks.

<img src="https://github.com/khkwan0/react-native-lite-credit-card-input/raw/master/demo/react-native-lite-credit-card-input-demo.gif" width="300" />

Description:

This module is a reimplementation of Lite Credit Card Input from https://github.com/sbycrosz/react-native-credit-card-input/tree/master/src.

As of this writing, the previous module has not been updated in 3+ years and uses older, deprecated react life cycle methods causing yellow box messages.

This reimplementation is a standalone implementation using React hooks.

<strong>The input area contains no default border.  You can add your own throught the <pre>style</pre> prop.  See example below.</strong>

# Installation

yarn add react-native-lite-credit-card-input

or

npm install react-native-lite-credit-card-input

# Props
<table>
 <tr><th>Prop</th><th></th></tr>
 <tr><td>onChange</td><td>Returns a card object * see below</td></tr>
 <tr><td>style</td><td>Override styles * see example below</td></tr>
</table>

# Usage
<pre>
import {LiteCreditCardInput} from 'react-native-lite-credit-card-input'
</pre>
 
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

# Example Code
```javascript
import React from 'react'
import {View, Text} from 'react-native'
import {LiteCreditCardInput} from 'react-native-lite-credit-card-input'

const Example = props => {

  const [card, setCard] = React.useState({})

  return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <LiteCreditCardInput onChange={setCard} style={{borderWidth:1}} />
      <View>
        <Text>{JSON.stringify(card, null, 2)}</Text>
      </View>
    </View>
  )
}

export default Example
```
