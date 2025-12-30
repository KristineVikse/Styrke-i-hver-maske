/* ==========================================================================
   STYRKE I HVER MASKE - JavaScript
   ========================================================================== */

// =========================================================================
// PAGE LOADER
// =========================================================================

window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 800); // Show loader for at least 800ms
    }
});

// =========================================================================
// PAGE TRANSITIONS
// =========================================================================

function initPageTransitions() {
    // Page transitions are kept, but loader will not show on navigation
    const transition = document.querySelector('.page-transition');
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"])');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's the current page
            if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
                e.preventDefault();

                if (transition) {
                    transition.classList.add('active');
                }

                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });
}

// =========================================================================
// COOKIE CONSENT
// =========================================================================

function initCookieConsent() {
    const cookieBanner = document.querySelector('.cookie-consent');
    const acceptBtn = document.querySelector('.cookie-btn-accept');
    const declineBtn = document.querySelector('.cookie-btn-decline');
    const cookieKey = 'styrkeihvermaske_cookie_consent';

    // Check if user has already made a choice
    const consent = localStorage.getItem(cookieKey);

    if (!consent && cookieBanner) {
        // Show banner after 1 second
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem(cookieKey, 'accepted');
            cookieBanner.classList.remove('show');
            setTimeout(() => {
                cookieBanner.remove();
            }, 500);

            // Initialize analytics or other cookie-dependent features here
            console.log('Cookies accepted');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem(cookieKey, 'declined');
            cookieBanner.classList.remove('show');
            setTimeout(() => {
                cookieBanner.remove();
            }, 500);

            console.log('Cookies declined');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {

    // Initialize page transitions
    initPageTransitions();

    // Initialize cookie consent
    initCookieConsent();
    
    // =========================================================================
    // NAVIGASJON - Hamburger-meny
    // =========================================================================
    
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Toggle mobilmeny
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('open');
            body.classList.toggle('nav-open');
        });
    }
    
    // Lukk meny når man klikker på en lenke
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                mainNav.classList.remove('open');
                body.classList.remove('nav-open');
            }
        });
    });
    
    // =========================================================================
    // HEADER - Skygge ved scroll
    // =========================================================================
    
    const header = document.querySelector('.site-header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Kjør ved lasting
    
    // =========================================================================
    // SCROLL-ANIMASJONER
    // =========================================================================
    
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // =========================================================================
    // EVENT TABS (for event-siden)
    // =========================================================================
    
    const eventTabs = document.querySelectorAll('.event-tab');
    const eventSections = document.querySelectorAll('.event-section');
    
    eventTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.target;
            
            // Oppdater aktive tabs
            eventTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Vis/skjul seksjoner
            eventSections.forEach(section => {
                if (section.id === target) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
    
    // =========================================================================
    // AKTIV NAVIGASJONSLENKE
    // =========================================================================
    
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === filename || (filename === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // =========================================================================
    // SMOOTH SCROLL FOR INTERNE LENKER
    // =========================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // =========================================================================
    // LAZY LOADING FOR BILDER (fremtidig bruk)
    // =========================================================================
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // =========================================================================
    // PARALLAX EFFECT FOR IMAGES
    // =========================================================================

    const parallaxImages = document.querySelectorAll('.parallax-img');

    window.addEventListener('scroll', function() {
        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                img.style.transform = `translateY(${rate}px)`;
            }
        });
    });

    // =========================================================================
    // MAGNETIC HOVER EFFECT FOR CARDS
    // =========================================================================

    const magneticCards = document.querySelectorAll('.card-magnetic');

    magneticCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;

            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translate(0, 0)';
        });
    });

    // =========================================================================
    // TEXT REVEAL ANIMATION
    // =========================================================================

    const textRevealElements = document.querySelectorAll('.text-reveal');

    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    textRevealElements.forEach(el => {
        textObserver.observe(el);
    });

    // =========================================================================
    // CUSTOM CURSOR EFFECT (optional, subtle)
    // =========================================================================

    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    // =========================================================================
    // BACK TO TOP BUTTON
    // =========================================================================

    // Create back to top button dynamically
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Tilbake til toppen');
    body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =========================================================================
    // KONSOLL-MELDING
    // =========================================================================

    console.log('%c🧶 Styrke i hver maske', 'font-size: 20px; font-weight: bold; color: #dda935;');
    console.log('%cKreativ kraft, ro og fellesskap', 'font-size: 14px; color: #d0ba95;');
    console.log('%c💡 Tips: Prøv å klikke deg rundt og utforsk sidene!', 'font-size: 12px; color: #5a5a5a;');

});
