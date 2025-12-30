// Admin panel JavaScript for Styrke i hver maske
// Handles authentication and blog post management

// Configuration
const ADMIN_PASSWORD = 'GmmRi2008W'; // CHANGE THIS PASSWORD!
const STORAGE_KEY = 'blogPosts';
const AUTH_KEY = 'adminAuth';

// Toast notification system
let toastContainer = null;

function initToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

function showToast(title, message, type = 'success') {
    initToastContainer();

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.success}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            ${message ? `<p class="toast-message">${message}</p>` : ''}
        </div>
        <button class="toast-close" aria-label="Lukk">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 4000);
}

function removeToast(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 400);
}

// Confirmation modal system
let modalOverlay = null;

function showConfirmModal(title, message, confirmText = 'Bekreft', cancelText = 'Avbryt') {
    return new Promise((resolve) => {
        // Create modal overlay if it doesn't exist
        if (!modalOverlay) {
            modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            document.body.appendChild(modalOverlay);
        }

        // Create modal content
        modalOverlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <div class="modal-icon">⚠</div>
                    <h2 class="modal-title">${title}</h2>
                </div>
                <div class="modal-body">
                    <p class="modal-message">${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn modal-btn-cancel">${cancelText}</button>
                    <button class="modal-btn modal-btn-confirm">${confirmText}</button>
                </div>
            </div>
        `;

        // Show modal
        setTimeout(() => {
            modalOverlay.classList.add('show');
        }, 10);

        // Handle button clicks
        const cancelBtn = modalOverlay.querySelector('.modal-btn-cancel');
        const confirmBtn = modalOverlay.querySelector('.modal-btn-confirm');

        const closeModal = (result) => {
            modalOverlay.classList.remove('show');
            setTimeout(() => {
                if (modalOverlay.parentElement) {
                    modalOverlay.innerHTML = '';
                }
                resolve(result);
            }, 300);
        };

        cancelBtn.addEventListener('click', () => closeModal(false));
        confirmBtn.addEventListener('click', () => closeModal(true));

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal(false);
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal(false);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
}

// Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const postForm = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
const cancelEditBtn = document.getElementById('cancelEdit');
const formTitle = document.getElementById('formTitle');
const imageUpload = document.getElementById('imageUpload');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const imageFileName = document.getElementById('imageFileName');
const imagePreview = document.getElementById('imagePreview');

// Image upload handler
uploadImageBtn.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Bildet er for stort', 'Maksimal størrelse er 5MB.', 'error');
        return;
    }

    // Show filename
    imageFileName.textContent = file.name;

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Image = event.target.result;
        document.getElementById('postImage').value = base64Image;

        // Show preview
        imagePreview.innerHTML = `<img src="${base64Image}" alt="Forhåndsvisning">`;
    };
    reader.readAsDataURL(file);
});

// Check if already logged in
if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    showDashboard();
} else {
    showLogin();
}

// Login form handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        loginError.style.display = 'none';
        showDashboard();
    } else {
        loginError.style.display = 'block';
        document.getElementById('password').value = '';
    }
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    showLogin();
});

// Show/hide screens
function showLogin() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    loadPosts();
}

// Get posts from localStorage
function getPosts() {
    const posts = localStorage.getItem(STORAGE_KEY);
    if (posts) {
        return JSON.parse(posts);
    } else {
        // First time - initialize with default posts
        const defaultPosts = getDefaultPosts();
        savePosts(defaultPosts);
        return defaultPosts;
    }
}

// Save posts to localStorage
function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// Get default posts (existing posts from HTML)
function getDefaultPosts() {
    return [
        {
            id: 1,
            title: 'Hvorfor strikking gir ro',
            date: '2024-12-15',
            author: 'KRISTINE VIKSE',
            image: 'images/IMG_4885.JPG',
            excerpt: 'I en verden som stadig går fortere, er det noen aktiviteter som inviterer oss til å sakte ned. Strikking er en av dem...',
            content: `I en verden som stadig går fortere, er det noen aktiviteter som inviterer oss til å sakte ned. Strikking er en av dem. Men hvorfor er det slik? Hva er det med denne eldgamle håndverkskunsten som gir så mange en følelse av dyprere ro?

Svaret ligger delvis i selve bevegelsene. De repetitive, rytmiske handlingene – løkke etter løkke, maske etter maske – har en beroligende effekt på nervesystemet. Forskning viser at slike bevegelser kan senke stressnivået og aktivere den parasympatiske delen av nervesystemet.

Men det handler også om tilstedeværelse. Når vi strikker, må vi være til stede. Vi må telle masker, følge med på mønsteret, kjenne garnet mellom fingrene. Denne typen fokusert oppmerksomhet er en form for mindfulness – en meditasjon i bevegelse.

Og så er det gleden av å skape. Å se noe vokse frem under egne hender gir en unik form for tilfredsstillelse. Det er konkret, håndgripelig bevis på at vi kan noe – at vi er i stand til å bringe noe vakkert inn i verden.

Så neste gang du kjenner stresset bygge seg opp, prøv å ta frem pinnene. La hendene finne sin rytme, og kjenn hvordan roen sakte senker seg over deg – én maske av gangen.`
        },
        {
            id: 2,
            title: 'Fellesskapets kraft i håndarbeid',
            date: '2024-11-28',
            author: 'KRISTINE VIKSE',
            image: 'images/DEC22ACD-EBD8-406C-B1B4-ED623CD91B35.JPG',
            excerpt: 'Mennesker har alltid samlet seg rundt håndarbeid. Fra spinnerom til strikkekaféer – historien om hvorfor vi skaper best sammen...',
            content: `Mennesker har alltid samlet seg rundt håndarbeid. Fra de gamle spinnerommene hvor kvinner delte historier mens de arbeidet, til dagens moderne strikkekaféer – tradisjonene for å skape sammen strekker seg langt tilbake i tid.

Det er noe spesielt som skjer når vi setter oss ned med andre for å skape. Samtalen flyter lettere. Stillheten føles behagelig, ikke pinlig. Vi er sammen, men også fordypet i vårt eget – en unik balanse mellom fellesskap og indre ro.

Forskning viser at sosiale aktiviteter har stor betydning for vår mentale helse. Når vi kombinerer dette med den beroligende effekten av håndarbeid, får vi en kraftfull kombinasjon. Vi styrker både våre relasjoner og vår indre balanse samtidig.

I Styrke i hver maske ønsker vi å skape rom for dette fellesskapet. Våre strikketreff er ikke bare samlinger – de er møteplasser hvor mennesker kan komme som de er, dele det de har, og gå hjem litt rikere på tilhørighet.

For i bunn og grunn er vi alle en del av et større vevstoff. Og når vi strikker sammen, vever vi ikke bare garn – vi vever oss inn i hverandres liv.`
        },
        {
            id: 3,
            title: 'Kreativitet som selvpleie',
            date: '2024-11-10',
            author: 'KRISTINE VIKSE',
            image: 'images/CFBB9F69-ADBA-4287-BB0B-F51EB3E48E9B.JPG',
            excerpt: 'Når vi gir oss selv rom til å skape, gir vi oss selv en gave. Kreativitet er ikke bare for kunstnere – det er for alle som ønsker å...',
            content: `Når vi gir oss selv rom til å skape, gir vi oss selv en gave. Kreativitet er ikke bare for kunstnere – det er for alle som ønsker å utforske, uttrykke og finne glede i det å lage noe med egne hender.

Kreativ utfoldelse er en form for selvpleie som ofte blir oversett. I hverdagens stress og krav kan det føles som en luksus å sette av tid til noe som "bare" er for gleden. Men nettopp der ligger verdien.

Når vi skaper, gir vi hjernen en pause fra problemløsning og bekymringer. Vi går inn i en flyt-tilstand hvor tiden forsvinner og vi bare er. Dette er dypt helbredende for nervesystemet vårt.

Håndarbeid er en av de mest tilgjengelige formene for kreativ utfoldelse. Det krever ikke store forberedelser eller dyrt utstyr. Bare garn, pinner, og en vilje til å prøve.

Så neste gang du tenker at du ikke har tid til å skape, husk: Det er ikke bortkastet tid. Det er investert tid – i deg selv, din helse, og din indre balanse.`
        }
    ];
}

// Load and display posts
function loadPosts() {
    const posts = getPosts();

    if (posts.length === 0) {
        postsList.innerHTML = '<p class="no-posts">Ingen innlegg ennå. Legg til ditt første innlegg!</p>';
        return;
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    postsList.innerHTML = posts.map(post => `
        <div class="post-item" data-id="${post.id}">
            <div class="post-item-header">
                <h3>${post.title}</h3>
                <span class="post-date">${formatDate(post.date)}</span>
            </div>
            <div class="post-item-actions">
                <button class="btn-small btn-edit" onclick="editPost(${post.id})">Rediger</button>
                <button class="btn-small btn-delete" onclick="deletePost(${post.id})">Slett</button>
            </div>
        </div>
    `).join('');
}

// Format date to Norwegian
function formatDate(dateString) {
    const months = ['JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI',
                   'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Post form submission
postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const postId = document.getElementById('postId').value;
    const posts = getPosts();

    const postData = {
        id: postId ? parseInt(postId) : Date.now(),
        title: document.getElementById('postTitle').value,
        date: document.getElementById('postDate').value,
        author: document.getElementById('postAuthor').value,
        image: document.getElementById('postImage').value,
        excerpt: document.getElementById('postExcerpt').value,
        content: document.getElementById('postContent').value
    };

    if (postId) {
        // Update existing post
        const index = posts.findIndex(p => p.id === parseInt(postId));
        if (index !== -1) {
            posts[index] = postData;
        }
    } else {
        // Add new post
        posts.push(postData);
    }

    savePosts(posts);
    resetForm();
    loadPosts();

    showToast('Innlegget er lagret!', postId ? 'Endringene er oppdatert.' : 'Innlegget er lagt til.', 'success');
});

// Edit post
function editPost(id) {
    const posts = getPosts();
    const post = posts.find(p => p.id === id);

    if (!post) return;

    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postAuthor').value = post.author;
    document.getElementById('postImage').value = post.image;
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postContent').value = post.content;

    // Show image preview if it exists
    if (post.image) {
        imagePreview.innerHTML = `<img src="${post.image}" alt="Forhåndsvisning">`;
        // Extract filename if it's a path, otherwise show "Gjeldende bilde"
        const filename = post.image.includes('/') ? post.image.split('/').pop() : 'Gjeldende bilde';
        imageFileName.textContent = filename;
    }

    formTitle.textContent = 'Rediger innlegg';
    cancelEditBtn.style.display = 'inline-block';

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete post
async function deletePost(id) {
    const posts = getPosts();
    const post = posts.find(p => p.id === id);

    const confirmed = await showConfirmModal(
        'Slett innlegg?',
        `Er du sikker på at du vil slette "${post?.title || 'dette innlegget'}"? Denne handlingen kan ikke angres.`,
        'Slett',
        'Avbryt'
    );

    if (!confirmed) {
        return;
    }

    const filteredPosts = posts.filter(p => p.id !== id);
    savePosts(filteredPosts);
    loadPosts();

    showToast('Innlegget er slettet', 'Innlegget er permanent fjernet.', 'info');
}

// Cancel edit
cancelEditBtn.addEventListener('click', resetForm);

// Reset form
function resetForm() {
    postForm.reset();
    document.getElementById('postId').value = '';
    document.getElementById('postImage').value = '';
    imageFileName.textContent = '';
    imagePreview.innerHTML = '';
    formTitle.textContent = 'Legg til nytt innlegg';
    cancelEditBtn.style.display = 'none';
}

// Make functions globally available
window.editPost = editPost;
window.deletePost = deletePost;

// ===========================================================================
// EVENTS MANAGEMENT
// ===========================================================================

const EVENTS_STORAGE_KEY = 'events';
const eventForm = document.getElementById('eventForm');
const eventsList = document.getElementById('eventsList');
const cancelEventEditBtn = document.getElementById('cancelEventEdit');
const eventFormTitle = document.getElementById('eventFormTitle');
const eventImageUpload = document.getElementById('eventImageUpload');
const uploadEventImageBtn = document.getElementById('uploadEventImageBtn');
const eventImageFileName = document.getElementById('eventImageFileName');
const eventImagePreview = document.getElementById('eventImagePreview');

// Event image upload handler
uploadEventImageBtn.addEventListener('click', () => {
    eventImageUpload.click();
});

eventImageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Bildet er for stort', 'Maksimal størrelse er 5MB.', 'error');
        return;
    }

    // Show filename
    eventImageFileName.textContent = file.name;

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Image = event.target.result;
        document.getElementById('eventImage').value = base64Image;

        // Show preview
        eventImagePreview.innerHTML = `<img src="${base64Image}" alt="Forhåndsvisning">`;
    };
    reader.readAsDataURL(file);
});

// Admin tabs functionality
const adminTabs = document.querySelectorAll('.admin-tab');
const adminTabContents = document.querySelectorAll('.admin-tab-content');

adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Update active tab
        adminTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active content
        adminTabContents.forEach(content => {
            content.classList.remove('active');
        });

        if (targetTab === 'posts') {
            document.getElementById('postsTab').classList.add('active');
        } else if (targetTab === 'events') {
            document.getElementById('eventsTab').classList.add('active');
            loadEvents();
        }
    });
});

// Get events from localStorage
function getEventsData() {
    const events = localStorage.getItem(EVENTS_STORAGE_KEY);
    return events ? JSON.parse(events) : [];
}

// Save events to localStorage
function saveEvents(events) {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
}

// Load and display events
function loadEvents() {
    const events = getEventsData();

    if (events.length === 0) {
        eventsList.innerHTML = '<p class="no-posts">Ingen arrangementer ennå. Legg til ditt første arrangement!</p>';
        return;
    }

    // Sort events by status and date
    events.sort((a, b) => {
        // Upcoming events first
        const statusOrder = { upcoming: 1, planned: 2, completed: 3, past: 4 };
        const statusDiff = (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
        if (statusDiff !== 0) return statusDiff;

        // Then by date
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });

    eventsList.innerHTML = events.map(event => `
        <div class="post-item" data-id="${event.id}">
            <div class="post-item-header">
                <h3>${event.title}</h3>
                <span class="post-date">${event.dateText || (event.date ? formatDate(event.date) : 'Ingen dato')}</span>
            </div>
            <div class="post-item-actions">
                <button class="btn-small btn-edit" onclick="editEvent('${event.id}')">Rediger</button>
                <button class="btn-small btn-delete" onclick="deleteEvent('${event.id}')">Slett</button>
            </div>
        </div>
    `).join('');
}

// Event form submission
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const eventId = document.getElementById('eventId').value;
    const events = getEventsData();

    const eventData = {
        id: eventId || `event-${Date.now()}`,
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value || null,
        dateText: document.getElementById('eventDateText').value,
        location: document.getElementById('eventLocation').value,
        image: document.getElementById('eventImage').value,
        description: document.getElementById('eventDescription').value,
        status: document.getElementById('eventStatus').value
    };

    if (eventId) {
        // Update existing event
        const index = events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            events[index] = eventData;
        }
    } else {
        // Add new event
        events.push(eventData);
    }

    saveEvents(events);
    resetEventForm();
    loadEvents();

    showToast('Arrangementet er lagret!', eventId ? 'Endringene er oppdatert.' : 'Arrangementet er lagt til.', 'success');
});

// Edit event
function editEvent(id) {
    const events = getEventsData();
    const event = events.find(e => e.id === id);

    if (!event) return;

    document.getElementById('eventId').value = event.id;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date || '';
    document.getElementById('eventDateText').value = event.dateText;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventImage').value = event.image;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventStatus').value = event.status;

    // Show image preview if it exists
    if (event.image) {
        eventImagePreview.innerHTML = `<img src="${event.image}" alt="Forhåndsvisning">`;
        const filename = event.image.includes('/') ? event.image.split('/').pop() : 'Gjeldende bilde';
        eventImageFileName.textContent = filename;
    }

    eventFormTitle.textContent = 'Rediger arrangement';
    cancelEventEditBtn.style.display = 'inline-block';

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete event
async function deleteEvent(id) {
    const events = getEventsData();
    const event = events.find(e => e.id === id);

    const confirmed = await showConfirmModal(
        'Slett arrangement?',
        `Er du sikker på at du vil slette "${event?.title || 'dette arrangementet'}"? Denne handlingen kan ikke angres.`,
        'Slett',
        'Avbryt'
    );

    if (!confirmed) {
        return;
    }

    const filteredEvents = events.filter(e => e.id !== id);
    saveEvents(filteredEvents);
    loadEvents();

    showToast('Arrangementet er slettet', 'Arrangementet er permanent fjernet.', 'info');
}

// Cancel event edit
cancelEventEditBtn.addEventListener('click', resetEventForm);

// Reset event form
function resetEventForm() {
    eventForm.reset();
    document.getElementById('eventId').value = '';
    document.getElementById('eventImage').value = '';
    eventImageFileName.textContent = '';
    eventImagePreview.innerHTML = '';
    eventFormTitle.textContent = 'Legg til nytt arrangement';
    cancelEventEditBtn.style.display = 'none';
}

// Make event functions globally available
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
