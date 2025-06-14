// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx-xqbnSjjdo_PKRYxR0boW5J80kOnczQ",
  authDomain: "tripnic-web.firebaseapp.com",
  projectId: "tripnic-web",
  storageBucket: "tripnic-web.appspot.com",
  messagingSenderId: "14398503857",
  appId: "1:14398503857:web:db749c0aafaec5dd909b90",
  measurementId: "G-34V03BGJ8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Form submission handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get input values
  const firstName = document.getElementById('signupFirstName').value;
  const lastName = document.getElementById('signupLastName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const termsChecked = document.getElementById('termsCheck').checked;

  // Validate inputs
  if (!termsChecked) {
    alert('Please agree to the Terms of Service and Privacy Policy');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    alert('Password should be at least 6 characters');
    return;
  }

  // Show loading state
  const submitBtn = document.querySelector('#signupForm .btn-custom');
  submitBtn.querySelector('.signup-text').classList.add('hidden');
  submitBtn.querySelector('.loading').classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with first and last name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    alert('Account created successfully!');
    // Redirect or do something after successful signup
    window.location.href = 'dashboard.html';
    
  } catch (error) {
    console.error('Error during signup:', error);
    
    // Handle specific errors
    let errorMessage = 'An error occurred during signup.';
    switch(error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
    }
    
    alert(errorMessage);
  } finally {
    // Reset loading state
    submitBtn.querySelector('.signup-text').classList.remove('hidden');
    submitBtn.querySelector('.loading').classList.add('hidden');
    submitBtn.disabled = false;
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Show loading state
  const loginBtn = document.querySelector('#loginForm .btn-custom');
  loginBtn.querySelector('.login-text').classList.add('hidden');
  loginBtn.querySelector('.loading').classList.remove('hidden');
  loginBtn.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'preference.html';
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    switch(error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Account temporarily disabled due to many failed attempts';
        break;
    }
    alert(errorMessage);
  } finally {
    loginBtn.querySelector('.login-text').classList.remove('hidden');
    loginBtn.querySelector('.loading').classList.add('hidden');
    loginBtn.disabled = false;
  }
});