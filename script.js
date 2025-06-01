document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    initEmailJS();
    
    // Initialize all functions
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initServiceCards();
    initScrollToTop();
    initTypingEffect();

    // Animate portfolio stats count up when in view
    const portfolioStats = document.querySelectorAll('.portfolio-stats .stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target.parentElement);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    portfolioStats.forEach(stat => {
        observer.observe(stat);
    });
});

// Counter animation
// Removed duplicate function to keep only one definition below

// EmailJS Configuration
function initEmailJS() {
    // Initialize EmailJS with your public key
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY');
    } else {
        console.warn('EmailJS not loaded. Make sure to include the EmailJS script in your HTML.');
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Special animations for different elements
                if (entry.target.classList.contains('service-card')) {
                    const index = Array.from(document.querySelectorAll('.service-card')).indexOf(entry.target);
                    animateServiceCardDynamic(entry.target, index);
                }
                
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .contact-item, .stat');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Service card animations
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Stagger animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }, 150);
        });
    });
}

// New animation for service cards dynamically coming into view
function animateServiceCardDynamic(card, index) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 150);
}

// Counter animation
function animateCounter(statElement) {
    const numberElement = statElement.querySelector('h3');
    const finalNumber = parseInt(numberElement.textContent);
    let currentNumber = 0;
    const increment = finalNumber / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            numberElement.textContent = finalNumber + (numberElement.textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            numberElement.textContent = Math.floor(currentNumber) + (numberElement.textContent.includes('%') ? '%' : '+');
        }
    }, stepTime);
}

// Enhanced Contact form functionality with EmailJS integration
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !service || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Try EmailJS first, fallback to mailto if EmailJS fails
        sendEmailViaEmailJS(name, email, service, message, submitButton, originalText, contactForm);
    });
}

// Send email via EmailJS
function sendEmailViaEmailJS(name, email, service, message, submitButton, originalText, contactForm) {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not available, falling back to mailto');
        fallbackToMailto(name, email, service, message, submitButton, originalText, contactForm);
        return;
    }
    
    // EmailJS template parameters
    const templateParams = {
        from_name: name,
        from_email: email,
        service_type: service,
        message: message,
        to_email: 'wanguicarol29@gmail.com', // Your email
        reply_to: email
    };
    
    // Send email via EmailJS
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            
            // Show success notification
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form and button
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
        }, function(error) {
            console.error('EmailJS failed:', error);
            
            // Show error and fallback to mailto
            showNotification('Direct email failed. Opening your email client as backup...', 'warning');
            
            setTimeout(() => {
                fallbackToMailto(name, email, service, message, submitButton, originalText, contactForm);
            }, 1500);
        });
}

// Fallback to mailto method
function fallbackToMailto(name, email, service, message, submitButton, originalText, contactForm) {
    // Original mailto functionality
    const subject = encodeURIComponent(`Service Inquiry: ${service}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`);
    
    window.open(`mailto:wanguicarol29@gmail.com?subject=${subject}&body=${body}`, '_self');
    
    // Show notification for mailto
    showNotification('Email client opened! Please send the message from your email app.', 'info');
    
    // Reset form and button
    contactForm.reset();
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced Notification system with new warning and info types
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Define notification colors and icons
    const notificationStyles = {
        success: { 
            background: '#10b981', 
            icon: 'check-circle' 
        },
        error: { 
            background: '#ef4444', 
            icon: 'exclamation-circle' 
        },
        warning: { 
            background: '#f59e0b', 
            icon: 'exclamation-triangle' 
        },
        info: { 
            background: '#3b82f6', 
            icon: 'info-circle' 
        }
    };
    
    const style = notificationStyles[type] || notificationStyles.info;
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${style.icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${style.background};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds (longer for info messages)
    const autoRemoveDelay = type === 'info' || type === 'warning' ? 7000 : 5000;
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, autoRemoveDelay);
}

// Typing effect for hero title
function initTypingEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    const texts = ['Premium', 'Research Software', 'Solutions'];
    
    titleLines.forEach((line, index) => {
        const text = texts[index];
        const originalText = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            typeText(line, originalText, 100);
        }, index * 800 + 1000);
    });
}

function typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            // Add cursor blink effect
            element.style.borderRight = '2px solid #fbbf24';
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }, speed);
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Enhanced Contact functions with EmailJS support
function makeCall() {
    window.open('tel:+254714878363', '_self');
}

