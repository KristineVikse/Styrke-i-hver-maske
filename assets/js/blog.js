// Blog posts loader for Styrke i hver maske
// Loads blog posts dynamically from localStorage

const STORAGE_KEY = 'blogPosts';

// Load blog posts when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});

function loadBlogPosts() {

    let posts = [];
    try {
        posts = getBlogPosts();
    } catch (e) {
        posts = [];
    }

    // Hvis det ikke finnes noen gyldige innlegg, behold HTML fra blog.html
    if (!Array.isArray(posts) || posts.length === 0) {
        return;
    }

    // Filter out posts without content - keep original HTML if no valid posts
    const validPosts = posts.filter(post => post.content && post.content.trim() !== '');
    if (validPosts.length === 0) {
        return;
    }

    posts = validPosts;

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate blog grid HTML
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = posts.map(post => `
            <article class="blog-card animate-on-scroll">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span>📅 ${formatDate(post.date)}</span>
                        <span>•</span>
                        <span>${post.author}</span>
                    </div>
                    <h2 class="blog-card-title">
                        <a href="#innlegg-${post.id}">${post.title}</a>
                    </h2>
                    <p class="blog-card-excerpt">
                        ${post.excerpt}
                    </p>
                    <a href="#innlegg-${post.id}" class="read-more">LES MER</a>
                </div>
            </article>
        `).join('');
    }

    // Generate full blog posts HTML
    const blogSection = document.querySelector('.blog-grid').closest('.section');
    const fullPostsHTML = posts.map((post, index) => `
        <section id="innlegg-${post.id}" class="section ${index % 2 === 0 ? 'section-alt' : ''}">
            <div class="container">
                <article class="blog-post">
                    <header class="blog-post-header">
                        <h2>${post.title}</h2>
                        <p class="blog-card-meta">
                            📅 ${formatDate(post.date)} • ${post.author}
                        </p>
                    </header>

                    <div class="blog-post-content">
                        ${formatContent(post.content)}
                    </div>
                </article>
            </div>
        </section>
    `).join('');

    // Find the newsletter CTA section
    const newsletterSection = document.querySelector('.booking-section')?.closest('.section');

    if (newsletterSection && blogSection) {
        // Remove old full post sections
        const oldPostSections = document.querySelectorAll('section[id^="innlegg-"]');
        oldPostSections.forEach(section => section.remove());

        // Insert new full post sections before newsletter
        newsletterSection.insertAdjacentHTML('beforebegin', fullPostsHTML);
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

function getBlogPosts() {
    let posts = [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            posts = JSON.parse(stored);
        }
    } catch (e) {
        posts = [];
    }

    // Hvis ingen gyldige innlegg finnes, hent fra HTML og lagre i localStorage
    if (!Array.isArray(posts) || posts.length === 0) {
        // Hent innlegg fra HTML (blog.html)
        const htmlPosts = Array.from(document.querySelectorAll('.blog-grid .blog-card')).map((el, idx) => {
            const postId = idx + 1;
            const fullPostSection = document.querySelector(`#innlegg-${postId}`);
            let content = '';

            if (fullPostSection) {
                const contentDiv = fullPostSection.querySelector('.blog-post-content');
                if (contentDiv) {
                    // Get all paragraph text and join with double line breaks
                    content = Array.from(contentDiv.querySelectorAll('p'))
                        .map(p => p.textContent.trim())
                        .join('\n\n');
                }
            }

            return {
                id: postId,
                title: el.querySelector('.blog-card-title a')?.textContent?.trim() || '',
                date: (el.querySelector('.blog-card-meta span')?.textContent?.replace('📅', '').trim() || ''),
                author: (el.querySelector('.blog-card-meta span:last-child')?.textContent?.trim() || ''),
                image: el.querySelector('.blog-card-image img')?.getAttribute('src') || '',
                excerpt: el.querySelector('.blog-card-excerpt')?.textContent?.trim() || '',
                content: content
            };
        });
        if (htmlPosts.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(htmlPosts));
            posts = htmlPosts;
        }
    }
    return posts;
}

function formatDate(dateString) {
    const months = ['JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI',
                   'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatContent(content) {
    // Split content by double line breaks and wrap in <p> tags
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n                        ');
}
