const CHARSET = "UTF-8";
const AES_KEY_LENGTH = 256;
const AES_ALGORITHM = "AES-CBC";

async function encryptData(data, key) {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);

    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const secretKey = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: AES_ALGORITHM, length: AES_KEY_LENGTH },
      false,
      ["encrypt"]
    );

    const cipher = await window.crypto.subtle.encrypt(
      { name: AES_ALGORITHM, iv: iv },
      secretKey,
      encoder.encode(data)
    );

    const combinedData = new Uint8Array(iv.length + cipher.byteLength);
    combinedData.set(iv);
    combinedData.set(new Uint8Array(cipher), iv.length);

    const encryptedBase64 = window.btoa(String.fromCharCode(...combinedData));
    return encryptedBase64;
  } catch (error) {
    console.error(error);
  }
}

async function decryptData(encryptedData, key) {
  try {
    const encoder = new TextEncoder();
    const combinedData = new Uint8Array(
      [...window.atob(encryptedData)].map((char) => char.charCodeAt(0))
    );

    const iv = combinedData.slice(0, 16);
    const secretKey = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(key),
      { name: AES_ALGORITHM, length: AES_KEY_LENGTH },
      false,
      ["decrypt"]
    );

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: AES_ALGORITHM, iv: iv },
      secretKey,
      combinedData.subarray(16)
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error(error);
    return "Wrong_key";
  }
}

function encrypt() {
  const keyInput = document.getElementById("ekey").value;
  const plaintextInput = document.getElementById("edata").value;
  if (keyInput === "" || plaintextInput === "") {
    alert("Please Enter Data and KEY");
  } else {
    const key = addKeyLength(keyInput);
    encryptData(plaintextInput, key).then((encrypted) => {
      document.getElementById("eoutput").value = encrypted;
    });
    var clearkey = document.getElementById("ekey");
    var cleartext = document.getElementById("edata");
    clearkey.value="";
    cleartext.value="";
  }
}
function decrypt() {
  const keyInput = document.getElementById("dkey").value;
  const encryptedText = document.getElementById("ddata").value;
  if (keyInput === "" || encryptedText === "") {
    alert("Please Enter Data and KEY");
  } else {
    const key = addKeyLength(keyInput);
    decryptData(encryptedText, key).then((decrypted) => {
      document.getElementById("doutput").value = decrypted;
    });
    var clearkey = document.getElementById("dkey");
    
    clearkey.value="";
    
  }
}

function addKeyLength(input) {
  while (input.length < 16) {
    // Change to 32 for a 256-bit key
    input += input;
  }
  return input.substring(0, 16); // Change to 32 for a 256-bit key
}

function gotoencrypt() {
  var page1 = document.getElementById("page1");
  var encryptpage = document.getElementById("encryptpage");
  var decryptpage = document.getElementById("decryptpage");

  page1.style.display = "none";
  encryptpage.style.display = "block";
  decryptpage.style.display = "none";
}
function gotodecrypt() {
  var page1 = document.getElementById("page1");
  var encryptpage = document.getElementById("encryptpage");
  var decryptpage = document.getElementById("decryptpage");

  page1.style.display = "none";
  encryptpage.style.display = "none";
  decryptpage.style.display = "block";
}
function back() {
  var page1 = document.getElementById("page1");
  var encryptpage = document.getElementById("encryptpage");
  var decryptpage = document.getElementById("decryptpage");

  page1.style.display = "block";
  encryptpage.style.display = "none";
  decryptpage.style.display = "none";
}

function copyToClipboard(flag) {
  if (flag === "enc") {
    const output = document.getElementById("eoutput").value;
    if (output === "") {
      alert("There is nothing to copy");
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("copy Successful")
    }
  }else if(flag==='dec'){
    const output = document.getElementById("doutput").value;
    if (output === "") {
      alert("There is nothing to copy");
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("copy Successful")
    }
  }
}
