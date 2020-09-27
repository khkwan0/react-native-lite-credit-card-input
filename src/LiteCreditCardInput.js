import Images from './images/index'
import moment from 'moment'

// the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
// regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also

//JCB
const jcb_regex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'); //2131, 1800, 35 (3528-3589)
// American Express
const amex_regex = new RegExp('^3[47][0-9]{0,}$'); //34, 37
// Diners Club
const diners_regex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'); //300-305, 309, 36, 38-39
// Visa
const visa_regex = new RegExp('^4[0-9]{0,}$'); //4
// MasterCard
const mastercard_regex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'); //2221-2720, 51-55
const maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
//Discover
const discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$')
////6011, 622126-622925, 644-649, 65

const card_spaces = new RegExp('.{1,4}','g')

const LiteCreditCardInput = props => {
  const [rawCC, setRawCC] = React.useState('')
  const [displayCC, setDisplayCC] = React.useState('')
  const [numericCvv, setNumericCvv] = React.useState(0)
  const [exp, setExp] = React.useState('')
  const [displayExp, setDisplayExp] = React.useState('')
  const [month, setMonth] = React.useState('')
  const [year, setYear] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [brand, setBrand] = React.useState('unknown')
  const [valid, setValid] = React.useState(false)
  const [validExp, setValidExp] = React.useState(false)
  const [validCvv, setValidCvv] = React.useState(false)
  const [showNumberInput, setShowNumberInput] = React.useState(true)
  const [showExpCVC, setShowExpCVC] = React.useState(false)

  const expInp = React.useRef(null)
  const cvvInp = React.useRef(null)
  const numInp = React.useRef(null)

  React.useEffect(() => {
    CheckEntire()
  }, [validCvv])

  React.useEffect(() => {
    try {
      const _numericCvv = parseInt(cvv)
      setNumericCvv(_numericCvv)
      if (_numericCvv > 99 && _numericCvv < 10000) {
        setValidCvv(true)
      } else {
        setValidCvv(false)
      }
    } catch(e) {
      console.log(e)
      setValidCvv(false)
    }
  }, [cvv])

  React.useEffect(() => {
    if (showNumberInput) {
      setShowExpCVC(false)
      numInp.current.focus()
    } else {
      setShowExpCVC(true)
    }
  }, [showNumberInput])

  React.useEffect(() => {
    if (expInp.current) {
      expInp.current.focus()
    }
  }, [showExpCVC])

  React.useEffect(() => {
    CheckEntire()
  }, [validExp])

  React.useEffect(() => {
    let formattedText = exp.split('/').join('')
    if (formattedText.length === 4) {
      const month = Math.floor(parseInt(formattedText)/100)
      const year = parseInt(formattedText)%100 + 2000
      const expEpoch = moment().set({'year': year, 'month': month, 'date':1, 'hour': 0, 'minute': 0, 'seconds': 0, 'milliseconds': 0}).format('x')
      if (Date.now() < expEpoch) { 
        setMonth(month)
        setYear(year)
        setValidExp(true)
        cvvInp.current.focus()
      } else {
        setMonth(month)
        setYear(year)
        setValidExp(false)
      }
    }
    if (formattedText.length > 0) {
      formattedText = formattedText.match(new RegExp('.{1,2}', 'g')).join('/');
    }
    setDisplayExp(formattedText)
  }, [exp])

  React.useEffect(() => {
    let formattedText = rawCC.split(' ').join('')
    let cc_brand = brand
    if (brand === 'unknown') {
      cc_brand = getBrand(formattedText)
      setBrand(cc_brand)
    }
    if (((cc_brand === 'visa' || cc_brand === 'mastercard') && formattedText.length === 16) || (cc_brand === 'amex' && formattedText.length === 13)) {
      if (isValidNumber(formattedText)) {
        setValid(true)
        setShowNumberInput(false)
        setShowExpCVC(true)
      } else {
        setValid(false)
      }
    }
    if (formattedText.length > 0) {
      formattedText = formattedText.match(card_spaces).join(' ');
    }
    setDisplayCC(formattedText)
    CheckEntire()
  }, [rawCC])

  const isValidNumber = cardNumber => {
    cardNumber = cardNumber.trim()
    let i = cardNumber.length - 1
    let total = 0
    let double = false
    while (i >= 0) {
      if (double) {
        let val = parseInt(cardNumber[i]) * 2
        if (val > 9) {
          const toAdd = Math.floor(val/10) + val%10
          total += toAdd
        } else {
          total += val
        }
      } else {
        total += parseInt(cardNumber[i])
      }
      double = !double
      i--
    }
    let valid = false
    if (total%10 === 0) {
      valid = true
    }
    return valid
  }

  const CheckEntire = () => {
    let _valid = false
    if (valid && validExp && validCvv) {
      _valid = true
    }
    props.onChange({
      valid: _valid,
      values: {
        number: rawCC.split(' ').join(''),
        expiry: displayExp,
        cvc: numericCvv
      }
    })
  }

  const getBrand = cur_val => {
    // get rid of anything but numbers
    cur_val = cur_val.replace(/\D/g, '')

    // checks per each, as their could be multiple hits
    //fix: ordering matter in detection, otherwise can give false results in rare cases
    var sel_brand = "unknown"
    if (cur_val.match(jcb_regex)) {
      sel_brand = "jcb"
    } else if (cur_val.match(amex_regex)) {
      sel_brand = "amex"
    } else if (cur_val.match(diners_regex)) {
      sel_brand = "diners_club"
    } else if (cur_val.match(visa_regex)) {
      sel_brand = "visa"
    } else if (cur_val.match(mastercard_regex)) {
      sel_brand = "mastercard"
    } else if (cur_val.match(discover_regex)) {
      sel_brand = "discover"
    } else if (cur_val.match(maestro_regex)) {
      if (cur_val[0] == '5') { //started 5 must be mastercard
          sel_brand = "mastercard"
      } else {
         sel_brand = "maestro" //maestro is all 60-69 which is not something else, thats why this condition in the end
      }
    }
    return sel_brand
  }

  return(
    <View style={{flexDirection:'row', backgroundColor:'white', borderRadius: 5, alignItems:'center'}}>
      <View style={{flexGrow:1}}>
        {showNumberInput && 
          <TextInput
            label="Card Number"
            keyboardType="numeric"
            placeholder="1234 1234 1234 1234"
            value={displayCC}
            onChangeText={text=>setRawCC(text)}
            ref={numInp}
          />
        }
        {showExpCVC &&
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <TextInput
                style={[props.inputStyle!==undefined?props.inputStyle:{},{color: valid?props.validColor!==undefined?props.validColor:'green':props.invalidColor!==undefined?props.invalidColor:'red'} ]}
                value={"..."+displayCC.slice(-4)}
                onFocus={()=>setShowNumberInput(true)}
              />
            </View>
            <View style={{flex: 1}}>
              <TextInput
                ref={expInp}
                value={displayExp}
                onChangeText={text=>setExp(text)}
                placeholder="MM/YY"
                keyboardType="numeric"
                label="Expiration Date"
              />
            </View>
            <View style={{flex: 1}}>
              <TextInput
                ref={cvvInp}
                value={cvv}
                onChangeText={text=>setCvv(text)}
                placeholder="CVV"
                keyboardType="numeric"
                label="CVV"
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