function sendEmail() {
    // Try to send a quick email via EmailJS, fallback to mailto
    const quickEmailData = {
        from_name: 'Website Visitor',
        from_email: 'visitor@website.com',
        service_type: 'General Inquiry',
        message: 'Hello Carol,\n\nI am interested in your premium research software services. Please provide more information about:\n\n- Available services\n- Pricing\n- How to get started\n\nThank you!\n\nBest regards,',
        to_email: 'wanguicarol29@gmail.com',
        reply_to: 'visitor@website.com'
    };
    
    if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', quickEmailData)
            .then(function(response) {
                showNotification('Quick inquiry sent successfully!', 'success');
            }, function(error) {
                // Fallback to mailto
                fallbackToMailtoQuick();
            });
    } else {
        fallbackToMailtoQuick();
    }
}

function fallbackToMailtoQuick() {
    const subject = encodeURIComponent('Inquiry about Research Software Services');
    const body = encodeURIComponent('Hello Carol,\n\nI am interested in your premium research software services. Please provide more information about:\n\n- Available services\n- Pricing\n- How to get started\n\nThank you!\n\nBest regards,');
    window.open(`mailto:wanguicarol29@gmail.com?subject=${subject}&body=${body}`, '_self');
    showNotification('Email client opened!', 'info');
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopButton.className = 'scroll-to-top';
    scrollTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3b82f6, #1e40af);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.visibility = 'visible';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
        this.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)';
    });
    
    scrollTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Initialize floating animation after page load
window.addEventListener('load', function() {
    setTimeout(addFloatingAnimation, 1000);
});

// Portfolio "View Details" button functionality
document.addEventListener('DOMContentLoaded', function() {
    const portfolioModal = document.getElementById('portfolioModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTag = document.getElementById('modalTag');
    const modalClose = document.getElementById('modalClose');

    // Function to open portfolio modal with data from portfolio item
    function openPortfolioModal(portfolioItem) {
        const image = portfolioItem.querySelector('.portfolio-image img');
        const title = portfolioItem.querySelector('.portfolio-details h4');
        const description = portfolioItem.querySelector('.portfolio-details p');
        const tag = portfolioItem.querySelector('.portfolio-tag');

        if (image && title && description && tag) {
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modalTitle.textContent = title.textContent;
            modalDescription.textContent = description.textContent;
            modalTag.textContent = tag.textContent;

            portfolioModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal function
    function closePortfolioModal() {
        portfolioModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Add click event to close button
    modalClose.addEventListener('click', closePortfolioModal);

    // Add click event to modal overlay to close when clicking outside content
    portfolioModal.addEventListener('click', function(event) {
        if (event.target === portfolioModal) {
            closePortfolioModal();
        }
    });

    // Attach click event listeners to all "View Details" buttons
    const viewDetailButtons = document.querySelectorAll('.portfolio-info .btn-small');
    viewDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const portfolioItem = this.closest('.portfolio-item');
            if (portfolioItem) {
                openPortfolioModal(portfolioItem);
            }
        });
    });
});

// Add CSS keyframes for animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .scroll-to-top:hover {
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
    }
`;

document.head.appendChild(style);

window.addEventListener('load', function() {
    // Create preloader
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
    `;
    document.body.appendChild(preloader);

    // Remove preloader immediately after page load (no delay)
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
        }
    }, 300);
});

// ========== MODAL FUNCTIONALITY ==========

