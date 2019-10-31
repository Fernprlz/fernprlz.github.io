var activityID
var currentModalID
var panelID
var numberOfVerticalBoxes = 3

// Opens a modal (pop-up) depending on its ID
function openModal(elem, modalID){
  // Global variables are set so we can access them later
  // these are activity and panel ID, so we can operate with them in archive/remove/share
  setActivityID(elem)
  setPanelID(elem)
  currentModalID = modalID

  // Set Share pop-up title to the activity title
  if (modalID == "modalShare"){
    prepareShare()
  }

  // Make the modal and the overlay visibles
  const modal = document.getElementById(currentModalID)
  modal.classList.add("active")
  const overlay = document.getElementById("overlay")
  overlay.classList.add("active")
}

// Set Share pop-up title to the activity title
function prepareShare(){
  // Retrieve children of the current element of the DOM
  const activityChild = document.querySelectorAll('#' + activityID + ' .activity-title')
  // Retrieve the title of the nearest element belonging to the activity-title class
  const activityTitle = activityChild[0].textContent

  // Change the modal title to the one we previously retrieved
  const modal = document.getElementById(currentModalID)
  const modalChild = document.querySelectorAll('#modalShare .modal-title')
  modalChild[0].textContent = activityTitle
}

function setActivityID(elem){
  // While cicle to access the ID of the parent DIV
  while (elem && (elem.tagName != "DIV" || !elem.id))
  elem = elem.parentNode;
  if (elem) // Check we found a DIV with an ID
  // record the ID on the activityID variable so we can remove it
  activityID = elem.id
}

function setPanelID(elem){
  // While cicle to access the ID of the parent DIV
  var a = 0
  while (elem && !elem.id.includes("panel")){
    elem = elem.parentNode
  }
  if (elem) // Check we found a DIV with an ID
  // record the ID on the activityID variable so we can remove it
  panelID = elem.id
}

// Close the modal and perform pertinent actions
function closeModal(choice){
  const modal = document.getElementById(currentModalID)
  modal.classList.remove("active")
  const overlay = document.getElementById("overlay")
  overlay.classList.remove("active")
  if (currentModalID == "modalDelete" && choice.id == "yes")
    // Remove the selected activity
    removeElementByID(activityID)
  else if (currentModalID == "modalArchive" && choice.id == "yes") {
    // Remove the vertical box and resize the ones still active
    removeElementByID(panelID)
    --numberOfVerticalBoxes;
    resizeVerticalBoxes()
  }

  // Reset global variables
  activityID = null
  currentModalID = null
}

// Removes the element with the specified ID
function removeElementByID(elementId) {
  // Removes an element from the document
  var element = document.getElementById(elementId)
  element.parentNode.removeChild(element)
}

// Resize active vertical boxes, leaving a gap between them
function resizeVerticalBoxes(){
  // go inside each vertical box
  // set width to 100/numberOfVerticalBoxes
  const verticalBoxArray = document.querySelectorAll('.vertical-box')
  for(var ii = 0; ii < verticalBoxArray.length; ii++){
    var newWidth = (100/numberOfVerticalBoxes) - 0.3
    verticalBoxArray[ii].style.width = newWidth +"%";
  }
}

// Change like button image to highlight it
function like(elem){
  if (elem.src.indexOf("images/like0.png") != -1){
    elem.src = "images/like1.png"
  } else {
    elem.src = "images/like0.png"
  }
}

// Shows the hamburguer menu
function showMenu(elem){
  // First toggle show on every open menu
  hideAllMenus()
  // Then toggle show on the clicked menu
  document.getElementById(elem).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.hamburguer-icon')) {
    hideAllMenus()
  }
}

// Hides all active dropdown-menus
function hideAllMenus(){
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
}

// Validates the form and performs pertinent actions
function validateForm(){
  var valid = true;
  var password = document.forms["registrationForm"]["password"].value;
  var email = document.forms["registrationForm"]["email"].value;
  var username = document.forms["registrationForm"]["username"].value;
  // REGEX VALIDATION
  // Alphanumeric values, capital letters available
  var rePassword = /^[a-zA-Z0-9]*$/;
  // i.e: sample@server.com
  var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Check password validity
  if(password.length > 8 || rePassword.test(String(password)) == false){
    alert("Password is invalid, please check that it satisfies:"+
    "\n - Maximum 8 characters."+
    "\n - Only contains letters (upper or underscore) or numbers [0-9].")
    valid = false;
  }

  // Check e-mail validity
  if(reEmail.test(String(email).toLowerCase()) == false){
    alert("Please, insert a valid e-Mail address:\nexample@server.com")
    valid = false;
  }

  // If both tests are passed, check if the email exist.
  if(valid == true){
    if (emailExists(email)){
      alert("Email has already been used")
    } else {
      // If it exists, store a cookie, notify the user and load login page.
      storeCookie(email, password, username)
      alert("Account created succesfully!")
      window.location.replace("loginPage.html")
      // Return false so that the redirection works insted of going to the page
      // that is generated after submitting the form.
      return false;
    }
  }
  return valid
}

// Searches the email in the cookie string
function emailExists(email){
  return (document.cookie.indexOf(email) == -1) ? false : true;
}

// Stores the email, password and username on the cookie
function storeCookie(email, password, username){
  var d = new Date();
  // Set expiration date to 1 year
  d.setTime(d.getTime() + (365*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  // We store the email and password on the same cookie as:
  // example@email.com=password/username
  document.cookie = email + "=" + password + "/" + username + ";" + expires + ";path=/";
  return
}

// Logs in and redirects the user to its page
function logIn(){
  // Retrieves the email and password from the form
  var email = document.forms["loginForm"]["email"].value;
  var password = document.forms["loginForm"]["password"].value;

  if(correctLogIn(email, password)){
    // Load the page
    window.location.replace("index2.html")

    // Change the page title to the username
    // First save the username in a global variable
    titleUsername = getUsername(email)
    localStorage.setItem("titleUsername", titleUsername);
    return false

  }else{
    alert("This combination email/password doesn't exist.\nPlease, try again.")
    return false
  }

}

// Compares the password assigned to the inserted email on the cookie with
// the inserted password
function correctLogIn(email, password){
  var cookiePassword = getPassword(email)
  if (cookiePassword == password){
    return true;
  } else {
    return false;
  }
}

// Retrieves the password given an email
function getPassword(email){
  var cookieValue = getCookie(email)
  return splitValue(cookieValue)[0]
}

// Retrieves the username given an email
function getUsername(email){
  var cookieValue = getCookie(email)
  return splitValue(cookieValue)[1]
}

// Extracts the password and the username from the cookie value and returns an array
function splitValue(value){
  var middleIndex = value.indexOf("/")

  var result = []
  result[0] = value.substring(0, middleIndex)
  result[1] = value.substring(middleIndex + 1, value.length)
  return result
}

// Retrieve value of a cookie from its "name"
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Upon loading, check in localStorage for a change on the username to be displayed
window.onload = function(){
  var newTitle = localStorage.getItem("titleUsername");
  if (newTitle != 'null' && newTitle != null){
    var pageTitle = document.getElementById('username')
    pageTitle.innerHTML = newTitle
    localStorage.removeItem("titleUsername");
  }
}
