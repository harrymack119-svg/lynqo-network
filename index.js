// Initialize Lucide Icons
lucide.createIcons();

// ============================
// Navbar scroll effect
// ============================
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
});

// ============================
// Mobile Menu
// ============================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ============================
// Scroll Animations (Intersection Observer)
// ============================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Stagger the animation
            const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
            const siblingIndex = Array.from(siblings).indexOf(entry.target);
            
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, siblingIndex * 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});


// ============================
// Smooth scroll for anchor links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 80; // navbar height
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================
// Animated Counter (Hero Stats)
// ============================
function animateCounter(element, target, prefix = '', suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// Observe stat counters
const statCounters = document.querySelectorAll('.stat-counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            
            if (text.includes('$')) {
                const num = parseInt(text.replace(/[$,]/g, ''));
                animateCounter(entry.target, num, '$', '');
            } else {
                const num = parseInt(text.replace(/,/g, ''));
                if (!isNaN(num)) {
                    animateCounter(entry.target, num, '', '');
                }
            }
            
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statCounters.forEach(el => counterObserver.observe(el));