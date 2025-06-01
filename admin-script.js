// Admin Page JavaScript - Carol Kui Premium Services

// Logout function
function logout() {
  console.log('Logout clicked');
  // Implement logout logic here, e.g., clear session, redirect to login page
  alert('Logged out (placeholder)');
}

// Smooth scroll to section on sidebar menu click
document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSectionId = item.getAttribute('data-section');
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Preview main website
function previewSite() {
  console.log('Preview site clicked');
  window.open('index.html', '_blank');
}

// Save Hero Section content
function saveHeroContent() {
  console.log('Save Hero Content clicked');
  const title = document.getElementById('heroTitle').value;
  const subtitle = document.getElementById('heroSubtitle').value;
  // For simplicity, only saving title and subtitle as content
  const content = { title, subtitle };

  fetch('api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'hero', content })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Hero content saved successfully');
    } else {
      alert('Failed to save hero content');
    }
  })
  .catch(error => {
    console.error('Error saving hero content:', error);
    alert('Error saving hero content');
  });
}

// Add new service
function addNewService() {
  console.log('Add New Service clicked');
  // Show modal or form to add new service
  alert('Add new service (placeholder)');
}

// Edit service by id
function editService(serviceId) {
  console.log('Edit service:', serviceId);
  // Implement edit logic here
  alert('Edit service ' + serviceId + ' (placeholder)');
}

// Delete service by id
function deleteService(serviceId) {
  console.log('Delete service:', serviceId);
  if (confirm('Are you sure you want to delete service ' + serviceId + '?')) {
    // Implement delete logic here
    alert('Service ' + serviceId + ' deleted (placeholder)');
  }
}

// Save service changes by id
function saveService(serviceId) {
  console.log('Save service:', serviceId);
  // Implement save logic here
  alert('Service ' + serviceId + ' saved (placeholder)');
}

// Save Features Section content
function saveFeaturesContent() {
  console.log('Save Features Content clicked');
  // Implement save logic here
  alert('Features content saved (placeholder)');
}

// Save About Section content
function saveAboutContent() {
  console.log('Save About Content clicked');
  // Implement save logic here
  alert('About content saved (placeholder)');
}

// Save Contact Info content
function saveContactInfo() {
  console.log('Save Contact Info clicked');
  // Implement save logic here
  alert('Contact info saved (placeholder)');
}

// Refresh contact messages
function refreshMessages() {
  console.log('Refresh messages clicked');
  // Implement refresh logic here
  alert('Messages refreshed (placeholder)');
}

// Reply to a message by id
function replyToMessage(messageId) {
  console.log('Reply to message:', messageId);
  // Implement reply logic here
  alert('Reply to message ' + messageId + ' (placeholder)');
}

// Delete a message by id
function deleteMessage(messageId) {
  console.log('Delete message:', messageId);
  if (confirm('Are you sure you want to delete message ' + messageId + '?')) {
    // Implement delete logic here
    alert('Message ' + messageId + ' deleted (placeholder)');
  }
}

// Close modal by id
function closeModal(modalId) {
  console.log('Close modal:', modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Create new service from modal form
function createNewService() {
  console.log('Create new service clicked');
  // Implement create logic here
  alert('New service created (placeholder)');
  closeModal('newServiceModal');
}
