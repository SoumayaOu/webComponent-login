const template = document.createElement("template");
template.innerHTML = `
<style>
body {font-family: Arial, Helvetica, sans-serif;}
form {padding: 15px 15px;
      position:relative; }
      input[type=text], input[type=password] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }
      button {
        background-color: #1687a7;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        cursor: pointer;
        width: 100%;
      }
      
      button:hover {
        opacity: 0.8;
      }
</style>
  <div class='login-form' >
    <form id='login' action='/' method="post">
      <div class='group-item>
        <label for='email' >Email<label/>
        <input id="email" name = "email" label="Email" type="text" placeholder="Email" /> 
      </div>
      <div class='group-item>
        // <label for='password'>Password<label/>
        <input id="password" name= "password" label="Password" type="password" placeholder="Password"/> 
      </div>
        <button type=submit>Log in </button>
    </form>
  </div>
`

const res = 'f2d81a260dea8a100dd517984e53c56a7523d96942a834b9cdc249bd4e8c7aa9';
// let res="";
let pass="";
const digestMessage=async (message)=> {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  //console.log("hash",(await Promise.resolve(hashHex)).toString())
  return hashHex;
  
}


class login extends HTMLElement{

    constructor(){
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
   
    this.$label = this.shadowRoot.querySelector("label");
    this.$input = this.shadowRoot.querySelector("input");
    this.$name = this.shadowRoot.querySelector("name");
    this.$form = this.shadowRoot.querySelector("form");
}

static get observedAttributes() {
  return ["value", "label", "type", "invalid"];
}
attributeChangedCallback(name, oldValue, newValue) {
  switch (name) {
    case "label":
      this.$label.innerText = `${newValue}:`;
      break;
    case "type":
      this.$input.type = newValue;
      break;
    case "invalid":
      this._handleInvalidState(newValue);
      break;
    default:
      break;
  }
}
connectedCallback() {
  let email="";
  let password="";
  if (this.$form.isConnected) {
    console.log('label',this.$form[1])
    this.$input.addEventListener("blur", event => {
      if (!event.target.value) {
        this.invalid = true;
        console.log('invalid')
      } else {
        this.invalid = false;
        this.value = event.target.value;
        email=this.value;
        console.log('email value',email)
      }
    });
    this.$form[1].addEventListener("blur", event => {
      
      if (!event.target.value) {
        this.invalid = true;
        console.log('invalid')
      } else {
        this.invalid = false;
        
        digestMessage(event.target.value)
      .then((digestHex) => {
          pass=digestHex
         console.log("pass: ",digestHex)
       }
       );
        this.value = pass;
        
        
      }
    });
  }
  this.$form.children[2].addEventListener("click",()=>{
   
    if(email.length<=0 || pass.length<=0)
      alert("please fill the required fields")

      else{
        
    if(email=="s@gmail.com" && pass==res)
    alert(" logged in successfully")
    else alert("failed !!!")
    }
    
  })
}

 
get invalid() {
  return this.hasAttribute("invalid");
}

set invalid(value) {
  if (!!value) {
    this.setAttribute("invalid", "");
  } else {
    this.removeAttribute("invalid");
  }
}

get value() {
  return this.getAttribute("value");
}

set value(newValue) {
  this.setAttribute("value", newValue);
}




}
window.customElements.define('login-form',login)