// Service data
const serviceData = {
    turnitin: {
        title: "Turnitin Premium",
        icon: "fas fa-shield-alt",
        description: "Turnitin is the world's leading academic integrity solution that helps educators ensure originality and provide meaningful feedback on student work. Our premium access provides you with comprehensive plagiarism detection, detailed similarity reports, and advanced writing feedback tools.",
        benefits: [
            "Industry-leading plagiarism detection with access to billions of web pages and academic papers",
            "Detailed similarity reports with highlighted matches and percentage scores",
            "Writing feedback tools including grammar and style suggestions",
            "Submission management and grade integration features",
            "24/7 access to premium features with our reliable service guarantee"
        ],
        features: [
            {
                title: "Comprehensive Database",
                description: "Access to over 70 billion web pages, 170 million student papers, and 99 million published works"
            },
            {
                title: "Detailed Reports",
                description: "Color-coded similarity reports with source-by-source breakdown and match statistics"
            },
            {
                title: "Originality Check",
                description: "Advanced algorithms detect paraphrasing, translation plagiarism, and AI-generated content"
            },
            {
                title: "Writing Feedback",
                description: "Grammar, spelling, and style suggestions to improve writing quality"
            }
        ],
        pricing: {
            price: "Ksh 500",
            period: "Shared login,per month",
            features: [
                "Personal telegram bot with limitations of 30 checks per day Ksh 1000",
                "Slotted website Turnitin Ksh 10 per slot",
                "Writing feedback tools",
                "Personal telegram bot unlimited checks Ksh 1500 monthly subscription",
                "99.9% uptime guarantee"
            ]
        },
        demo: {
            title: "See Turnitin in Action",
            description: "Experience the power of advanced plagiarism detection with detailed similarity reports and comprehensive feedback tools.",
            note: "Contact us for a personalized demo and see how Turnitin can enhance your academic integrity."
        }
    },
    grammarly: {
        title: "Premium Grammarly",
        icon: "fas fa-pen-fancy",
        description: "Grammarly Premium is your AI-powered writing assistant that goes beyond basic grammar checking. It provides advanced writing suggestions, style improvements, plagiarism detection, and tone adjustments to help you communicate more effectively and professionally.",
        benefits: [
            "Advanced grammar and punctuation corrections with detailed explanations",
            "Style and clarity suggestions to improve readability and impact",
            "Tone detection and adjustment recommendations for appropriate communication",
            "Plagiarism detection across billions of web pages",
            "Genre-specific writing style suggestions for academic, business, and creative writing"
        ],
        features: [
            {
                title: "Advanced Grammar Check",
                description: "Go beyond basic spelling with complex grammar, punctuation, and sentence structure corrections"
            },
            {
                title: "Style & Clarity",
                description: "Improve readability with suggestions for conciseness, clarity, and engaging writing"
            },
            {
                title: "Tone Detector",
                description: "Ensure your writing conveys the right tone for your audience and purpose"
            },
            {
                title: "Plagiarism Detection",
                description: "Check your work against billions of web pages to ensure originality"
            }
        ],
        pricing: {
            price: "Ksh 300",
            period: "Shared login,per month",
            features: [
                "Advanced grammar and punctuation",
                "Style and clarity suggestions",
                "Tone adjustments",
                "Plagiarism detection",
                "Genre-specific suggestions"
            ]
        },
        demo: {
            title: "Experience Premium Writing",
            description: "See how Grammarly Premium transforms your writing with advanced suggestions and real-time feedback.",
            note: "Get in touch for a demonstration of all premium features and writing enhancements."
        }
    },
    quillbot: {
        title: "Premium QuillBot",
        icon: "fas fa-feather-alt",
        description: "QuillBot Premium is an AI-powered paraphrasing and writing tool that helps you rewrite, edit, and improve your content. With multiple writing modes and advanced features, it's perfect for academic writing, content creation, and research enhancement.",
        benefits: [
            "AI-powered paraphrasing with multiple writing modes for different purposes",
            "Unlimited paraphrasing with faster processing speeds",
            "Advanced synonym suggestions and vocabulary enhancement",
            "Plagiarism checker integrated with paraphrasing tools",
            "Citation generator for academic references and bibliographies"
        ],
        features: [
            {
                title: "Multiple Modes",
                description: "Choose from Standard, Fluency, Formal, Academic, Creative, and Custom modes"
            },
            {
                title: "Unlimited Usage",
                description: "No limits on paraphrasing length or number of uses per day"
            },
            {
                title: "Advanced Synonyms",
                description: "Access to extensive synonym database with context-appropriate suggestions"
            },
            {
                title: "Plagiarism Checker",
                description: "Built-in plagiarism detection to ensure content originality"
            }
        ],
        pricing: {
            price: "Ksh 300",
            period: "Shared login,per month",
            features: [
                "Unlimited paraphrasing",
                "All writing modes",
                "Advanced synonym suggestions",
                "Plagiarism checker",
                "Citation generator"
            ]
        },
        demo: {
            title: "Transform Your Writing",
            description: "Discover how QuillBot Premium can help you rephrase, enhance, and perfect your academic and professional writing.",
            note: "Schedule a demo to explore all paraphrasing modes and advanced writing features."
        }
    },
    stealth: {
        title: "Stealth Writer Premium",
        icon: "fas fa-user-secret",
        description: "Stealth Writer is an advanced AI writing tool designed for creating original, high-quality content that maintains privacy and authenticity. Perfect for academic writing, research papers, and professional content creation with enhanced originality features.",
        benefits: [
            "Advanced AI content generation with human-like writing quality",
            "Privacy-focused writing that protects your data and maintains confidentiality",
            "Originality optimization to create unique, plagiarism-free content",
            "Multiple writing styles and tones for different academic and professional needs",
            "Advanced editing and refinement tools for polished final output"
        ],
        features: [
            {
                title: "Original Content Creation",
                description: "Generate unique, high-quality content tailored to your specific requirements"
            },
            {
                title: "Privacy Protection",
                description: "Secure writing environment that protects your intellectual property"
            },
            {
                title: "AI Detection Bypass",
                description: "Advanced algorithms ensure content appears naturally written"
            },
            {
                title: "Multiple Formats",
                description: "Support for essays, research papers, reports, and creative writing"
            }
        ],
        pricing: {
            price: "Ksh 1200",
            period: "per month",
            features: [
                "Unlimited AI writing",
                "Privacy-focused features",
                "Originality optimization",
                "Multiple writing styles",
                "Personalized bots",
                "Advanced editing tools"
            ]
        },
        demo: {
            title: "Experience Advanced AI Writing",
            description: "See how Stealth Writer creates original, high-quality content while maintaining privacy and authenticity.",
            note: "Contact us for a personalized demonstration of advanced AI writing capabilities."
        }
    },
    chatgpt: {
        title: "ChatGPT 4.0 Premium",
        icon: "fas fa-robot",
        description: "ChatGPT 4.0 Premium provides access to the most advanced AI language model for research assistance, academic support, and intelligent conversation. With enhanced capabilities and priority access, it's your ultimate AI research companion.",
        benefits: [
            "Access to the latest GPT-4 model with enhanced reasoning and comprehension",
            "Priority access during high-demand periods with faster response times",
            "Advanced conversation capabilities for complex academic and research queries",
            "Multimodal input support including text, images, and document analysis",
            "Extended conversation memory for comprehensive research sessions"
        ],
        features: [
            {
                title: "GPT-4 Access",
                description: "Latest AI model with superior reasoning, creativity, and problem-solving abilities"
            },
            {
                title: "Priority Access",
                description: "Skip queues and get faster responses even during peak usage times"
            },
            {
                title: "Advanced Analysis",
                description: "Analyze documents, images, and complex data with AI-powered insights"
            },
            {
                title: "Research Support",
                description: "Comprehensive assistance with literature reviews, data analysis, and academic writing"
            }
        ],
        pricing: {
            price: "Ksh 600",
            period: "Shared login,per month",
            features: [
                "GPT-4 model access",
                "Priority queue access",
                "Multimodal capabilities",
                "Extended conversation limits",
                "Advanced research tools"
            ]
        },
        demo: {
            title: "Explore AI-Powered Research",
            description: "Discover how ChatGPT 4.0 Premium can revolutionize your research process with advanced AI assistance.",
            note: "Get in touch for a demonstration of advanced AI research capabilities and features."
        }
    }
};

