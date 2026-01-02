// Blog posts loader for Styrke i hver maske
// Magazine-style layout with sidebar navigation

const STORAGE_KEY = 'blogPosts';

// Load blog posts when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    initializeSidebarClicks();
});

function loadBlogPosts() {
    let posts = [];
    try {
        posts = getBlogPosts();
    } catch (e) {
        posts = [];
    }

    // If no posts in localStorage, return (use HTML defaults)
    if (!Array.isArray(posts) || posts.length === 0) {
        return;
    }

    // Filter out posts without content
    const validPosts = posts.filter(post => post.content && post.content.trim() !== '');
    if (validPosts.length === 0) {
        return;
    }

    posts = validPosts;

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display latest post in main area
    displayFeaturedPost(posts[0]);

    // Display older posts in sidebar
    displaySidebarPosts(posts.slice(1));
}

function displayFeaturedPost(post) {
    const featuredPost = document.querySelector('.featured-post');
    if (!featuredPost) return;

    featuredPost.setAttribute('data-post-id', post.id);
    featuredPost.innerHTML = `
        <div class="featured-post-image">
            <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="featured-post-content">
            <div class="blog-card-meta">
                <span>📅 ${formatDate(post.date)}</span>
                <span>•</span>
                <span>${post.author}</span>
            </div>
            <h2 class="featured-post-title">${post.title}</h2>

            <div class="featured-post-text">
                ${formatContent(post.content)}
            </div>
        </div>
    `;
}

function displaySidebarPosts(posts) {
    const sidebarPosts = document.querySelector('.sidebar-posts');
    if (!sidebarPosts) return;

    sidebarPosts.innerHTML = posts.map(post => `
        <article class="sidebar-post" data-post-id="${post.id}">
            <div class="sidebar-post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="sidebar-post-content">
                <div class="sidebar-post-meta">
                    📅 ${formatDateShort(post.date)}
                </div>
                <h4 class="sidebar-post-title">
                    ${post.title}
                </h4>
            </div>
        </article>
    `).join('');

    // Re-initialize click handlers
    initializeSidebarClicks();
}

function initializeSidebarClicks() {
    const sidebarPosts = document.querySelectorAll('.sidebar-post');

    sidebarPosts.forEach(post => {
        post.style.cursor = 'pointer';
        post.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            switchToPost(postId);
        });
    });
}

function switchToPost(postId) {
    let posts = getBlogPosts();

    // Find the clicked post
    const selectedPost = posts.find(p => p.id == postId);
    if (!selectedPost) return;

    // Get current featured post
    const currentPostId = document.querySelector('.featured-post')?.getAttribute('data-post-id');
    const currentPost = posts.find(p => p.id == currentPostId);

    // Switch: selected post becomes featured
    displayFeaturedPost(selectedPost);

    // Update sidebar: remove selected post, add previous featured post
    const otherPosts = posts.filter(p => p.id != postId);

    // Sort other posts by date
    otherPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    displaySidebarPosts(otherPosts);

    // Smooth scroll to top of blog section
    document.querySelector('.blog-layout')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
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

    // If no posts, initialize from HTML
    if (!Array.isArray(posts) || posts.length === 0) {
        const htmlPostsData = document.querySelectorAll('#blog-posts-data article');
        if (htmlPostsData.length > 0) {
            posts = Array.from(htmlPostsData).map(el => {
                const postId = el.getAttribute('data-post-id');
                const title = el.querySelector('.post-title')?.textContent?.trim() || '';
                const meta = el.querySelector('.post-meta')?.textContent?.trim() || '';
                const image = el.querySelector('.post-image')?.textContent?.trim() || '';
                const contentDiv = el.querySelector('.post-content');

                // Extract date and author from meta
                const metaParts = meta.split('•');
                const date = metaParts[0]?.replace('📅', '').trim() || '';
                const author = metaParts[1]?.trim() || 'KRISTINE VIKSE';

                // Extract content
                let content = '';
                if (contentDiv) {
                    content = Array.from(contentDiv.querySelectorAll('p'))
                        .map(p => p.textContent.trim())
                        .join('\n\n');
                }

                // Create excerpt from first paragraph
                const firstPara = contentDiv?.querySelector('p')?.textContent?.trim() || '';
                const excerpt = firstPara.substring(0, 150) + (firstPara.length > 150 ? '...' : '');

                return {
                    id: postId,
                    title: title,
                    date: date,
                    author: author,
                    image: image,
                    excerpt: excerpt,
                    content: content
                };
            });

            // Save to localStorage
            if (posts.length > 0) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            }
        }
    }
    return posts;
}

function formatDate(dateString) {
    const months = ['JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI',
                   'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

    // Handle Norwegian date format (e.g., "15. DESEMBER 2024")
    const norwegianMatch = dateString.match(/(\d+)\.\s+(\w+)\s+(\d{4})/i);
    if (norwegianMatch) {
        return dateString.toUpperCase();
    }

    // Handle ISO date format
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateShort(dateString) {
    const months = ['jan', 'feb', 'mars', 'apr', 'mai', 'juni',
                   'juli', 'aug', 'sep', 'okt', 'nov', 'des'];

    // Handle Norwegian date format
    const norwegianMatch = dateString.match(/(\d+)\.\s+(\w+)\s+(\d{4})/i);
    if (norwegianMatch) {
        const day = norwegianMatch[1];
        const monthName = norwegianMatch[2].toLowerCase();
        const year = norwegianMatch[3];

        // Convert month name to short version
        const monthsLong = ['januar', 'februar', 'mars', 'april', 'mai', 'juni',
                           'juli', 'august', 'september', 'oktober', 'november', 'desember'];
        const monthIndex = monthsLong.findIndex(m => monthName.includes(m));
        const shortMonth = monthIndex >= 0 ? months[monthIndex] : monthName.substring(0, 3);

        return `${day}. ${shortMonth} ${year}`;
    }

    // Handle ISO date format
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatContent(content) {
    // Split content by double line breaks and wrap in <p> tags
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n                ');
}
