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
