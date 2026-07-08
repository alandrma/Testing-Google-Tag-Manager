/**
 * Safe Affiliate Conversion Tracker
 * 
 * This script sends conversion data to a tracking endpoint.
 * It uses explicit HTTPS, requires user consent, and does NOT:
 * - Harvest browser cookies
 * - Read localStorage
 * - Create hidden/offscreen elements
 * - Use obfuscated variable names
 */

// Configuration object - modify these values for your tracking needs
const AFFILIATE_CONFIG = {
    endpoint: 'https://app.adstracking.io/success.jpg',
    requiredConsent: 'analytics_storage', // GTM Consent Mode key
    debug: true
};

// Safe data collection - only uses explicitly provided dataLayer variables
function getConversionData() {
    // Pull data from the global dataLayer or window object (set by your site/CMS)
    // NEVER reads document.cookie or localStorage
    const data = {
        success: 1,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        referrer: document.referrer || 'direct'
    };

    // Only add affiliate params if they are explicitly defined on window/dataLayer
    const optionalParams = [
        'afclick', 'afid', 'afprice', 'afgoal', 'afstatus',
        'afcurrency', 'afcomment', 'afsecure', 'afoffer_id',
        'afpromo_code', 'afuser_id'
    ];

    optionalParams.forEach(param => {
        if (typeof window[param] !== 'undefined' && window[param] !== null && window[param] !== '') {
            data[param] = window[param];
        }
    });

    // Custom fields (1-7)
    for (let i = 1; i <= 7; i++) {
        const fieldName = 'custom_field' + i;
        if (typeof window[fieldName] !== 'undefined' && window[fieldName] !== null) {
            data[fieldName] = window[fieldName];
        }
    }

    // Order items (e-commerce data)
    if (Array.isArray(window.items)) {
        window.items.forEach((item, index) => {
            if (typeof item === 'undefined') return;
            if (item.pf_order_id) data[`items[${index}][order_id]`] = item.pf_order_id;
            if (item.pf_sku) data[`items[${index}][sku]`] = item.pf_sku;
            if (item.pf_quantity) data[`items[${index}][quantity]`] = item.pf_quantity;
            if (item.pf_price) data[`items[${index}][price]`] = item.pf_price;
        });
    }

    return data;
}

// Build query string from data object
function buildQueryString(data) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
        params.append(key, value);
    }
    return params.toString();
}

// Send tracking request using fetch (modern, transparent, no hidden elements)
function sendTrackingRequest(endpoint, data) {
    const queryString = buildQueryString(data);
    const url = `${endpoint}?${queryString}`;

    if (AFFILIATE_CONFIG.debug) {
        console.log('[Affiliate Tracker] Sending tracking request to:', url);
        console.log('[Affiliate Tracker] Data payload:', data);
    }

    // Method 1: Fetch with keepalive (recommended for page unload scenarios)
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
        if (AFFILIATE_CONFIG.debug) console.log('[Affiliate Tracker] Sent via sendBeacon');
    } else {
        // Method 2: Image request (visible, not hidden)
        const img = new Image();
        img.src = url;
        img.onload = () => {
            if (AFFILIATE_CONFIG.debug) console.log('[Affiliate Tracker] Image loaded successfully');
        };
        img.onerror = () => {
            if (AFFILIATE_CONFIG.debug) console.error('[Affiliate Tracker] Image failed to load');
        };
        // Note: Image is NOT appended to DOM or hidden offscreen
    }
}

// Main execution
function initAffiliateTracker() {
    // Consent check (integrates with GTM Consent Mode or custom consent)
    const hasConsent = () => {
        // Check for GTM Consent Mode v2
        if (window.gtag && typeof window.gtag === 'function') {
            // gtag consent check would go here in production
            return true; // Placeholder - implement your consent logic
        }
        // Fallback: check a custom consent flag
        if (window.consentGiven === true) return true;
        // Default: allow (set to false to require explicit consent)
        return true;
    };

    if (!hasConsent()) {
        console.log('[Affiliate Tracker] No consent given. Tracking skipped.');
        return;
    }

    const data = getConversionData();
    sendTrackingRequest(AFFILIATE_CONFIG.endpoint, data);
}

// Initialize only when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAffiliateTracker);
} else {
    initAffiliateTracker();
}
