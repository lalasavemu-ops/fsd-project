// Login System with OTP Verification

// Check if user is already logged in
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("userLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = "home.html";
  }
}

// Run on page load
checkLoginStatus();

// DOM Elements
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const mobileInput = document.getElementById("mobile");
const emailInput = document.getElementById("email");
const sendOtpBtn = document.getElementById("send-otp-btn");
const otpDisplaySection = document.getElementById("otp-display-section");
const otpInputSection = document.getElementById("otp-input-section");
const otpDisplay = document.getElementById("otp-display");
const otpInput = document.getElementById("otp-input");
const verifyOtpBtn = document.getElementById("verify-otp-btn");
const resendOtpBtn = document.getElementById("resend-otp-btn");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

// Global variables to store data
let generatedOTP = null;
let userFormData = {};

// Validation Functions
function validateName(name) {
  return name.trim().length >= 3;
}

function validateMobile(mobile) {
  return /^\d{10}$/.test(mobile);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, message) {
  const errorElement = document.getElementById(fieldId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  document.getElementById("name-error").textContent = "";
  document.getElementById("mobile-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("otp-error").textContent = "";
}

function showMessage(type, message) {
  if (type === "error") {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    successMessage.classList.add("hidden");
  } else if (type === "success") {
    successMessage.textContent = message;
    successMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }
}

function hideMessage() {
  errorMessage.classList.add("hidden");
  successMessage.classList.add("hidden");
}

// Generate OTP (6 digits)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Button Click Handler
sendOtpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearErrors();
  hideMessage();

  const name = usernameInput.value.trim();
  const mobile = mobileInput.value.trim();
  const email = emailInput.value.trim();

  // Validate inputs
  let hasError = false;

  if (!validateName(name)) {
    showError("name-error", "Name must be at least 3 characters");
    hasError = true;
  }

  if (!validateMobile(mobile)) {
    showError("mobile-error", "Mobile number must be 10 digits");
    hasError = true;
  }

  if (!validateEmail(email)) {
    showError("email-error", "Please enter a valid email address");
    hasError = true;
  }

  if (hasError) {
    showMessage("error", "Please fix the errors above");
    return;
  }

  // Store user data
  userFormData = { name, mobile, email };

  // Generate OTP
  generatedOTP = generateOTP();

  // Display OTP (demo purposes)
  otpDisplay.textContent = generatedOTP;

  // Show OTP display section
  otpDisplaySection.classList.remove("hidden");

  // Show success message
  showMessage("success", `OTP sent to ${email}`);

  // Disable send button and form inputs
  sendOtpBtn.disabled = true;
  usernameInput.disabled = true;
  mobileInput.disabled = true;
  emailInput.disabled = true;

  // Show OTP input section after 2 seconds (simulating OTP delivery)
  setTimeout(() => {
    otpInputSection.classList.remove("hidden");
    otpInput.focus();
  }, 2000);
});

// Verify OTP Button Click Handler
verifyOtpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearErrors();
  hideMessage();

  const enteredOTP = otpInput.value.trim();

  // Validate OTP input
  if (!enteredOTP) {
    showError("otp-error", "Please enter OTP");
    return;
  }

  if (enteredOTP.length !== 6) {
    showError("otp-error", "OTP must be 6 digits");
    return;
  }

  // Compare OTP
  if (enteredOTP === generatedOTP) {
    // OTP is correct
    showMessage("success", "Login successful! Redirecting...");

    // Store login status
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userName", userFormData.name);
    localStorage.setItem("userEmail", userFormData.email);
    localStorage.setItem("userMobile", userFormData.mobile);

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
  } else {
    // OTP is incorrect
    showError("otp-error", "Incorrect OTP. Please try again");
    showMessage("error", "OTP verification failed. Please check and try again.");
    otpInput.value = "";
    otpInput.focus();
  }
});

// Resend OTP Button
resendOtpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearErrors();

  // Generate new OTP
  generatedOTP = generateOTP();

  // Display new OTP
  otpDisplay.textContent = generatedOTP;

  // Clear input
  otpInput.value = "";

  // Show message
  showMessage("success", "New OTP has been sent!");

  // Hide input section and show again after delay
  otpInputSection.classList.add("hidden");
  setTimeout(() => {
    otpInputSection.classList.remove("hidden");
    otpInput.focus();
  }, 2000);
});

// Allow Enter key to verify OTP
otpInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    verifyOtpBtn.click();
  }
});

// Allow Enter key to send OTP
loginForm.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && otpSection.classList.contains("hidden")) {
    sendOtpBtn.click();
  }
});
