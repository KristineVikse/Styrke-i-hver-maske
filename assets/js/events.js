// Events loader for Styrke i hver maske
// Loads events dynamically from localStorage

const EVENTS_STORAGE_KEY = 'events';

// Load events when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});

function loadEvents() {
    let events = [];
    try {
        events = getEvents();
    } catch (e) {
        events = [];
    }

    // If no valid events, keep HTML from event.html
    if (!Array.isArray(events) || events.length === 0) {
        return;
    }

    // Filter out events without required fields
    const validEvents = events.filter(event =>
        event.title && event.title.trim() !== '' &&
        event.description && event.description.trim() !== ''
    );

    if (validEvents.length === 0) {
        return;
    }

    events = validEvents;

    // Separate into upcoming and past events
    const now = new Date();
    const upcomingEvents = events.filter(event => {
        if (event.status === 'upcoming' || event.status === 'planned') return true;
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate >= now;
    });

    const pastEvents = events.filter(event => {
        if (event.status === 'past' || event.status === 'completed') return true;
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate < now;
    });

    // Sort by date (upcoming: soonest first, past: most recent first)
    upcomingEvents.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
    });

    pastEvents.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });

    // Generate HTML for upcoming events
    const upcomingGrid = document.querySelector('#upcoming .card-grid');
    if (upcomingGrid && upcomingEvents.length > 0) {
        upcomingGrid.innerHTML = upcomingEvents.map(event => generateEventCard(event)).join('');
    }

    // Generate HTML for past events
    const pastGrid = document.querySelector('#past .card-grid');
    if (pastGrid && pastEvents.length > 0) {
        pastGrid.innerHTML = pastEvents.map(event => generateEventCard(event)).join('');
    }

    // Re-initialize scroll animations for new content
    const newAnimateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const newObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    newAnimateElements.forEach(el => {
        newObserver.observe(el);
    });
}

function generateEventCard(event) {
    const statusLabels = {
        upcoming: 'KOMMER',
        planned: 'PLANLEGGES',
        past: 'GJENNOMFØRT',
        completed: 'GJENNOMFØRT'
    };

    const statusClass = event.status === 'past' || event.status === 'completed' ? 'past' : 'upcoming';
    const statusText = statusLabels[event.status] || 'KOMMER';
    const dateText = event.date ? formatEventDate(event.date) : event.dateText || 'KOMMER SNART';

    return `
        <article class="event-card animate-on-scroll">
            <div class="event-card-image">
                <img src="${event.image}" alt="${event.title}">
            </div>
            <div class="event-card-content">
                <span class="event-date">📅 ${dateText}</span>
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-location">📍 ${event.location}</p>
                <p class="card-text">
                    ${event.description}
                </p>
                <span class="event-status ${statusClass}">${statusText}</span>
            </div>
        </article>
    `;
}

function getEvents() {
    let events = [];
    try {
        const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
        if (stored) {
            events = JSON.parse(stored);
        }
    } catch (e) {
        events = [];
    }

    // If no valid events found, extract from HTML and save to localStorage
    if (!Array.isArray(events) || events.length === 0) {
        // Extract upcoming events from HTML
        const upcomingEvents = Array.from(document.querySelectorAll('#upcoming .event-card')).map((el, idx) => {
            return {
                id: `upcoming-${idx + 1}`,
                title: el.querySelector('.event-card-title')?.textContent?.trim() || '',
                date: null, // Can't determine exact date from HTML
                dateText: el.querySelector('.event-date')?.textContent?.replace('📅', '').trim() || '',
                location: el.querySelector('.event-card-location')?.textContent?.replace('📍', '').trim() || '',
                image: el.querySelector('.event-card-image img')?.getAttribute('src') || '',
                description: el.querySelector('.card-text')?.textContent?.trim() || '',
                status: 'upcoming'
            };
        });

        // Extract past events from HTML
        const pastEvents = Array.from(document.querySelectorAll('#past .event-card')).map((el, idx) => {
            return {
                id: `past-${idx + 1}`,
                title: el.querySelector('.event-card-title')?.textContent?.trim() || '',
                date: null,
                dateText: el.querySelector('.event-date')?.textContent?.replace('📅', '').trim() || '',
                location: el.querySelector('.event-card-location')?.textContent?.replace('📍', '').trim() || '',
                image: el.querySelector('.event-card-image img')?.getAttribute('src') || '',
                description: el.querySelector('.card-text')?.textContent?.trim() || '',
                status: 'past'
            };
        });

        events = [...upcomingEvents, ...pastEvents];

        if (events.length > 0) {
            localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
        }
    }

    return events;
}

function formatEventDate(dateString) {
    const months = ['JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI',
                   'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
