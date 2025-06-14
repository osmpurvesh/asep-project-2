/**
 * Tripnic Dashboard - Main Application Script
 * 
 * This script handles all dashboard functionality including:
 * - User profile management
 * - Travel match discovery
 * - Messaging system
 * - Itinerary planning
 * - Trip management
 */

class TripnicDashboard {
  constructor() {
    // Initialize properties
    this.currentUser = null;
    this.currentSection = 'profile';
    this.activeConversation = null;
    
    // DOM Elements
    this.dom = {
      sections: {
        profile: document.getElementById('profile-section'),
        matches: document.getElementById('matches-section'),
        chat: document.getElementById('chat-section'),
        itinerary: document.getElementById('itinerary-section'),
        trips: document.getElementById('trips-section')
      },
      sidebarLinks: document.querySelectorAll('.sidebar-nav a'),
      profileForm: document.getElementById('profileForm'),
      matchesContainer: document.getElementById('matchesContainer'),
      chatList: document.getElementById('chatList'),
      chatMessages: document.getElementById('chatMessages'),
      messageInput: document.getElementById('messageInput'),
      itineraryItems: document.getElementById('itineraryItems'),
      tripsContainer: document.getElementById('tripsContainer')
    };
    
    // Initialize the dashboard
    this.init();
  }
  