let currentService = '';

    

// Open modal function
function openModal(serviceName) {
    currentService = serviceName;
    const service = serviceData[serviceName];
    
    if (!service) {
        console.error('Service not found:', serviceName);
        return;
    }
    
    // Update modal content
    document.getElementById('modalTitle').textContent = service.title;
    document.getElementById('modalIcon').className = service.icon;
    document.getElementById('modalDescription').textContent = service.description;
    
    // Update benefits
    const benefitsList = document.getElementById('modalBenefits');
    benefitsList.innerHTML = '';
    service.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });
    
    // Update features
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = '';
    service.features.forEach(feature => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card';
        featureCard.innerHTML = `
            <h5>${feature.title}</h5>
            <p>${feature.description}</p>
        `;
        featuresContainer.appendChild(featureCard);
    });
    
    // Update pricing
    const pricingContainer = document.getElementById('modalPricing');
    pricingContainer.innerHTML = `
        <div class="pricing-card">
            <div class="price">${service.pricing.price}</div>
            <div class="period">${service.pricing.period}</div>
            <ul class="pricing-features">
                ${service.pricing.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Update demo
    const demoContainer = document.getElementById('modalDemo');
    demoContainer.innerHTML = `
        <div class="demo-placeholder">
            <i class="${service.icon}"></i>
            <h4>${service.demo.title}</h4>
            <p>${service.demo.description}</p>
            <br>
            <p><strong>Note:</strong> ${service.demo.note}</p>
        </div>
    `;
    
    // Show modal
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset to first tab
    switchTab('overview');
}

// Close modal function
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentService = '';
}

// Switch tab function
function switchTab(tabName, event) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tabName + '-content').classList.add('active');
}

// Contact for specific service
function contactForService() {
    if (currentService) {
        // Pre-fill the contact form with the selected service
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = currentService;
        }
        
        // Close modal and scroll to contact section
        closeModal();
        scrollToSection('contact');
        
        // Optional: Focus on the contact form
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
        }, 500);
    }
}

// Get started function
function getStarted() {
    // Contact for the service
    contactForService();
}

// Close modal when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Prevent modal from closing when clicking inside the modal container
document.addEventListener('click', function(event) {
    const modalContainer = document.querySelector('.modal-container');
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalContainer && !modalContainer.contains(event.target)) {
        // Only close if clicking outside the modal container and on modal overlay
        if (modalOverlay && modalOverlay.contains(event.target)) {
            closeModal();
        }
    }
});
