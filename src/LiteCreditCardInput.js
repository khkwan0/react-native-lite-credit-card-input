import React from 'react'
import {View, TextInput, Image} from 'react-native'
import valid from 'card-validator'
import Images from './images/index'

const LiteCreditCardInput = props => {

  const [brand, setBrand] = React.useState('unknown')
  const [cardNumber, setCardNumber] = React.useState('')
  const [displayNumber, setDispayNumber] = React.useState('')
  const [numberValidity, setNumberValidity] = React.useState(null)

  const [showNumberInput, setShowNumberInput] = React.useState(true)
  const [showExpCVV, setShowExpCVV] = React.useState(false)

  const [exp, setExp] = React.useState('')
  const [expValidity, setExpValidity] = React.useState(null)
  const [displayExp, setDisplayExp] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [cvvValidity, setCvvValidity] = React.useState(null)

  const numInp = React.useRef(null)
  const expInp = React.useRef(null)
  const cvvInp = React.useRef(null)

  React.useEffect(() => {
    if (showExpCVV) {
      expInp.current.focus()
    }
  }, [showExpCVV])

  React.useEffect(() => {
    const rawNumber = cardNumber.split(' ').join('')
    const res = valid.number(rawNumber)
    let toDisplay = ''
    if (res.card !== null) {
      let i = 0
      while (i < rawNumber.length) {
        if (res.card.gaps.includes(i)) {
          toDisplay += ' ' 
        }
        toDisplay += rawNumber[i]
        i++
      }
    } else {
      toDisplay = cardNumber
    }
    setDispayNumber(toDisplay)
    setNumberValidity({...res})
    if (res.isPotentiallyValid && res.card !== undefined && res.card && res.card.type !== undefined && res.card.type) {
      setBrand(res.card.type)
    } else {
      setBrand('unknown')
    }
    if (res.isValid) {
      setShowExpCVV(true)
      setShowNumberInput(false)
    }
  }, [cardNumber])

  React.useEffect(() => {
    if (showNumberInput) {
      numInp.current.focus()
    }
  }, [showNumberInput])

  React.useEffect(() => {
    let rawExp = exp.split('/').join('')
    const res = valid.expirationDate(rawExp)
    if (rawExp) {
      rawExp = rawExp.match(new RegExp('.{1,2}', 'g')).join('/')
    }
    if (rawExp.length !== 5) {
      res.isValid = false
      res.isPotentiallyValid = false
    }
    setExpValidity({...res})
    setDisplayExp(rawExp)
    if (res.isValid) {
      cvvInp.current.focus()
    }
  }, [exp])

  React.useEffect(() => {
    let cvvLength = 3 
    if (numberValidity !== null && numberValidity.card !== undefined && numberValidity.card.type !== undefined && numberValidity.card.type === 'american-express') {
      cvvLength = 4
    }
    const res = valid.cvv(cvv, cvvLength)
    console.log(res)
    setCvvValidity({...res})
  }, [cvv])

  React.useEffect(() => {
    HandleChange()
  }, [numberValidity, expValidity, cvvValidity])

  const HandleChange = () => {
    const res = {
      valid: false,
      type: 'unknown',
      values: {
        number: cardNumber.split(' ').join(''),
        expiry: exp,
        cvc: cvv
      }
    }
    console.log(cvvValidity)
    if (numberValidity && numberValidity.isValid && expValidity && expValidity.isValid && cvvValidity && cvvValidity.isValid) {
      res.valid = true
    }
    if (numberValidity !== null && numberValidity.card !== undefined && numberValidity.card && numberValidity.card.type !== undefined && numberValidity.card.type) {
      res.type = numberValidity.card.type
    }
    props.onChange({...res})
  }

  return (
    <View style={[{flexDirection: 'row', backgroundColor: 'white', borderRadius: 5, alignItems:'center'},(props.style !== undefined && props.style)?{...props.style}:{}]}>
      <View style={{flexGrow: 1}}>
        {showNumberInput &&
          <TextInput
            style={
              [{color: (numberValidity !== null)?numberValidity.isValid?'green':numberValidity.isPotentiallyValid?'black':'red':'black'}]
            }
            label="Card Number"
            keyboardType="numeric"
            placeholder="1234 1234 1234 1234"
            value={displayNumber}
            onChangeText={text=>setCardNumber(text)}
            onFocus={()=>setShowNumberInput(true)}
            ref={numInp}
          />
        }
        {showExpCVV &&
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <TextInput
                style={[props.inputStyle!==undefined?props.inputStyle:{},{color: valid?props.validColor!==undefined?props.validColor:'green':props.invalidColor!==undefined?props.invalidColor:'red'} ]}
                value={"..."+displayNumber.slice(-4)}
                onFocus={()=>{setShowNumberInput(true); setShowExpCVV(false)}}
              />
            </View>
            <View style={{flex: 1}}>
              <TextInput
              style={
                [{color: (expValidity !== null)?expValidity.isValid?'green':expValidity.isPotentiallyValid?'black':'red':'black'}]
              }
                ref={expInp}
                value={displayExp}
                onChangeText={text=>setExp(text)}
                placeholder="MM/YY"
                keyboardType="numeric"
                label="Expiration Date"
                maxLength={5}
              />              
            </View>
            <View style={{flex: 1}}>
              <TextInput
                style={
                  [{color: (cvvValidity !== null)?cvvValidity.isValid?'green':cvvValidity.isPotentiallyValid?'black':'red':'black'}]
                }
                ref={cvvInp}
                value={cvv}
                onChangeText={text=>setCvv(text)}
                placeholder={(numberValidity && numberValidity.card !== undefined && numberValidity.card.code !== undefined && numberValidity.card.code.name !== undefined)?numberValidity.card.code.name:'CVV'}
                keyboardType="numeric"
                maxLength={(numberValidity && numberValidity.card !== undefined && numberValidity.card.code !== undefined && numberValidity.card.code.size !== undefined)?numberValidity.card.code.size:3}
              />
            </View>
          </View>
        }
      </View>
      <View>
        <Image resizeMode="contain" source={Images[brand]} style={{height: 40}} />
      </View>
    </View>
  )
}

export default LiteCreditCardInput
