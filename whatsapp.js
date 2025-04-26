/**
 * Inspiresso Coffee and Roastery
 * WhatsApp Integration JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initWhatsAppButtons();
    trackWhatsAppClicks();
});

/**
 * Initialize WhatsApp buttons with proper functionality
 */
function initWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    whatsappButtons.forEach(button => {
        // Make sure buttons have proper attributes
        if (!button.hasAttribute('href') || !button.getAttribute('href').includes('wa.me')) {
            console.warn('WhatsApp button found without proper href attribute', button);
        }
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            // Don't prevent default - we want the link to open
            
            // Track the click in analytics (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': button.closest('.product-card') ? 
                        button.closest('.product-card').querySelector('h3').textContent : 
                        'general_inquiry'
                });
            }
            
            // Add a small delay for tracking to complete (optional)
            // e.preventDefault();
            // setTimeout(() => {
            //     window.location.href = button.getAttribute('href');
            // }, 100);
        });
    });
}

/**
 * Track WhatsApp clicks for analytics
 */
function trackWhatsAppClicks() {
    // Get product info for better tracking
    document.querySelectorAll('.whatsapp-btn').forEach(button => {
        // If the button is inside a product card
        if (button.closest('.product-card')) {
            const productCard = button.closest('.product-card');
            let productName = productCard.querySelector('h3')?.textContent || 'Unknown Product';
            let productCategory = '';
            
            // Try to determine product category from the section
            if (productCard.closest('#green-beans')) {
                productCategory = 'Green Beans';
            } else if (productCard.closest('#roasted-beans')) {
                productCategory = 'Roasted Beans';
            } else if (productCard.closest('#specialty-beans')) {
                productCategory = 'Specialty Beans';
            }
            
            // Update the href to include more detailed product info
            if (button.getAttribute('href')) {
                let currentUrl = button.getAttribute('href');
                let newUrl = currentUrl;
                
                // Only modify if not already containing detailed info
                if (!currentUrl.includes('Category')) {
                    // Add category info if available
                    if (productCategory) {
                        newUrl += ` (Category: ${productCategory})`;
                    }
                }
                
                button.setAttribute('href', newUrl);
            }
        }
    });
}

/**
 * Format WhatsApp message with product details
 * @param {string} productName - The name of the product
 * @param {string} productCategory - The category of the product
 * @returns {string} - Formatted WhatsApp message
 */
function formatWhatsAppMessage(productName, productCategory = '') {
    let message = `I'm interested in ${productName}`;
    
    if (productCategory) {
        message += ` from the ${productCategory} category`;
    }
    
    message += `. Can you provide more information?`;
    
    return encodeURIComponent(message);
}

/**
 * Create a WhatsApp link with predefined message
 * @param {string} phoneNumber - The WhatsApp phone number without country code
 * @param {string} message - The message to send
 * @returns {string} - WhatsApp URL
 */
function createWhatsAppLink(phoneNumber, message) {
    // Assume Indonesia (+62) as default country code if not specified
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+62${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
    }
    
    // Remove any non-digit characters from phone number
    phoneNumber = phoneNumber.replace(/\D/g, '');
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Handle dynamic WhatsApp button creation for new products
 * @param {HTMLElement} productElement - The product element
 * @param {string} productName - The name of the product
 * @param {string} phoneNumber - The WhatsApp phone number
 */
function addWhatsAppButton(productElement, productName, phoneNumber = '1234567890') {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'whatsapp-btn-container';
    
    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'whatsapp-btn';
    whatsappBtn.href = createWhatsAppLink(phoneNumber, `I'm interested in ${productName}`);
    whatsappBtn.innerHTML = `<i class="fab fa-whatsapp"></i> Order via WhatsApp`;
    
    buttonContainer.appendChild(whatsappBtn);
    productElement.appendChild(buttonContainer);
    
    // Initialize the newly created button
    initWhatsAppButtons();
}
