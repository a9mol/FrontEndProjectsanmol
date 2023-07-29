const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox");

const symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider()
//set strength circle color to gray
setIndecator("#ccc")


function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize=( (passwordLength-min)*100/(max-min))+"%100%"
}

function setIndecator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px ${color}`
    //shadow
}


//This function generate a random value between min and max
function getRandInteger(min, max) {
    console.log(Math.floor(Math.random() * (max - min)) + min)
  return Math.floor(Math.random() * (max - min)) + min;

}

function generateRandomNumber() {
    return getRandInteger(0, 9);
}
function generateLowerCase() {
  return  String.fromCharCode(getRandInteger(97, 123));
   
}
function generateUpperCase() {
    // console.log(String.fromCharCode(getRandInteger(65, 91)))
   return String.fromCharCode(getRandInteger(65, 91));

}

function generateSymbol() {
    const randNum = getRandInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndecator("#0f0");
    }
    else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndecator('#ff0');
    }
    else {
        setIndecator("#f00");
    }
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copide";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shuffelPassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })
    //Special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
    // console.log(passwordLength)
})
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    //NONE OF THE CHECKBOX ARE SELECTED
    if (checkCount == 0)
        return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // let's start the journy to find new password
    //remove old passwod
    password = "";
    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=lowercaseCheck();
    // }
    // if(numberCheck.checked){
    //     password+=numberCheck();
    // }
    // if(symbolsCheck.checked){
    //     password+=symbolsCheck();
    // }
    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numberCheck.checked)    funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked)   funcArr.push(generateSymbol);
    
    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();

    }
    // console.log(funcArr.length)
    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        
        let randIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log(passwordLength)
    //shuffel the password


    password = shuffelPassword(Array.from(password));
    passwordDisplay.value = password;
    //calling calculate strength
    calcStrength();

})