  /**
   * Initialize the dashboard
   */
  init() {
    // Load user data
    this.loadUserData();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load initial data
    this.loadInitialData();
    
    // Show default section
    this.showSection(this.currentSection);
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Profile form submission
    this.dom.profileForm.addEventListener('submit', (e) => this.saveProfile(e));
    
    // Message input (handle Enter key)
    this.dom.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
    
    // Sidebar navigation
    this.dom.sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('onclick').match(/showDashboardSection\('(\w+)'\)/)[1];
        this.showSection(section);
      });
    });
  }
  
  /**
   * Load initial data
   */
  loadInitialData() {
    this.loadMatches();
    this.loadChats();
    this.loadItineraries();
    this.loadTrips();
  }
  
  /**
   * Show a specific dashboard section
   * @param {string} section - Section to show (profile, matches, chat, itinerary, trips)
   */
  showSection(section) {
    // Hide all sections
    Object.values(this.dom.sections).forEach(sec => {
      sec.classList.add('hidden');
    });
    
    // Remove active class from all sidebar links
    this.dom.sidebarLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Show selected section
    this.dom.sections[section].classList.remove('hidden');
    
    // Add active class to clicked link
    const activeLink = Array.from(this.dom.sidebarLinks).find(link => 
      link.getAttribute('onclick').includes(section)
    );
    if (activeLink) activeLink.classList.add('active');
    
    // Update current section
    this.currentSection = section;
    
    // Update page title
    document.title = `${section.charAt(0).toUpperCase() + section.slice(1)} | Tripnic Dashboard`;
    
    // Section-specific initialization
    switch(section) {
      case 'chat':
        if (!this.activeConversation) {
          this.dom.messageInput.disabled = true;
          document.querySelector('#chat-section button[onclick="sendMessage()"]').disabled = true;
        }
        break;
    }
  }
  
  /**
   * Load user data
   */
  loadUserData() {
    // In a real app, this would come from your backend/API
    this.currentUser = {
      id: 'user1',
      name: "Sarah Johnson",
      email: "sarah@example.com",
      age: 28,
      location: "Mumbai",
      bio: "Passionate traveler who loves adventure and meeting new people. Always looking for my next great adventure!",
      interests: ["beach", "adventure", "culture"],
      budget: "moderate",
      travelStyle: "explorer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612d5f1?w=150&h=150&fit=crop&crop=face"
    };
    
    // Populate profile form
    document.getElementById('fullName').value = this.currentUser.name;
    document.getElementById('age').value = this.currentUser.age;
    document.getElementById('bio').value = this.currentUser.bio;
    document.getElementById('budget').value = this.currentUser.budget;
    document.getElementById('travelStyle').value = this.currentUser.travelStyle;
    
    // Check interest checkboxes
    this.currentUser.interests.forEach(interest => {
      const checkbox = document.getElementById(interest);
      if (checkbox) checkbox.checked = true;
    });
    
    // Update profile preview
    this.updateProfilePreview();
    
    // Update sidebar
    document.getElementById('sidebar-email').textContent = this.currentUser.email;
    document.querySelector('.profile-avatar').src = this.currentUser.avatar;
  }
  
  /**
   * Update the profile preview card
   */
  updateProfilePreview() {
    document.getElementById('profile-name').textContent = this.currentUser.name;
    document.getElementById('profile-age-location').textContent = 
      `${this.currentUser.age} years • ${this.currentUser.location}`;
    document.getElementById('profile-budget').textContent = 
      `${this.currentUser.budget.charAt(0).toUpperCase() + this.currentUser.budget.slice(1)} Budget`;
    document.getElementById('profile-style').textContent = 
      this.currentUser.travelStyle.charAt(0).toUpperCase() + this.currentUser.travelStyle.slice(1);
    
    // Update interests in preview
    const interestsContainer = document.getElementById('profile-interests');
    interestsContainer.innerHTML = this.currentUser.interests.map(interest => 
      `<span class="badge bg-light text-dark me-1">${interest.charAt(0).toUpperCase() + interest.slice(1)}</span>`
    ).join('');
  }
  
  /**
   * Save profile data
   * @param {Event} e - Form submit event
   */
  saveProfile(e) {
    e.preventDefault();
    
    // Get form values
    this.currentUser.name = document.getElementById('fullName').value;
    this.currentUser.age = document.getElementById('age').value;
    this.currentUser.bio = document.getElementById('bio').value;
    this.currentUser.budget = document.getElementById('budget').value;
    this.currentUser.travelStyle = document.getElementById('travelStyle').value;
    
    // Get selected interests
    this.currentUser.interests = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
      this.currentUser.interests.push(checkbox.value);
    });
    
    // In a real app, you would save this to your backend
    console.log("Profile saved:", this.currentUser);
    
    // Show success message
    this.showNotification('Profile updated successfully!', 'success');
    
    // Update the profile preview
    this.updateProfilePreview();
  }
  
  /**
   * Load travel matches
   */
  loadMatches() {
    // In a real app, this would come from your backend/API
    const matches = [
      {
        id: 'user2',
        name: 'Mike Chen',
        age: 32,
        location: 'Delhi',
        matchScore: 87,
        interests: ['mountains', 'adventure', 'wildlife'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'user3',
        name: 'Emma Davis',
        age: 26,
        location: 'Bangalore',
        matchScore: 76,
        interests: ['city', 'culture', 'beach'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'user4',
        name: 'Raj Patel',
        age: 29,
        location: 'Pune',
        matchScore: 92,
        interests: ['mountains', 'adventure', 'culture'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    ];
    
    // Clear existing matches
    this.dom.matchesContainer.innerHTML = '';
    
    // Add new matches
    matches.forEach(match => {
      const matchCard = document.createElement('div');
      matchCard.className = 'col';
      matchCard.innerHTML = `
        <div class="card match-card dashboard-card h-100" onclick="tripnicDashboard.viewMatch('${match.id}')">
          <div class="card-body text-center">
            <img src="${match.avatar}" alt="${match.name}" class="rounded-circle mb-3" width="100" height="100">
            <h5>${match.name}</h5>
            <p class="text-muted">${match.age} years • ${match.location}</p>
            <div class="match-score mb-3">${match.matchScore}% Match</div>
            <div class="d-flex flex-wrap justify-content-center">
              ${match.interests.map(interest => 
                `<span class="badge bg-light text-dark me-1 mb-1">${interest.charAt(0).toUpperCase() + interest.slice(1)}</span>`
              ).join('')}
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <button class="btn btn-sm btn-custom w-100" onclick="tripnicDashboard.startChat('${match.id}', event)">
              <i class="fas fa-comment"></i> Message
            </button>
          </div>
        </div>
      `;
      this.dom.matchesContainer.appendChild(matchCard);
    });
  }
  
  /**
   * Filter matches
   * @param {string} type - Filter type (all, recent, top)
   */
  filterMatches(type) {
    // In a real app, this would filter the matches from your backend
    console.log(`Filtering matches by: ${type}`);
    this.loadMatches(); // Reload matches with the filter applied
  }
  
  /**
   * View match profile
   * @param {string} userId - ID of the user to view
   */
  viewMatch(userId) {
    // In a real app, this would show a detailed profile view
    console.log(`Viewing profile for user: ${userId}`);
    this.showNotification(`Viewing profile for ${userId}`, 'info');
  }
  
  /**
   * Start chat with a match
   * @param {string} userId - ID of the user to chat with
   * @param {Event} event - Click event
   */
  startChat(userId, event) {
    if (event) event.stopPropagation();
    
    console.log(`Starting chat with user: ${userId}`);
    
    // Open the chat section
    this.showSection('chat');
    
    // Load the conversation
    this.loadConversation(userId);
  }
  
  /**
   * Load chat conversations
   */
  loadChats() {
    // In a real app, this would come from your backend/API
    const chats = [
      {
        id: 'conv1',
        userId: 'user2',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        lastMessage: 'Hey, are you still interested in the Goa trip?',
        time: '2 hours ago',
        unread: 3
      },
      {
        id: 'conv2',
        userId: 'user3',
        name: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        lastMessage: 'I found a great deal on flights!',
        time: '1 day ago',
        unread: 0
      }
    ];
    
    // Clear existing chats
    this.dom.chatList.innerHTML = '';
    
    // Add new chats
    chats.forEach(chat => {
      const chatItem = document.createElement('div');
      chatItem.className = `p-3 border-bottom chat-item ${chat.unread > 0 ? 'unread' : ''}`;
      chatItem.onclick = () => this.loadConversation(chat.userId);
      chatItem.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${chat.avatar}" alt="${chat.name}" class="rounded-circle me-3" width="40" height="40">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">${chat.name}</h6>
              <small class="text-muted">${chat.time}</small>
            </div>
            <p class="mb-0 text-truncate" style="max-width: 200px;">${chat.lastMessage}</p>
          </div>
          ${chat.unread > 0 ? `<span class="badge bg-primary ms-2">${chat.unread}</span>` : ''}
        </div>
      `;
      this.dom.chatList.appendChild(chatItem);
    });
  }
  
  /**
   * Load a conversation
   * @param {string} userId - ID of the user to chat with
   */
  loadConversation(userId) {
    // In a real app, this would load the conversation from your backend
    console.log(`Loading conversation with user: ${userId}`);
    this.activeConversation = userId;
    
    // Sample messages
    const messages = [
      {
        id: 'msg1',
        sender: userId,
        text: 'Hey there! How are you?',
        time: '10:30 AM'
      },
      {
        id: 'msg2',
        sender: 'current',
        text: 'I\'m good, thanks! How about you?',
        time: '10:32 AM'
      },
      {
        id: 'msg3',
        sender: userId,
        text: 'Doing well! Are you still interested in planning that trip to Goa next month?',
        time: '10:33 AM'
      }
    ];
    
    // Update chat header
    const chatHeader = document.getElementById('chatHeader');
    chatHeader.innerHTML = `
      <h6 class="mb-0">Conversation with ${userId === 'user2' ? 'Mike Chen' : 'Emma Davis'}</h6>
    `;
    
    // Display messages
    this.dom.chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sender === 'current' ? 'sent' : 'received'}`;
      messageDiv.innerHTML = `
        <div class="message-text">${msg.text}</div>
        <div class="message-time text-end small text-muted">${msg.time}</div>
      `;
      this.dom.chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    this.dom.chatMessages.scrollTop = this.dom.chatMessages.scrollHeight;
    
    // Enable message input
    this.dom.messageInput.disabled = false;
    document.querySelector('#chat-section button[onclick="tripnicDashboard.sendMessage()"]').disabled = false;
    this.dom.messageInput.focus();
  }
  
  /**
   * Send a message
   */
  sendMessage() {
    const message = this.dom.messageInput.value.trim();
    
    if (message) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Add message to UI
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message sent';
      messageDiv.innerHTML = `
        <div class="message-text">${message}</div>
        <div class="message-time text-end small text-muted">${timeString}</div>
      `;
      this.dom.chatMessages.appendChild(messageDiv);
      
      // In a real app, you would send this to your backend
      console.log(`Message sent to ${this.activeConversation}: ${message}`);
      
      // Clear input
      this.dom.messageInput.value = '';
      
      // Scroll to bottom
      this.dom.chatMessages.scrollTop = this.dom.chatMessages.scrollHeight;
    }
  }
  
  /**
   * Start a new chat
   */
  startNewChat() {
    // In a real app, this would open a modal to select a user to chat with
    console.log('Starting new chat');
    this.showNotification('In a real app, this would open a modal to select a user to chat with', 'info');
  }
  
  /**
   * Load itineraries
   */
  loadItineraries() {
    // In a real app, this would come from your backend/API
    const itineraries = [
      {
        id: 'it1',
        title: 'Goa Beach Vacation',
        destination: 'Goa, India',
        dates: 'Dec 15-20, 2023',
        description: 'Relaxing beach vacation with water sports and nightlife'
      },
      {
        id: 'it2',
        title: 'Himalayan Trek',
        destination: 'Himachal Pradesh, India',
        dates: 'May 5-12, 2024',
        description: 'Challenging trek through the Himalayas'
      }
    ];
    
    // Clear existing itineraries
    this.dom.itineraryItems.innerHTML = '';
    
    if (itineraries.length === 0) {
      this.dom.itineraryItems.innerHTML = `
        <div class="text-center text-muted py-5">
          <i class="fas fa-map-marked-alt fa-3x mb-3"></i>
          <p>No itineraries created yet</p>
          <button class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#newItineraryModal">
            Create Your First Itinerary
          </button>
        </div>
      `;
    } else {
      // Add itineraries
      itineraries.forEach(itinerary => {
        const item = document.createElement('div');
        item.className = 'itinerary-item';
        item.innerHTML = `
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5>${itinerary.title}</h5>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onclick="tripnicDashboard.editItinerary('${itinerary.id}')">Edit</a></li>
                <li><a class="dropdown-item" href="#" onclick="tripnicDashboard.deleteItinerary('${itinerary.id}')">Delete</a></li>
                <li><a class="dropdown-item" href="#" onclick="tripnicDashboard.shareItinerary('${itinerary.id}')">Share</a></li>
              </ul>
            </div>
          </div>
          <p class="text-muted"><i class="fas fa-map-marker-alt"></i> ${itinerary.destination}</p>
          <p class="text-muted"><i class="fas fa-calendar-alt"></i> ${itinerary.dates}</p>
          <p>${itinerary.description}</p>
          <button class="btn btn-sm btn-outline-primary" onclick="tripnicDashboard.viewItineraryDetails('${itinerary.id}')">
            View Details
          </button>
        `;
        this.dom.itineraryItems.appendChild(item);
      });
    }
  }
  
  /**
   * View itinerary details
   * @param {string} itineraryId - ID of the itinerary to view
   */
  viewItineraryDetails(itineraryId) {
    console.log(`Viewing details for itinerary: ${itineraryId}`);
    this.showNotification(`Viewing itinerary ${itineraryId} details`, 'info');
  }
  
  /**
   * Edit itinerary
   * @param {string} itineraryId - ID of the itinerary to edit
   */
  editItinerary(itineraryId) {
    console.log(`Editing itinerary: ${itineraryId}`);
    this.showNotification(`Editing itinerary ${itineraryId}`, 'info');
  }
  
  /**
   * Delete itinerary
   * @param {string} itineraryId - ID of the itinerary to delete
   */
  deleteItinerary(itineraryId) {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      console.log(`Deleting itinerary: ${itineraryId}`);
      // In a real app, this would delete from backend then reload
      this.loadItineraries();
      this.showNotification('Itinerary deleted successfully', 'success');
    }
  }
  
  /**
   * Share itinerary
   * @param {string} itineraryId - ID of the itinerary to share
   */
  shareItinerary(itineraryId) {
    console.log(`Sharing itinerary: ${itineraryId}`);
    this.showNotification(`Sharing itinerary ${itineraryId}`, 'info');
  }
  
  /**
   * Save itinerary
   */
  saveItinerary() {
    // Get form values
    const title = document.getElementById('tripTitle').value;
    const destination = document.getElementById('tripDestination').value;
    const startDate = document.getElementById('tripStartDate').value;
    const endDate = document.getElementById('tripEndDate').value;
    const description = document.getElementById('tripDescription').value;
    
    if (!title || !destination || !startDate || !endDate) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Format dates
    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();
    const dateRange = `${formattedStartDate} - ${formattedEndDate}`;
    
    // In a real app, you would save this to your backend
    console.log("Itinerary saved:", { title, destination, dateRange, description });
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('newItineraryModal'));
    modal.hide();
    
    // Show success message
    this.showNotification('Itinerary created successfully!', 'success');
    
    // Reload itineraries
    this.loadItineraries();
  }
  
  /**
   * Load trips
   */
  loadTrips() {
    // In a real app, this would come from your backend/API
    const trips = [
      {
        id: 'trip1',
        title: 'Goa Beach Vacation',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        dates: '15-20 Dec 2023',
        status: 'Completed',
        companions: ['Mike', 'Emma']
      },
      {
        id: 'trip2',
        title: 'Himalayan Trek',
        image: 'https://images.unsplash.com/photo-1580654712603-eb43273aff33?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        dates: '5-12 May 2024',
        status: 'Upcoming',
        companions: ['Raj']
      }
    ];
    
    // Clear existing trips
    this.dom.tripsContainer.innerHTML = '';
    
    // Add trips
    trips.forEach(trip => {
      const tripCard = document.createElement('div');
      tripCard.className = 'col';
      tripCard.innerHTML = `
        <div class="card trip-card dashboard-card h-100">
          <img src="${trip.image}" class="card-img-top" alt="${trip.title}">
          <div class="card-body">
            <h5 class="card-title">${trip.title}</h5>
            <p class="card-text text-muted"><i class="fas fa-calendar-alt"></i> ${trip.dates}</p>
            <p class="card-text"><i class="fas fa-users"></i> With: ${trip.companions.join(', ')}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="badge ${trip.status === 'Completed' ? 'bg-success' : 'bg-info'}">${trip.status}</div>
              <button class="btn btn-sm btn-outline-primary" onclick="tripnicDashboard.viewTripDetails('${trip.id}')">
                View Details
              </button>
            </div>
          </div>
        </div>
      `;
      this.dom.tripsContainer.appendChild(tripCard);
    });
  }
  
  /**
   * View trip details
   * @param {string} tripId - ID of the trip to view
   */
  viewTripDetails(tripId) {
    console.log(`Viewing details for trip: ${tripId}`);
    this.showNotification(`Viewing trip ${tripId} details`, 'info');
  }
  
  /**
   * Save trip
   */
  saveTrip() {
    // Get form values
    const name = document.getElementById('tripName').value;
    const location = document.getElementById('tripLocation').value;
    const start = document.getElementById('tripStart').value;
    const end = document.getElementById('tripEnd').value;
    
    if (!name || !location || !start || !end) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // In a real app, you would save this to your backend
    console.log("Trip saved:", { name, location, start, end });
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('newTripModal'));
    modal.hide();
    
    // Show success message
    this.showNotification('Trip added successfully!', 'success');
    
    // Reload trips
    this.loadTrips();
  }
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    const types = {
      success: { class: 'alert-success', icon: 'check-circle' },
      error: { class: 'alert-danger', icon: 'exclamation-circle' },
      info: { class: 'alert-info', icon: 'info-circle' }
    };
    
    const notification = document.createElement('div');
    notification.className = `alert ${types[type].class} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
      <i class="fas fa-${types[type].icon} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.getElementById('notificationContainer') || document.body;
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
  
  /**
   * Logout user
   */
  logout() {
    console.log('User logged out');
    // In a real app, this would clear the session and redirect
    window.location.href = 'index.html';
  }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.tripnicDashboard = new TripnicDashboard();
});

// profile.js - User Profile Management
class ProfileManager {
  constructor() {
    this.user = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      location: "New York",
      bio: "Travel enthusiast looking for adventure buddies!",
      interests: ["beach", "adventure"],
      budget: "moderate",
      travelStyle: "explorer",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    };
    
    this.initProfileSection();
  }
  
  initProfileSection() {
    // Load profile data into form
    document.getElementById('fullName').value = this.user.name;
    document.getElementById('age').value = this.user.age;
    document.getElementById('bio').value = this.user.bio;
    document.getElementById('budget').value = this.user.budget;
    document.getElementById('travelStyle').value = this.user.travelStyle;
    
    // Check interest checkboxes
    this.user.interests.forEach(interest => {
      const checkbox = document.getElementById(interest);
      if (checkbox) checkbox.checked = true;
    });
    
    // Set up form submission
    document.getElementById('profileForm').addEventListener('submit', (e) => this.saveProfile(e));
    
    // Set up edit button
    document.getElementById('editProfileBtn').addEventListener('click', () => this.editProfile());
    
    // Initialize profile preview
    this.updateProfilePreview();
  }
  
  saveProfile(e) {
    e.preventDefault();
    
    // Get form values
    this.user = {
      ...this.user,
      name: document.getElementById('fullName').value,
      age: document.getElementById('age').value,
      bio: document.getElementById('bio').value,
      budget: document.getElementById('budget').value,
      travelStyle: document.getElementById('travelStyle').value,
      interests: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value)
    };
    
    // Update UI
    this.updateProfilePreview();
    
    // Show success message
    this.showNotification('Profile updated successfully!', 'success');
    
    // In a real app, save to backend
    console.log('Profile saved:', this.user);
  }
  
  editProfile() {
    document.getElementById('profileForm').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('fullName').focus();
  }
  
  updateProfilePreview() {
    document.getElementById('profile-name').textContent = this.user.name;
    document.getElementById('profile-age-location').textContent = 
      `${this.user.age} years • ${this.user.location}`;
    document.getElementById('profile-budget').textContent = 
      `${this.user.budget.charAt(0).toUpperCase() + this.user.budget.slice(1)} Budget`;
    document.getElementById('profile-style').textContent = 
      this.user.travelStyle.charAt(0).toUpperCase() + this.user.travelStyle.slice(1);
    
    // Update interests
    const interestsContainer = document.getElementById('profile-interests');
    interestsContainer.innerHTML = this.user.interests.map(interest => 
      `<span class="badge bg-light text-dark me-1">${interest.charAt(0).toUpperCase() + interest.slice(1)}</span>`
    ).join('');
    
    // Update avatar
    document.querySelector('.profile-avatar').src = this.user.avatar;
  }
  
  showNotification(message, type) {
    // Notification implementation would be in a separate utility class
    console.log(`[${type}] ${message}`);
  }
}

// matches.js - Travel Matching System
class MatchSystem {
  constructor() {
    this.matches = [
      {
        id: 'user2',
        name: 'Sarah Smith',
        age: 28,
        location: 'Los Angeles',
        matchScore: 92,
        interests: ['beach', 'yoga', 'photography'],
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        lastActive: '2 hours ago'
      },
      {
        id: 'user3',
        name: 'Mike Johnson',
        age: 32,
        location: 'Chicago',
        matchScore: 87,
        interests: ['hiking', 'adventure', 'wildlife'],
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        lastActive: '1 day ago'
      },
      {
        id: 'user4',
        name: 'Emma Davis',
        age: 25,
        location: 'Miami',
        matchScore: 78,
        interests: ['city', 'food', 'luxury'],
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        lastActive: '30 minutes ago'
      }
    ];
    
    this.initMatchSection();
  }
  
  initMatchSection() {
    this.renderMatches();
    
    // Set up filter dropdown
    document.getElementById('filterMatches').addEventListener('change', (e) => {
      this.filterMatches(e.target.value);
    });
    
    // Set up search functionality
    document.getElementById('matchSearch').addEventListener('input', (e) => {
      this.searchMatches(e.target.value);
    });
  }
  
  renderMatches() {
    const container = document.getElementById('matchesContainer');
    container.innerHTML = '';
    
    this.matches.forEach(match => {
      const matchCard = document.createElement('div');
      matchCard.className = 'col';
      matchCard.innerHTML = `
        <div class="card match-card h-100">
          <div class="card-body text-center">
            <img src="${match.avatar}" alt="${match.name}" class="rounded-circle mb-3" width="100" height="100">
            <h5>${match.name}</h5>
            <p class="text-muted">${match.age} years • ${match.location}</p>
            <div class="match-score mb-3">${match.matchScore}% Match</div>
            <div class="d-flex flex-wrap justify-content-center mb-3">
              ${match.interests.map(interest => 
                `<span class="badge bg-light text-dark me-1 mb-1">${interest}</span>`
              ).join('')}
            </div>
            <p class="small text-muted"><i class="fas fa-clock"></i> Active ${match.lastActive}</p>
          </div>
          <div class="card-footer bg-transparent d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-primary" data-match-id="${match.id}" data-action="view">
              <i class="fas fa-eye"></i> View
            </button>
            <button class="btn btn-sm btn-custom" data-match-id="${match.id}" data-action="message">
              <i class="fas fa-comment"></i> Message
            </button>
          </div>
        </div>
      `;
      container.appendChild(matchCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('[data-match-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const matchId = e.target.closest('button').dataset.matchId;
        const action = e.target.closest('button').dataset.action;
        
        if (action === 'view') {
          this.viewMatchProfile(matchId);
        } else if (action === 'message') {
          this.startChat(matchId);
        }
      });
    });
  }
  
  filterMatches(filterType) {
    let filteredMatches = [...this.matches];
    
    switch(filterType) {
      case 'top':
        filteredMatches.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'recent':
        filteredMatches.sort((a, b) => {
          const aTime = this.parseLastActive(a.lastActive);
          const bTime = this.parseLastActive(b.lastActive);
          return aTime - bTime;
        });
        break;
      case 'nearby':
        // In a real app, this would use geolocation
        filteredMatches = filteredMatches.sort(() => Math.random() - 0.5);
        break;
    }
    
    this.matches = filteredMatches;
    this.renderMatches();
  }
  
  searchMatches(query) {
    if (!query) {
      this.renderMatches();
      return;
    }
    
    const filtered = this.matches.filter(match => 
      match.name.toLowerCase().includes(query.toLowerCase()) ||
      match.interests.some(interest => interest.toLowerCase().includes(query.toLowerCase()))
    );
    
    this.matches = filtered;
    this.renderMatches();
  }
  
  viewMatchProfile(matchId) {
    const match = this.matches.find(m => m.id === matchId);
    if (match) {
      // In a real app, this would show a detailed modal
      alert(`Viewing profile of ${match.name}`);
    }
  }
  
  startChat(matchId) {
    const match = this.matches.find(m => m.id === matchId);
    if (match) {
      // This would be handled by the ChatSystem
      console.log(`Starting chat with ${match.name}`);
      // Switch to chat tab and load conversation
      document.dispatchEvent(new CustomEvent('switchTab', { detail: 'chat' }));
      document.dispatchEvent(new CustomEvent('loadChat', { detail: matchId }));
    }
  }
  
  parseLastActive(timeString) {
    // Simple parser for demo purposes
    if (timeString.includes('minute')) return 1;
    if (timeString.includes('hour')) return parseInt(timeString) * 60;
    if (timeString.includes('day')) return parseInt(timeString) * 1440;
    return 0;
  }
}

// chat.js - Messaging System
class ChatSystem {
  constructor() {
    this.conversations = [
      {
        id: 'conv1',
        userId: 'user2',
        name: 'Sarah Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        unread: 2,
        messages: [
          {
            id: 'msg1',
            sender: 'user2',
            text: 'Hey there! How are you?',
            time: '10:30 AM',
            read: true
          },
          {
            id: 'msg2',
            sender: 'current',
            text: "I'm good! Planning a trip to Bali next month",
            time: '10:32 AM',
            read: true
          },
          {
            id: 'msg3',
            sender: 'user2',
            text: "That sounds amazing! I've been there last year",
            time: '10:35 AM',
            read: false
          }
        ]
      },
      {
        id: 'conv2',
        userId: 'user3',
        name: 'Mike Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        unread: 0,
        messages: [
          {
            id: 'msg4',
            sender: 'current',
            text: 'Are you still up for hiking this weekend?',
            time: 'Yesterday, 3:45 PM',
            read: true
          },
          {
            id: 'msg5',
            sender: 'user3',
            text: 'Yes! The weather looks perfect',
            time: 'Yesterday, 4:20 PM',
            read: true
          }
        ]
      }
    ];
    
    this.currentConversation = null;
    this.initChatSection();
  }
  
  initChatSection() {
    this.renderConversationList();
    
    // Set up message sending
    document.getElementById('sendMessageBtn').addEventListener('click', () => this.sendMessage());
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    // Set up new chat button
    document.getElementById('newChatBtn').addEventListener('click', () => this.startNewChat());
    
    // Listen for chat load events from other components
    document.addEventListener('loadChat', (e) => {
      this.loadConversation(e.detail);
    });
  }
  
  renderConversationList() {
    const container = document.getElementById('chatList');
    container.innerHTML = '';
    
    this.conversations.forEach(conv => {
      const lastMessage = conv.messages[conv.messages.length - 1];
      const unreadCount = conv.messages.filter(m => !m.read && m.sender !== 'current').length;
      
      const convElement = document.createElement('div');
      convElement.className = `conversation-item ${unreadCount > 0 ? 'unread' : ''}`;
      convElement.dataset.conversationId = conv.id;
      convElement.innerHTML = `
        <div class="d-flex align-items-center p-3">
          <img src="${conv.avatar}" alt="${conv.name}" class="rounded-circle me-3" width="50" height="50">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">${conv.name}</h6>
              <small class="text-muted">${lastMessage.time}</small>
            </div>
            <p class="mb-0 text-truncate" style="max-width: 200px;">${lastMessage.text}</p>
          </div>
          ${unreadCount > 0 ? `<span class="badge bg-primary ms-2">${unreadCount}</span>` : ''}
        </div>
      `;
      
      convElement.addEventListener('click', () => this.loadConversation(conv.userId));
      container.appendChild(convElement);
    });
  }
  
  loadConversation(userId) {
    const conversation = this.conversations.find(c => c.userId === userId);
    if (!conversation) return;
    
    this.currentConversation = conversation;
    
    // Update header
    document.getElementById('chatHeader').innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${conversation.avatar}" alt="${conversation.name}" class="rounded-circle me-2" width="40" height="40">
        <h6 class="mb-0">${conversation.name}</h6>
      </div>
    `;
    
    // Render messages
    this.renderMessages(conversation.messages);
    
    // Enable message input
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendMessageBtn').disabled = false;
    document.getElementById('messageInput').focus();
    
    // Mark messages as read
    this.markMessagesAsRead(conversation.id);
  }
  
  renderMessages(messages) {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sender === 'current' ? 'sent' : 'received'}`;
      messageDiv.innerHTML = `
        <div class="message-text">${msg.text}</div>
        <div class="message-time">${msg.time} ${!msg.read && msg.sender !== 'current' ? '<i class="fas fa-check ms-1"></i>' : ''}</div>
      `;
      container.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }
  
  sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !this.currentConversation) return;
    
    // Create new message
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: 'current',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    // Add to conversation
    const conversation = this.conversations.find(c => c.id === this.currentConversation.id);
    if (conversation) {
      conversation.messages.push(newMessage);
      
      // Update UI
      this.renderMessages(conversation.messages);
      
      // Clear input
      input.value = '';
      
      // In a real app, send to server
      console.log(`Message sent to ${conversation.name}: ${text}`);
      
      // Simulate reply after 1-3 seconds
      if (Math.random() > 0.3) {
        setTimeout(() => {
          const replies = [
            "That sounds great!",
            "I'll check my schedule",
            "When are you thinking of going?",
            "I've been there before, it's amazing!",
            "Let me get back to you on that"
          ];
          const replyMessage = {
            id: `msg${Date.now()}`,
            sender: conversation.userId,
            text: replies[Math.floor(Math.random() * replies.length)],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          };
          conversation.messages.push(replyMessage);
          this.renderMessages(conversation.messages);
        }, 1000 + Math.random() * 2000);
      }
    }
  }
  
  markMessagesAsRead(conversationId) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.forEach(msg => {
        if (msg.sender !== 'current') msg.read = true;
      });
      conversation.unread = 0;
      this.renderConversationList();
    }
  }
  
  startNewChat() {
    // In a real app, this would open a user selection modal
    alert('New chat functionality would open a user selection dialog');
  }
}


// itinerary.js - Trip Itinerary Planner
class ItineraryPlanner {
  constructor() {
    this.itineraries = [
      {
        id: 'it1',
        title: 'Bali Adventure',
        destination: 'Bali, Indonesia',
        startDate: '2023-11-15',
        endDate: '2023-11-22',
        description: 'A week of beaches, temples and waterfalls',
        items: [
          {
            id: 'item1',
            day: 1,
            time: '09:00',
            title: 'Arrival at Ngurah Rai Airport',
            description: 'Flight arrives at 8:45 AM, transfer to hotel'
          },
          {
            id: 'item2',
            day: 1,
            time: '14:00',
            title: 'Explore Seminyak',
            description: 'Visit beach clubs and shopping areas'
          },
          {
            id: 'item3',
            day: 2,
            time: '08:00',
            title: 'Ubud Day Trip',
            description: 'Visit Tegalalang Rice Terrace and Sacred Monkey Forest'
          }
        ]
      },
      {
        id: 'it2',
        title: 'European Tour',
        destination: 'Paris, Rome, Barcelona',
        startDate: '2024-05-10',
        endDate: '2024-05-24',
        description: 'Two weeks exploring major European cities',
        items: []
      }
    ];
    
    this.initItinerarySection();
  }
  
  initItinerarySection() {
    this.renderItineraryList();
    
    // Set up new itinerary modal
    document.getElementById('saveItineraryBtn').addEventListener('click', () => this.saveItinerary());
    
    // Set up itinerary item addition
    document.getElementById('addItineraryItemBtn').addEventListener('click', () => this.addItineraryItem());
    
    // Set up tab switching
    document.querySelectorAll('.itinerary-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }
  
  renderItineraryList() {
    const container = document.getElementById('itineraryItems');
    container.innerHTML = '';
    
    if (this.itineraries.length === 0) {
      container.innerHTML = `
        <div class="empty-state text-center py-5">
          <i class="fas fa-map-marked-alt fa-4x text-muted mb-3"></i>
          <h4>No itineraries yet</h4>
          <p class="text-muted">Start by creating your first travel itinerary</p>
          <button class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#newItineraryModal">
            <i class="fas fa-plus"></i> Create Itinerary
          </button>
        </div>
      `;
      return;
    }
    
    this.itineraries.forEach(itinerary => {
      const itineraryCard = document.createElement('div');
      itineraryCard.className = 'itinerary-card mb-4';
      itineraryCard.innerHTML = `
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">${itinerary.title}</h5>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <ul class="dropdown-menu">
                <li><button class="dropdown-item" data-action="view" data-itinerary-id="${itinerary.id}">View</button></li>
                <li><button class="dropdown-item" data-action="edit" data-itinerary-id="${itinerary.id}">Edit</button></li>
                <li><button class="dropdown-item" data-action="delete" data-itinerary-id="${itinerary.id}">Delete</button></li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <p class="text-muted"><i class="fas fa-map-marker-alt"></i> ${itinerary.destination}</p>
            <p class="text-muted"><i class="fas fa-calendar-alt"></i> ${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}</p>
            <p>${itinerary.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-light text-dark">
                <i class="fas fa-list-ul"></i> ${itinerary.items.length} activities
              </span>
              <button class="btn btn-sm btn-outline-primary" data-action="view" data-itinerary-id="${itinerary.id}">
                View Details
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners to buttons
      itineraryCard.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.target.closest('[data-action]').dataset.action;
          const itineraryId = e.target.closest('[data-itinerary-id]').dataset.itineraryId;
          
          if (action === 'view') {
            this.viewItinerary(itineraryId);
          } else if (action === 'edit') {
            this.editItinerary(itineraryId);
          } else if (action === 'delete') {
            this.deleteItinerary(itineraryId);
          }
        });
      });
      
      container.appendChild(itineraryCard);
    });
  }
  
  viewItinerary(itineraryId) {
    const itinerary = this.itineraries.find(it => it.id === itineraryId);
    if (!itinerary) return;
    
    // Populate view modal
    document.getElementById('viewItineraryTitle').textContent = itinerary.title;
    document.getElementById('viewItineraryDestination').textContent = itinerary.destination;
    document.getElementById('viewItineraryDates').textContent = 
      `${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}`;
    document.getElementById('viewItineraryDescription').textContent = itinerary.description;
    
    // Populate activities
    const activitiesList = document.getElementById('viewItineraryActivities');
    activitiesList.innerHTML = '';
    
    if (itinerary.items.length === 0) {
      activitiesList.innerHTML = '<li class="list-group-item text-muted">No activities planned yet</li>';
    } else {
      // Group by day
      const days = {};
      itinerary.items.forEach(item => {
        if (!days[item.day]) days[item.day] = [];
        days[item.day].push(item);
      });
      
      // Sort days and add to list
      Object.keys(days).sort().forEach(day => {
        const dayHeader = document.createElement('li');
        dayHeader.className = 'list-group-item bg-light';
        dayHeader.textContent = `Day ${day}`;
        activitiesList.appendChild(dayHeader);
        
        days[day].sort((a, b) => a.time.localeCompare(b.time)).forEach(item => {
          const activityItem = document.createElement('li');
          activityItem.className = 'list-group-item';
          activityItem.innerHTML = `
            <div class="d-flex justify-content-between">
              <span class="fw-bold">${item.time}</span>
              <span>${item.title}</span>
            </div>
            <div class="text-muted small">${item.description}</div>
          `;
          activitiesList.appendChild(activityItem);
        });
      });
    }
    
    // Show modal
    const viewModal = new bootstrap.Modal(document.getElementById('viewItineraryModal'));
    viewModal.show();
  }
  
  editItinerary(itineraryId) {
    const itinerary = this.itineraries.find(it => it.id === itineraryId);
    if (!itinerary) return;
    
    // Populate edit form
    document.getElementById('editItineraryId').value = itinerary.id;
    document.getElementById('editTitle').value = itinerary.title;
    document.getElementById('editDestination').value = itinerary.destination;
    document.getElementById('editStartDate').value = itinerary.startDate;
    document.getElementById('editEndDate').value = itinerary.endDate;
    document.getElementById('editDescription').value = itinerary.description;
    
    // Populate items
    const itemsContainer = document.getElementById('editItineraryItems');
    itemsContainer.innerHTML = '';
    
    itinerary.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'itinerary-item mb-3 p-3 border rounded';
      itemElement.innerHTML = `
        <div class="d-flex justify-content-between mb-2">
          <div class="input-group me-2">
            <span class="input-group-text">Day</span>
            <input type="number" class="form-control" value="${item.day}" min="1">
          </div>
          <input type="time" class="form-control me-2" value="${item.time}">
          <button class="btn btn-sm btn-outline-danger delete-item">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <input type="text" class="form-control mb-2" placeholder="Title" value="${item.title}">
        <textarea class="form-control" placeholder="Description">${item.description}</textarea>
      `;
      
      // Add delete handler
      itemElement.querySelector('.delete-item').addEventListener('click', () => {
        itemElement.remove();
      });
      
      itemsContainer.appendChild(itemElement);
    });
    
    // Show modal
    const editModal = new bootstrap.Modal(document.getElementById('editItineraryModal'));
    editModal.show();
  }
  
  saveItinerary() {
    const title = document.getElementById('newTitle').value.trim();
    const destination = document.getElementById('newDestination').value.trim();
    const startDate = document.getElementById('newStartDate').value;
    const endDate = document.getElementById('newEndDate').value;
    const description = document.getElementById('newDescription').value.trim();
    
    if (!title || !destination || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newItinerary = {
      id: `it${Date.now()}`,
      title,
      destination,
      startDate,
      endDate,
      description,
      items: []
    };
    
    this.itineraries.push(newItinerary);
    this.renderItineraryList();
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('newItineraryModal'));
    modal.hide();
    document.getElementById('newItineraryForm').reset();
    
    // Show success message
    this.showNotification('Itinerary created successfully!', 'success');
  }
  
  addItineraryItem() {
    const itemsContainer = document.getElementById('editItineraryItems');
    const itemCount = itemsContainer.children.length;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'itinerary-item mb-3 p-3 border rounded';
    itemElement.innerHTML = `
      <div class="d-flex justify-content-between mb-2">
        <div class="input-group me-2">
          <span class="input-group-text">Day</span>
          <input type="number" class="form-control" value="1" min="1">
        </div>
        <input type="time" class="form-control me-2" value="09:00">
        <button class="btn btn-sm btn-outline-danger delete-item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <input type="text" class="form-control mb-2" placeholder="Title">
      <textarea class="form-control" placeholder="Description"></textarea>
    `;
    
    // Add delete handler
    itemElement.querySelector('.delete-item').addEventListener('click', () => {
      itemElement.remove();
    });
    
    itemsContainer.appendChild(itemElement);
  }
  
  deleteItinerary(itineraryId) {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      this.itineraries = this.itineraries.filter(it => it.id !== itineraryId);
      this.renderItineraryList();
      this.showNotification('Itinerary deleted', 'success');
    }
  }
  
  switchTab(tabName) {
    document.querySelectorAll('.itinerary-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.itinerary-tab-content').forEach(content => {
      content.classList.toggle('d-none', content.id !== `${tabName}Tab`);
    });
  }
  
  showNotification(message, type) {
    console.log(`[${type}] ${message}`);
  }
}



