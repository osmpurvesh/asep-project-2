// Global variables
let currentUser = null;
let users = []; // This will be populated with sample data
let matches = [];
let conversations = {};
let itineraries = [];
let currentChatUser = null;

// Sample data for demonstration
const sampleUsers = [
    {
        id: 'user1',
        name: 'Sarah Johnson',
        age: 28,
        interests: ['beach', 'adventure', 'culture'],
        budget: 'moderate',
        travelStyle: 'explorer',
        location: 'Mumbai',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d5f1?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: 'user2',
        name: 'Mike Chen',
        age: 32,
        interests: ['mountains', 'adventure', 'wildlife'],
        budget: 'moderate',
        travelStyle: 'backpacker',
        location: 'Delhi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: 'user3',
        name: 'Emma Davis',
        age: 26,
        interests: ['city', 'culture', 'beach'],
        budget: 'luxury',
        travelStyle: 'luxury',
        location: 'Bangalore',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: 'user4',
        name: 'Raj Patel',
        age: 29,
        interests: ['mountains', 'adventure', 'culture'],
        budget: 'budget',
        travelStyle: 'backpacker',
        location: 'Pune',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
];

// Authentication functions
function showAuthModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    const title = document.getElementById('authModalTitle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (type === 'login') {
        title.textContent = 'Login to Tripnic';
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        title.textContent = 'Join Tripnic';
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
    modal.show();
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading
    const btn = this.querySelector('button');
    const text = btn.querySelector('.login-text');
    const loading = btn.querySelector('.loading');
    text.classList.add('hidden');
    loading.classList.remove('hidden');
    
    // Simulate API call - In a real app, this would be a server-side authentication
    setTimeout(() => {
        // For demo purposes, we'll just check if the email exists in our sample users
        // In a real app, NEVER do authentication like this - passwords should be hashed and checked server-side
        const user = sampleUsers.find(u => u.email === email);
        
        if (user) {
            currentUser = user;
            showNotification('Login successful!', 'success');
            hideAuthModal();
            showDashboard();
        } else {
            showNotification('Invalid credentials!', 'error');
        }
        
        // Hide loading
        text.classList.remove('hidden');
        loading.classList.add('hidden');
    }, 1000);
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Show loading
    const btn = this.querySelector('button');
    const text = btn.querySelector('.signup-text');
    const loading = btn.querySelector('.loading');
    text.classList.add('hidden');
    loading.classList.remove('hidden');
    
    // Simulate API call - In a real app, this would be a server-side registration
    setTimeout(() => {
        // For demo purposes, we'll just create a user object
        // In a real app, NEVER store passwords like this - they should be hashed server-side
        const newUser = {
            id: 'user_' + Date.now(),
            name: firstName + ' ' + lastName,
            email: email,
            interests: [],
            budget: 'moderate',
            travelStyle: 'explorer',
            age: 25,
            avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=667eea&color=fff`
        };
        
        currentUser = newUser;
        showNotification('Account created successfully!', 'success');
        hideAuthModal();
        showDashboard();
        
        // Hide loading
        text.classList.remove('hidden');
        loading.classList.add('hidden');
    }, 1000);
});

function hideAuthModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    if (modal) modal.hide();
}

function logout() {
    currentUser = null;
    showNotification('Logged out successfully!', 'success');
    hideDashboard();
    updateNavigation();
}

function updateNavigation() {
    const loginNav = document.getElementById('loginNav');
    const signupNav = document.getElementById('signupNav');
    const userNav = document.getElementById('userNav');
    
    if (currentUser) {
        loginNav.classList.add('hidden');
        signupNav.classList.add('hidden');
        userNav.classList.remove('hidden');
        document.getElementById('userName').textContent = currentUser.name;
    } else {
        loginNav.classList.remove('hidden');
        signupNav.classList.remove('hidden');
        userNav.classList.add('hidden');
    }
}

// Dashboard functions
function showDashboard() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('features').style.display = 'none';
    document.getElementById('how-it-works').style.display = 'none';
    document.getElementById('dashboard').classList.remove('hidden');
    document.querySelector('.navbar').style.display = 'none';
    
    loadUserProfile();
    loadMatches();
    loadItineraries();
    loadTrips();
}

function hideDashboard() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('features').style.display = 'block';
    document.getElementById('how-it-works').style.display = 'block';
    document.getElementById('dashboard').classList.add('hidden');
    document.querySelector('.navbar').style.display = 'block';
}

// ... [rest of the code remains the same, just remove any localStorage usage for user data]

// Initialize app
function initApp() {
    // Initialize with sample users (without passwords)
    users = sampleUsers;
    
    // For demo purposes, we'll check if there's a current user
    // In a real app, this would be a session check with the server
    updateNavigation();
}

// Event listeners
document.addEventListener('DOMContentLoaded', initApp);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});