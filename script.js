/*==================== MENU SHOW/HIDE ====================*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Menu show
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

// Menu hide
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLinks = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

navLinks.forEach(n => n.addEventListener('click', linkAction));

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add the scroll-header class
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

/*==================== SHOW SCROLL TOP ====================*/
function scrollTop() {
    const scrollTop = document.getElementById('scroll-top');
    // When the scroll is higher than 560 viewport height, add the show-scroll class
    if (window.scrollY >= 560) {
        scrollTop.classList.add('show-scroll');
    } else {
        scrollTop.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', scrollTop);

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');
        const sectionLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionLink?.classList.add('active-link');
        } else {
            sectionLink?.classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', scrollActive);

/*==================== SCROLL REVEAL ANIMATION ====================*/
function animateOnScroll() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Add animate-on-scroll class to elements that should animate
function addAnimationClasses() {
    // Hero content
    const heroContent = document.querySelector('.hero__content');
    const heroImage = document.querySelector('.hero__image');
    
    if (heroContent) heroContent.classList.add('animate-on-scroll');
    if (heroImage) heroImage.classList.add('animate-on-scroll');
    
    // Feature cards
    const featureCards = document.querySelectorAll('.feature__card');
    featureCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // About content
    const aboutContent = document.querySelector('.about__content');
    const aboutImage = document.querySelector('.about__image');
    
    if (aboutContent) aboutContent.classList.add('animate-on-scroll');
    if (aboutImage) aboutImage.classList.add('animate-on-scroll');
    
    // CTA content
    const ctaContent = document.querySelector('.cta__content');
    if (ctaContent) ctaContent.classList.add('animate-on-scroll');
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addAnimationClasses();
    animateOnScroll(); // Check initial state
});

window.addEventListener('scroll', animateOnScroll);

/*==================== SMOOTH SCROLLING FOR ANCHOR LINKS ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*==================== LAZY LOADING FOR IMAGES ====================*/
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if IntersectionObserver is supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
}

/*==================== PERFORMANCE OPTIMIZATIONS ====================*/
// Throttle scroll events for better performance
function throttle(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

// Apply throttling to scroll events
const throttledScrollHeader = throttle(scrollHeader, 10);
const throttledScrollTop = throttle(scrollTop, 10);
const throttledScrollActive = throttle(scrollActive, 10);
const throttledAnimateOnScroll = throttle(animateOnScroll, 10);

// Replace direct scroll listeners with throttled versions
window.removeEventListener('scroll', scrollHeader);
window.removeEventListener('scroll', scrollTop);
window.removeEventListener('scroll', scrollActive);
window.removeEventListener('scroll', animateOnScroll);

window.addEventListener('scroll', throttledScrollHeader);
window.addEventListener('scroll', throttledScrollTop);
window.addEventListener('scroll', throttledScrollActive);
window.addEventListener('scroll', throttledAnimateOnScroll);

/*==================== CONTACT FORM FUNCTIONALITY ====================*/
/*==================== CONTACT FORM ====================*/
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusDiv = document.getElementById('contact-status');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('.contact__submit');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showContactStatus('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                this.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showContactStatus('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    function showContactStatus(message, type) {
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.className = `contact__status show ${type}`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/*==================== ACCESSIBILITY ENHANCEMENTS ====================*/
function enhanceAccessibility() {
    // Add keyboard navigation for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    
    if (navToggle) {
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    if (navClose) {
        navClose.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
                navClose.click();
            }
        });
    }
    
    // Add focus management for mobile menu
    const firstFocusableElement = navMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    const lastFocusableElement = navClose;
    
    if (firstFocusableElement && lastFocusableElement) {
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        e.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
        });
    }
}

/*==================== REDUCED MOTION SUPPORT ====================*/
function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable smooth scrolling
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Remove animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.remove('animate-on-scroll');
        });
    }
}

/*==================== DARK MODE TOGGLE ====================*/
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Ensure light mode is explicitly set as default
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Remove old theme class and add new one
            document.documentElement.removeAttribute('data-theme');
            setTimeout(() => {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            }, 50);
        });
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

/*==================== PORTFOLIO FILTERING ====================*/
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter__btn');
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    const portfolioSection = document.getElementById('portfolio');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('filter__btn--active'));
            this.classList.add('filter__btn--active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
            
            // Scroll to portfolio section top
            if (portfolioSection) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = portfolioSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/*==================== LANGUAGE TOGGLE ====================*/
const translations = {
    en: {
        'nav.home': 'Home',
        'nav.portfolio': 'Portfolio',
        'nav.services': 'Services',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'hero.title': 'Capturing Life\'s',
        'hero.title.accent': 'Precious Moments',
        'hero.description': 'Professional photographer specializing in portraits, weddings, events, and commercial photography. Every moment tells a story, and I\'m here to help you preserve yours with artistic vision and technical excellence.',
        'hero.button.book': 'Book a Session',
        'hero.button.portfolio': 'View Portfolio',
        'portfolio.title': 'My Portfolio',
        'portfolio.description': 'A collection of my best work showcasing different photography styles and moments',
        'portfolio.filter.all': 'All',
        'portfolio.filter.portrait': 'Portrait',
        'portfolio.filter.wedding': 'Wedding',
        'portfolio.filter.event': 'Event',
        'portfolio.filter.commercial': 'Commercial',
        'services.title': 'Photography Services',
        'services.description': 'Professional photography services tailored to capture your unique moments and vision',
        'services.portrait.title': 'Portrait Photography',
        'services.portrait.description': 'Professional headshots, lifestyle photography, and personal branding sessions that capture your unique personality and style.',
        'services.portrait.price': 'Starting at $200',
        'services.wedding.title': 'Wedding Photography',
        'services.wedding.description': 'Complete wedding coverage including ceremony, reception, and preparation moments. Capturing every precious moment of your special day.',
        'services.wedding.price': 'Starting at $1,500',
        'services.event.title': 'Event Photography',
        'services.event.description': 'Corporate events, parties, conferences, and celebrations. Professional documentation of your important gatherings.',
        'services.event.price': 'Starting at $300',
        'services.commercial.title': 'Commercial Photography',
        'services.commercial.description': 'Product photography, brand imagery, and marketing materials. High-quality images that elevate your business presence.',
        'services.commercial.price': 'Starting at $400',
        'about.title': 'About Underneath Media',
        'about.description': 'Professional media company dedicated to capturing life\'s beautiful moments',
        'about.text1': 'With over 8 years of experience in photography, I specialize in creating timeless images that tell your unique story. My journey began with a simple love for capturing moments and has evolved into a passion for helping people preserve their most precious memories.',
        'about.text2': 'I believe that every moment has its own beauty and significance, whether it\'s the joy of a wedding day, the warmth of a family gathering, or the confidence in a professional portrait. My goal is to capture genuine emotions and create images you\'ll treasure forever.',
        'about.stats.clients': 'Happy Clients',
        'about.stats.weddings': 'Weddings Captured',
        'about.stats.experience': 'Years Experience',
        'cta.title': 'Ready to Capture Your Moments?',
        'cta.description': 'Let\'s create beautiful memories together. Whether it\'s a special event, professional headshots, or your wedding day, I\'m here to capture every precious moment with artistry and care.',
        'cta.button.book': 'Book Your Session',
        'cta.button.call': 'Call Now',
        'footer.description': 'Professional media company capturing life\'s precious moments with artistic vision and technical excellence. Let\'s create beautiful memories together.',
        'footer.links': 'Quick Links',
        'footer.services': 'Photography Services',
        'footer.contact': 'Contact Info',
        'footer.phone': 'Phone',
        'footer.email': 'Email',
        'footer.address': 'Address',
        'footer.follow': 'Follow Us',
        'footer.copyright': 'All rights reserved',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'contact.title': 'Get In Touch',
        'contact.description': 'Ready to capture your special moments? Send us a message and we\'ll get back to you within 24 hours.',
        'contact.location': 'Location',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        'contact.hours': 'Working Hours',
        'contact.hours.text': 'Mon-Sat: 9AM-6PM\nSunday: By Appointment',
        'contact.form.name': 'Full Name *',
        'contact.form.email': 'Email *',
        'contact.form.phone': 'Phone',
        'contact.form.service': 'Service Type',
        'contact.form.service.select': 'Select Service',
        'contact.form.service.portrait': 'Portrait Photography',
        'contact.form.service.wedding': 'Wedding Photography',
        'contact.form.service.event': 'Event Photography',
        'contact.form.service.commercial': 'Commercial Photography',
        'contact.form.service.other': 'Other',
        'contact.form.subject': 'Subject *',
        'contact.form.message': 'Message *',
        'contact.form.message.placeholder': 'Tell us about your project, preferred dates, and any specific requirements...',
        'contact.form.budget': 'Budget Range',
        'contact.form.budget.select': 'Select Budget Range',
        'contact.form.budget.under500': 'Under $500',
        'contact.form.budget.500-1000': '$500 - $1,000',
        'contact.form.budget.1000-2500': '$1,000 - $2,500',
        'contact.form.budget.2500-5000': '$2,500 - $5,000',
        'contact.form.budget.over5000': 'Over $5,000',
        'contact.form.submit': 'Send Message',
        'auth.login': 'Login',
        'auth.register': 'Register',
        'auth.username': 'Username or Email',
        'auth.email': 'Email',
        'auth.fullname': 'Full Name',
        'auth.password': 'Password',
        'auth.confirm': 'Confirm Password',
        'auth.login.button': 'Login',
        'auth.register.button': 'Register',
        'auth.no.account': '',
        'auth.have.account': 'Already have an account?',
        'auth.login.here': 'Login here',
        'profile.upload': 'Upload Photos',
        'profile.my.photos': 'My Photos',
        'profile.logout': 'Logout',
        'upload.title': 'Upload Photos',
        'upload.category': 'Category',
        'upload.category.select': 'Select Category',
        'upload.category.portrait': 'Portrait',
        'upload.category.wedding': 'Wedding',
        'upload.category.event': 'Event',
        'upload.category.commercial': 'Commercial',
        'upload.title.label': 'Title (Optional)',
        'upload.title.placeholder': 'Photo title',
        'upload.description.label': 'Description (Optional)',
        'upload.description.placeholder': 'Photo description',
        'upload.privacy.label': 'Privacy Setting',
        'upload.privacy.public': 'Public - Show in portfolio for everyone',
        'upload.privacy.private': 'Private - Only visible to me',
        'upload.drag.text': 'Drag and drop photos here or click to select',
        'upload.cancel': 'Cancel',
        'upload.submit': 'Upload Photos',
        'admin.title': 'Admin Panel',
        'admin.upload.title': 'Upload Photos',
        'admin.upload.text': 'Drag and drop photos here or click to select',
        'admin.manage.title': 'Manage Photos'
    },
    th: {
        'nav.home': 'หน้าแรก',
        'nav.portfolio': 'ผลงาน',
        'nav.services': 'บริการ',
        'nav.about': 'เกี่ยวกับเรา',
        'nav.contact': 'ติดต่อ',
        'hero.title': 'บันทึกช่วงเวลา',
        'hero.title.accent': 'อันล้ำค่า',
        'hero.description': 'ช่างภาพมืออาชีพที่เชี่ยวชาญด้านการถ่ายภาพบุคคล งานแต่งงาน งานอีเวนต์ และการถ่ายภาพเชิงพาณิชย์ ทุกช่วงเวลามีเรื่องราวของตัวเอง และเราพร้อมที่จะช่วยคุณเก็บรักษาเรื่องราวเหล่านั้นด้วยวิสัยทัศน์ทางศิลปะและความเป็นเลิศทางเทคนิค',
        'hero.button.book': 'จองเซสชั่น',
        'hero.button.portfolio': 'ดูผลงาน',
        'portfolio.title': 'ผลงานของเรา',
        'portfolio.description': 'คอลเลกชั่นผลงานที่ดีที่สุดของเรา แสดงให้เห็นถึงสไตล์การถ่ายภาพและช่วงเวลาต่างๆ',
        'portfolio.filter.all': 'ทั้งหมด',
        'portfolio.filter.portrait': 'ภาพบุคคล',
        'portfolio.filter.wedding': 'งานแต่งงาน',
        'portfolio.filter.event': 'อีเวนต์',
        'portfolio.filter.commercial': 'เชิงพาณิชย์',
        'services.title': 'บริการถ่ายภาพ',
        'services.description': 'บริการถ่ายภาพมืออาชีพที่ออกแบบมาเพื่อบันทึกช่วงเวลาพิเศษและวิสัยทัศน์ของคุณ',
        'services.portrait.title': 'การถ่ายภาพบุคคล',
        'services.portrait.description': 'การถ่ายภาพหัวใส ภาพไลฟ์สไตล์ และการถ่ายภาพเพื่อสร้างแบรนด์ส่วนบุคคลที่แสดงถึงบุคลิกและสไตล์ที่เป็นเอกลักษณ์ของคุณ',
        'services.portrait.price': 'เริ่มต้นที่ 6,000 บาท',
        'services.wedding.title': 'การถ่ายภาพงานแต่งงาน',
        'services.wedding.description': 'การบันทึกภาพงานแต่งงานแบบครบวงจร รวมถึงพิธีแต่งงาน งานเลี้ยง และการเตรียมตัว บันทึกทุกช่วงเวลาอันล้ำค่าของวันพิเศษของคุณ',
        'services.wedding.price': 'เริ่มต้นที่ 45,000 บาท',
        'services.event.title': 'การถ่ายภาพอีเวนต์',
        'services.event.description': 'งานองค์กร งานปาร์ตี้ การประชุม และงานเฉลิมฉลอง การบันทึกภาพมืออาชีพสำหรับการรวมตัวที่สำคัญของคุณ',
        'services.event.price': 'เริ่มต้นที่ 9,000 บาท',
        'services.commercial.title': 'การถ่ายภาพเชิงพาณิชย์',
        'services.commercial.description': 'การถ่ายภาพผลิตภัณฑ์ การสร้างภาพลักษณ์แบรนด์ และสื่อการตลาด ภาพคุณภาพสูงที่ยกระดับการปรากฏตัวทางธุรกิจของคุณ',
        'services.commercial.price': 'เริ่มต้นที่ 12,000 บาท',
        'about.title': 'เกี่ยวกับ Underneath Media',
        'about.description': 'บริษัทสื่อมืออาชีพที่มุ่งมั่นในการบันทึกช่วงเวลาอันงดงามของชีวิต',
        'about.text1': 'ด้วยประสบการณ์กว่า 8 ปีในด้านการถ่ายภาพ เราเชี่ยวชาญในการสร้างภาพอันเป็นอมตะที่บอกเล่าเรื่องราวอันเป็นเอกลักษณ์ของคุณ การเดินทางของเราเริ่มต้นจากความรักอย่างเรียบง่ายในการบันทึกช่วงเวลา และได้พัฒนาเป็นความหลงใหลในการช่วยผู้คนเก็บรักษาความทรงจำอันล้ำค่า',
        'about.text2': 'เราเชื่อว่าทุกช่วงเวลามีความงามและความสำคัญของตัวเอง ไม่ว่าจะเป็นความสุขในวันแต่งงาน ความอบอุ่นของการรวมตัวครอบครัว หรือความมั่นใจในภาพบุคคลมืออาชีพ เป้าหมายของเราคือการจับภาพอารมณ์ที่แท้จริงและสร้างภาพที่คุณจะทะนุถนอมตลอดไป',
        'about.stats.clients': 'ลูกค้าที่พึงพอใจ',
        'about.stats.weddings': 'งานแต่งงานที่บันทึก',
        'about.stats.experience': 'ปีของประสบการณ์',
        'cta.title': 'พร้อมที่จะบันทึกช่วงเวลาของคุณแล้วหรือยัง?',
        'cta.description': 'มาสร้างความทรงจำอันงดงามไปด้วยกัน ไม่ว่าจะเป็นงานอีเวนต์พิเศษ การถ่ายภาพโปรไฟล์ หรือวันแต่งงานของคุณ เราพร้อมที่จะบันทึกทุกช่วงเวลาอันล้ำค่าด้วยศิลปะและความใส่ใจ',
        'cta.button.book': 'จองเซสชั่นของคุณ',
        'cta.button.call': 'โทรเลย',
        'footer.description': 'บริษัทสื่อมืออาชีพที่บันทึกช่วงเวลาอันล้ำค่าของชีวิตด้วยวิสัยทัศน์ทางศิลปะและความเป็นเลิศทางเทคนิค มาสร้างความทรงจำอันงดงามไปด้วยกัน',
        'footer.links': 'ลิงก์ด่วน',
        'footer.services': 'บริการถ่ายภาพ',
        'footer.contact': 'ติดต่อเรา',
        'footer.phone': 'โทรศัพท์',
        'footer.email': 'อีเมล',
        'footer.address': 'ที่อยู่',
        'footer.follow': 'ติดตามเรา',
        'footer.copyright': 'สงวนลิขสิทธิ์',
        'footer.privacy': 'นโยบายความเป็นส่วนตัว',
        'footer.terms': 'ข้อกำหนดการใช้งาน',
        'auth.login': 'เข้าสู่ระบบ',
        'auth.register': 'สมัครสมาชิก',
        'auth.username': 'ชื่อผู้ใช้หรืออีเมล',
        'auth.email': 'อีเมล',
        'auth.fullname': 'ชื่อเต็ม',
        'auth.password': 'รหัสผ่าน',
        'auth.confirm': 'ยืนยันรหัสผ่าน',
        'auth.login.button': 'เข้าสู่ระบบ',
        'auth.register.button': 'สมัครสมาชิก',
        'auth.no.account': '',
        'auth.have.account': 'มีบัญชีแล้ว?',

        'auth.login.here': 'เข้าสู่ระบบที่นี่',
        'profile.upload': 'อัปโหลดภาพ',
        'profile.my.photos': 'ภาพของฉัน',
        'profile.logout': 'ออกจากระบบ',
        'upload.title': 'อัปโหลดภาพ',
        'upload.category': 'หมวดหมู่',
        'upload.category.select': 'เลือกหมวดหมู่',
        'upload.category.portrait': 'ภาพบุคคล',
        'upload.category.wedding': 'งานแต่งงาน',
        'upload.category.event': 'อีเวนต์',
        'upload.category.commercial': 'เชิงพาณิชย์',
        'upload.title.label': 'ชื่อภาพ (ไม่บังคับ)',
        'upload.title.placeholder': 'ชื่อภาพ',
        'upload.description.label': 'คำอธิบาย (ไม่บังคับ)',
        'upload.description.placeholder': 'คำอธิบายภาพ',
        'upload.privacy.label': 'การตั้งค่าความเป็นส่วนตัว',
        'upload.privacy.public': 'สาธารณะ - แสดงในพอร์ตโฟลิโอสำหรับทุกคน',
        'upload.privacy.private': 'ส่วนตัว - มองเห็นได้เฉพาะฉัน',
        'upload.drag.text': 'ลากและวางภาพที่นี่หรือคลิกเพื่อเลือก',
        'upload.cancel': 'ยกเลิก',
        'upload.submit': 'อัปโหลดภาพ',
        'admin.title': 'แผงควบคุมผู้ดูแลระบบ',
        'admin.upload.title': 'อัปโหลดภาพ',
        'admin.upload.text': 'ลากและวางภาพที่นี่หรือคลิกเพื่อเลือก',
        'admin.manage.title': 'จัดการภาพ',
        'contact.title': 'ติดต่อเรา',
        'contact.description': 'พร้อมที่จะบันทึกช่วงเวลาพิเศษของคุณแล้วหรือยัง? ส่งข้อความหาเราและเราจะตอบกลับภายใน 24 ชั่วโมง',
        'contact.location': 'ที่อยู่',
        'contact.phone': 'โทรศัพท์',
        'contact.email': 'อีเมล',
        'contact.hours': 'เวลาทำการ',
        'contact.hours.text': 'จันทร์-เสาร์: 9:00-18:00\nอาทิตย์: นัดหมายล่วงหน้า',
        'contact.form.name': 'ชื่อเต็ม *',
        'contact.form.email': 'อีเมล *',
        'contact.form.phone': 'โทรศัพท์',
        'contact.form.service': 'ประเภทบริการ',
        'contact.form.service.select': 'เลือกบริการ',
        'contact.form.service.portrait': 'การถ่ายภาพบุคคล',
        'contact.form.service.wedding': 'การถ่ายภาพงานแต่งงาน',
        'contact.form.service.event': 'การถ่ายภาพอีเวนต์',
        'contact.form.service.commercial': 'การถ่ายภาพเชิงพาณิชย์',
        'contact.form.service.other': 'อื่นๆ',
        'contact.form.subject': 'หัวข้อ *',
        'contact.form.message': 'ข้อความ *',
        'contact.form.message.placeholder': 'บอกเราเกี่ยวกับโครงการของคุณ วันที่ต้องการ และข้อกำหนดพิเศษใดๆ...',
        'contact.form.budget': 'งบประมาณ',
        'contact.form.budget.select': 'เลือกช่วงงบประมาณ',
        'contact.form.budget.under500': 'ต่ำกว่า 15,000 บาท',
        'contact.form.budget.500-1000': '15,000 - 30,000 บาท',
        'contact.form.budget.1000-2500': '30,000 - 75,000 บาท',
        'contact.form.budget.2500-5000': '75,000 - 150,000 บาท',
        'contact.form.budget.over5000': 'มากกว่า 150,000 บาท',
        'contact.form.submit': 'ส่งข้อความ'
    }
};

function initLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    const languageText = document.getElementById('language-text');
    
    let currentLang = localStorage.getItem('language') || 'en';
    updateLanguage(currentLang);
    
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            currentLang = currentLang === 'en' ? 'th' : 'en';
            updateLanguage(currentLang);
            localStorage.setItem('language', currentLang);
        });
    }
    
    function updateLanguage(lang) {
        languageText.textContent = lang.toUpperCase();
        
        // Update all elements with data-lang-key
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update specific elements by ID or class
        const elements = {
            '.nav__link[href="#home"]': translations[lang]['nav.home'],
            '.nav__link[href="#portfolio"]': translations[lang]['nav.portfolio'],
            '.nav__link[href="#services"]': translations[lang]['nav.services'],
            '.nav__link[href="#about"]': translations[lang]['nav.about'],
            '.nav__link[href="#contact"]': translations[lang]['nav.contact']
        };
        
        Object.entries(elements).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element && text) {
                element.textContent = text;
            }
        });
        
        // Update hero section
        const heroTitle = document.querySelector('.hero__title');
        const heroDesc = document.querySelector('.hero__description');
        const bookBtn = document.querySelector('.hero__buttons .button--primary');
        const portfolioBtn = document.querySelector('.hero__buttons .button--secondary');
        
        if (heroTitle) heroTitle.innerHTML = `${translations[lang]['hero.title']}<br><span class="hero__title-accent">${translations[lang]['hero.title.accent']}</span>`;
        if (heroDesc) heroDesc.textContent = translations[lang]['hero.description'];
        if (bookBtn) bookBtn.textContent = translations[lang]['hero.button.book'];
        if (portfolioBtn) portfolioBtn.textContent = translations[lang]['hero.button.portfolio'];
        
        // Update section titles and descriptions
        const portfolioTitle = document.querySelector('#portfolio .section__title');
        const portfolioDescription = document.querySelector('#portfolio .section__description');
        const servicesTitle = document.querySelector('#services .section__title');
        const servicesDescription = document.querySelector('#services .section__description');
        const aboutTitle = document.querySelector('#about .section__title');
        const aboutDescription = document.querySelector('#about .section__description');
        const ctaTitle = document.querySelector('.cta__title');
        const ctaDescription = document.querySelector('.cta__description');
        const ctaBookBtn = document.querySelector('.cta__buttons .button--primary');
        const ctaCallBtn = document.querySelector('.cta__buttons .button--secondary');
        
        if (portfolioTitle) portfolioTitle.textContent = translations[lang]['portfolio.title'];
        if (portfolioDescription) portfolioDescription.textContent = translations[lang]['portfolio.description'];
        if (servicesTitle) servicesTitle.textContent = translations[lang]['services.title'];
        if (servicesDescription) servicesDescription.textContent = translations[lang]['services.description'];
        if (aboutTitle) aboutTitle.textContent = translations[lang]['about.title'];
        if (aboutDescription) aboutDescription.textContent = translations[lang]['about.description'];
        if (ctaTitle) ctaTitle.textContent = translations[lang]['cta.title'];
        if (ctaDescription) ctaDescription.textContent = translations[lang]['cta.description'];
        if (ctaBookBtn) ctaBookBtn.textContent = translations[lang]['cta.button.book'];
        if (ctaCallBtn) ctaCallBtn.innerHTML = `<i class="fas fa-phone"></i>${translations[lang]['cta.button.call']}`;
        
        // Update portfolio filters
        const filterBtns = document.querySelectorAll('.filter__btn');
        filterBtns.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            if (filter === 'all') btn.textContent = translations[lang]['portfolio.filter.all'];
            else if (filter === 'portrait') btn.textContent = translations[lang]['portfolio.filter.portrait'];
            else if (filter === 'wedding') btn.textContent = translations[lang]['portfolio.filter.wedding'];
            else if (filter === 'event') btn.textContent = translations[lang]['portfolio.filter.event'];
            else if (filter === 'commercial') btn.textContent = translations[lang]['portfolio.filter.commercial'];
        });
        
        // Update service cards
        const serviceCards = document.querySelectorAll('.service__card');
        serviceCards.forEach((card, index) => {
            const title = card.querySelector('.service__title');
            const desc = card.querySelector('.service__description');
            const price = card.querySelector('.service__price');
            
            if (index === 0 && title && desc && price) { // Portrait
                title.textContent = translations[lang]['services.portrait.title'];
                desc.textContent = translations[lang]['services.portrait.description'];
                price.textContent = translations[lang]['services.portrait.price'];
            } else if (index === 1 && title && desc && price) { // Wedding
                title.textContent = translations[lang]['services.wedding.title'];
                desc.textContent = translations[lang]['services.wedding.description'];
                price.textContent = translations[lang]['services.wedding.price'];
            } else if (index === 2 && title && desc && price) { // Event
                title.textContent = translations[lang]['services.event.title'];
                desc.textContent = translations[lang]['services.event.description'];
                price.textContent = translations[lang]['services.event.price'];
            } else if (index === 3 && title && desc && price) { // Commercial
                title.textContent = translations[lang]['services.commercial.title'];
                desc.textContent = translations[lang]['services.commercial.description'];
                price.textContent = translations[lang]['services.commercial.price'];
            }
        });
        
        // Update about text
        const aboutTexts = document.querySelectorAll('.about__text');
        if (aboutTexts[0]) aboutTexts[0].textContent = translations[lang]['about.text1'];
        if (aboutTexts[1]) aboutTexts[1].textContent = translations[lang]['about.text2'];
        
        // Update stats labels
        const statLabels = document.querySelectorAll('.stat__label');
        if (statLabels[0]) statLabels[0].textContent = translations[lang]['about.stats.clients'];
        if (statLabels[1]) statLabels[1].textContent = translations[lang]['about.stats.weddings'];
        if (statLabels[2]) statLabels[2].textContent = translations[lang]['about.stats.experience'];
        
        // Update footer
        const footerDesc = document.querySelector('.footer__description');
        const footerTitles = document.querySelectorAll('.footer__title');
        if (footerDesc) footerDesc.textContent = translations[lang]['footer.description'];
        if (footerTitles[0]) footerTitles[0].textContent = translations[lang]['footer.links'];
        if (footerTitles[1]) footerTitles[1].textContent = translations[lang]['footer.services'];
        if (footerTitles[2]) footerTitles[2].textContent = translations[lang]['footer.contact'];
        
        // Update contact section
        const contactTitle = document.querySelector('#contact .section__title');
        const contactDesc = document.querySelector('#contact .section__description');
        if (contactTitle) contactTitle.textContent = translations[lang]['contact.title'];
        if (contactDesc) contactDesc.textContent = translations[lang]['contact.description'];
        
        // Update contact cards
        const contactCards = document.querySelectorAll('.contact__card');
        if (contactCards[0]) {
            const title = contactCards[0].querySelector('.contact__title');
            if (title) title.textContent = translations[lang]['contact.location'];
        }
        if (contactCards[1]) {
            const title = contactCards[1].querySelector('.contact__title');
            if (title) title.textContent = translations[lang]['contact.phone'];
        }
        if (contactCards[2]) {
            const title = contactCards[2].querySelector('.contact__title');
            if (title) title.textContent = translations[lang]['contact.email'];
        }
        if (contactCards[3]) {
            const title = contactCards[3].querySelector('.contact__title');
            const text = contactCards[3].querySelector('.contact__text');
            if (title) title.textContent = translations[lang]['contact.hours'];
            if (text) text.innerHTML = translations[lang]['contact.hours.text'].replace(/\n/g, '<br>');
        }
        
        // Update contact form
        updateContactFormLanguage(lang);
        
        // Update auth modal
        updateAuthModalLanguage(lang);
        updateUploadModalLanguage(lang);
        updateProfileMenuLanguage(lang);
    }
    
    function updateAuthModalLanguage(lang) {
        // Update auth modal elements
        const loginUsernameLabel = document.querySelector('label[for="login-username"]');
        const loginPasswordLabel = document.querySelector('label[for="login-password"]');
        const loginButton = document.querySelector('#login-form button[type="submit"]');
        const loginSwitchText = document.querySelector('#login-form .auth__switch');
        const showRegisterBtn = document.getElementById('show-register');
        
        const registerUsernameLabel = document.querySelector('label[for="register-username"]');
        const registerEmailLabel = document.querySelector('label[for="register-email"]');
        const registerFullnameLabel = document.querySelector('label[for="register-fullname"]');
        const registerPasswordLabel = document.querySelector('label[for="register-password"]');
        const registerConfirmLabel = document.querySelector('label[for="register-confirm"]');
        const registerButton = document.querySelector('#register-form button[type="submit"]');
        const registerSwitchText = document.querySelector('#register-form .auth__switch');
        const showLoginBtn = document.getElementById('show-login');
        
        if (loginUsernameLabel) loginUsernameLabel.textContent = translations[lang]['auth.username'];
        if (loginPasswordLabel) loginPasswordLabel.textContent = translations[lang]['auth.password'];
        if (loginButton) loginButton.textContent = translations[lang]['auth.login.button'];
        if (loginSwitchText) loginSwitchText.textContent = translations[lang]['auth.no.account'];
        
        if (registerUsernameLabel) registerUsernameLabel.textContent = translations[lang]['auth.username'];
        if (registerEmailLabel) registerEmailLabel.textContent = translations[lang]['auth.email'];
        if (registerFullnameLabel) registerFullnameLabel.textContent = translations[lang]['auth.fullname'];
        if (registerPasswordLabel) registerPasswordLabel.textContent = translations[lang]['auth.password'];
        if (registerConfirmLabel) registerConfirmLabel.textContent = translations[lang]['auth.confirm'];
        if (registerButton) registerButton.textContent = translations[lang]['auth.register.button'];
        if (registerSwitchText) registerSwitchText.innerHTML = `${translations[lang]['auth.have.account']} <button type="button" class="auth__link" id="show-login">${translations[lang]['auth.login.here']}</button>`;
    }
    
    function updateUploadModalLanguage(lang) {
        const uploadTitle = document.querySelector('#upload-modal .upload__header h2');
        const categoryLabel = document.querySelector('label[for="photo-category"]');
        const categorySelect = document.getElementById('photo-category');
        const titleLabel = document.querySelector('label[for="photo-title"]');
        const titleInput = document.getElementById('photo-title');
        const descLabel = document.querySelector('label[for="photo-description"]');
        const descTextarea = document.getElementById('photo-description');
        const privacyLabel = document.querySelector('label[for="photo-privacy"]');
        const privacySelect = document.getElementById('photo-privacy');
        const uploadText = document.querySelector('#upload-drop-area p');
        const cancelBtn = document.getElementById('cancel-upload');
        const submitBtn = document.getElementById('submit-upload');
        
        if (uploadTitle) uploadTitle.textContent = translations[lang]['upload.title'];
        if (categoryLabel) categoryLabel.textContent = translations[lang]['upload.category'];
        if (titleLabel) titleLabel.textContent = translations[lang]['upload.title.label'];
        if (titleInput) titleInput.placeholder = translations[lang]['upload.title.placeholder'];
        if (descLabel) descLabel.textContent = translations[lang]['upload.description.label'];
        if (descTextarea) descTextarea.placeholder = translations[lang]['upload.description.placeholder'];
        if (privacyLabel) privacyLabel.textContent = translations[lang]['upload.privacy.label'];
        if (uploadText) uploadText.textContent = translations[lang]['upload.drag.text'];
        if (cancelBtn) cancelBtn.textContent = translations[lang]['upload.cancel'];
        if (submitBtn) submitBtn.textContent = translations[lang]['upload.submit'];
        
        if (categorySelect) {
            categorySelect.innerHTML = `
                <option value="">${translations[lang]['upload.category.select']}</option>
                <option value="portrait">${translations[lang]['upload.category.portrait']}</option>
                <option value="wedding">${translations[lang]['upload.category.wedding']}</option>
                <option value="event">${translations[lang]['upload.category.event']}</option>
                <option value="commercial">${translations[lang]['upload.category.commercial']}</option>
            `;
        }
        
        if (privacySelect) {
            privacySelect.innerHTML = `
                <option value="public">${translations[lang]['upload.privacy.public']}</option>
                <option value="private">${translations[lang]['upload.privacy.private']}</option>
            `;
        }
    }
    
    function updateProfileMenuLanguage(lang) {
        const loginBtn = document.querySelector('#login-btn span');
        const uploadPhotosMenuBtn = document.getElementById('upload-photos-btn');
        const myPhotosBtn = document.getElementById('my-photos-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (loginBtn) loginBtn.textContent = translations[lang]['auth.login'];
        if (uploadPhotosMenuBtn) uploadPhotosMenuBtn.innerHTML = `<i class="fas fa-camera"></i>${translations[lang]['profile.upload']}`;
        if (myPhotosBtn) myPhotosBtn.innerHTML = `<i class="fas fa-images"></i>${translations[lang]['profile.my.photos']}`;
        if (logoutBtn) logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i>${translations[lang]['profile.logout']}`;
    }
    
    function updateContactFormLanguage(lang) {
        // Contact form labels
        const nameLabel = document.querySelector('label[for="contact-name"]');
        const emailLabel = document.querySelector('label[for="contact-email"]');
        const phoneLabel = document.querySelector('label[for="contact-phone"]');
        const serviceLabel = document.querySelector('label[for="contact-service"]');
        const subjectLabel = document.querySelector('label[for="contact-subject"]');
        const messageLabel = document.querySelector('label[for="contact-message"]');
        const budgetLabel = document.querySelector('label[for="contact-budget"]');
        const submitBtn = document.querySelector('.contact__submit');
        const messagePlaceholder = document.getElementById('contact-message');
        
        if (nameLabel) nameLabel.textContent = translations[lang]['contact.form.name'];
        if (emailLabel) emailLabel.textContent = translations[lang]['contact.form.email'];
        if (phoneLabel) phoneLabel.textContent = translations[lang]['contact.form.phone'];
        if (serviceLabel) serviceLabel.textContent = translations[lang]['contact.form.service'];
        if (subjectLabel) subjectLabel.textContent = translations[lang]['contact.form.subject'];
        if (messageLabel) messageLabel.textContent = translations[lang]['contact.form.message'];
        if (budgetLabel) budgetLabel.textContent = translations[lang]['contact.form.budget'];
        if (submitBtn) submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i>${translations[lang]['contact.form.submit']}`;
        if (messagePlaceholder) messagePlaceholder.placeholder = translations[lang]['contact.form.message.placeholder'];
        
        // Update select options
        const serviceSelect = document.getElementById('contact-service');
        const budgetSelect = document.getElementById('contact-budget');
        
        if (serviceSelect) {
            serviceSelect.innerHTML = `
                <option value="">${translations[lang]['contact.form.service.select']}</option>
                <option value="portrait">${translations[lang]['contact.form.service.portrait']}</option>
                <option value="wedding">${translations[lang]['contact.form.service.wedding']}</option>
                <option value="event">${translations[lang]['contact.form.service.event']}</option>
                <option value="commercial">${translations[lang]['contact.form.service.commercial']}</option>
                <option value="other">${translations[lang]['contact.form.service.other']}</option>
            `;
        }
        
        if (budgetSelect) {
            budgetSelect.innerHTML = `
                <option value="">${translations[lang]['contact.form.budget.select']}</option>
                <option value="under-500">${translations[lang]['contact.form.budget.under500']}</option>
                <option value="500-1000">${translations[lang]['contact.form.budget.500-1000']}</option>
                <option value="1000-2500">${translations[lang]['contact.form.budget.1000-2500']}</option>
                <option value="2500-5000">${translations[lang]['contact.form.budget.2500-5000']}</option>
                <option value="over-5000">${translations[lang]['contact.form.budget.over5000']}</option>
            `;
        }
    }
}

/*==================== ADMIN PANEL ====================*/
function initAdminPanel() {
    const adminAccess = document.getElementById('admin-access');
    const adminPanel = document.getElementById('admin-panel');
    const adminClose = document.getElementById('admin-close');
    const adminOverlay = document.getElementById('admin-overlay');
    const uploadArea = document.getElementById('upload-area');
    const photoUpload = document.getElementById('photo-upload');
    const uploadPreview = document.getElementById('upload-preview');
    const photoGrid = document.getElementById('photo-grid');
    
    let uploadedFiles = [];
    let existingPhotos = JSON.parse(localStorage.getItem('portfolioPhotos')) || [];
    
    // Show admin access button (in real app, this would be secured)
    setTimeout(() => {
        adminAccess.style.display = 'block';
    }, 3000);
    
    // Admin panel toggle
    adminAccess?.addEventListener('click', () => {
        adminPanel.classList.add('show');
        loadExistingPhotos();
    });
    
    adminClose?.addEventListener('click', closeAdminPanel);
    adminOverlay?.addEventListener('click', closeAdminPanel);
    
    function closeAdminPanel() {
        adminPanel.classList.remove('show');
        uploadedFiles = [];
        uploadPreview.innerHTML = '';
    }
    
    // File upload handling
    uploadArea?.addEventListener('click', () => photoUpload.click());
    uploadArea?.addEventListener('dragover', handleDragOver);
    uploadArea?.addEventListener('drop', handleFileDrop);
    photoUpload?.addEventListener('change', handleFileSelect);
    
    function handleDragOver(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    }
    
    function handleFileDrop(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }
    
    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
    }
    
    function processFiles(files) {
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoData = {
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        name: file.name,
                        category: 'portrait' // Default category
                    };
                    uploadedFiles.push(photoData);
                    displayPreview(photoData);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    function displayPreview(photo) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview__item';
        previewItem.innerHTML = `
            <img src="${photo.src}" alt="${photo.name}">
            <button class="preview__remove" onclick="removePreview(${photo.id})">
                <i class="fas fa-times"></i>
            </button>
            <select class="preview__category" onchange="updateCategory(${photo.id}, this.value)">
                <option value="portrait">Portrait</option>
                <option value="wedding">Wedding</option>
                <option value="event">Event</option>
                <option value="commercial">Commercial</option>
            </select>
        `;
        uploadPreview.appendChild(previewItem);
        
        // Add save button if not exists
        if (!document.querySelector('.save__photos')) {
            const saveBtn = document.createElement('button');
            saveBtn.className = 'button button--primary save__photos';
            saveBtn.textContent = 'Save Photos';
            saveBtn.onclick = savePhotos;
            uploadPreview.appendChild(saveBtn);
        }
    }
    
    function savePhotos() {
        existingPhotos = [...existingPhotos, ...uploadedFiles];
        localStorage.setItem('portfolioPhotos', JSON.stringify(existingPhotos));
        updatePortfolioDisplay();
        showNotification('Photos saved successfully!', 'success');
        uploadedFiles = [];
        uploadPreview.innerHTML = '';
    }
    
    function loadExistingPhotos() {
        photoGrid.innerHTML = '';
        existingPhotos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo__item';
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="${photo.name}">
                <div class="photo__actions">
                    <button class="photo__action" onclick="deletePhoto(${photo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            photoGrid.appendChild(photoItem);
        });
    }
    
    // Global functions for inline event handlers
    window.removePreview = function(id) {
        uploadedFiles = uploadedFiles.filter(photo => photo.id !== id);
        loadPreview();
    };
    
    window.updateCategory = function(id, category) {
        const photo = uploadedFiles.find(p => p.id === id);
        if (photo) photo.category = category;
    };
    
    window.deletePhoto = function(id) {
        existingPhotos = existingPhotos.filter(photo => photo.id !== id);
        localStorage.setItem('portfolioPhotos', JSON.stringify(existingPhotos));
        loadExistingPhotos();
        updatePortfolioDisplay();
        showNotification('Photo deleted successfully!', 'success');
    };
    
    function loadPreview() {
        uploadPreview.innerHTML = '';
        uploadedFiles.forEach(displayPreview);
    }
    
    function updatePortfolioDisplay() {
        // Update the main portfolio section with new photos
        const portfolioContainer = document.querySelector('.portfolio__container');
        if (portfolioContainer && existingPhotos.length > 0) {
            // Clear existing placeholder items and add real photos
            portfolioContainer.innerHTML = '';
            existingPhotos.forEach(photo => {
                const portfolioItem = document.createElement('article');
                portfolioItem.className = 'portfolio__item';
                portfolioItem.setAttribute('data-category', photo.category);
                portfolioItem.innerHTML = `
                    <div class="portfolio__image">
                        <img src="${photo.src}" alt="${photo.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--border-radius-lg);">
                        <div class="portfolio__overlay">
                            <h3>${photo.category.charAt(0).toUpperCase() + photo.category.slice(1)} Photography</h3>
                            <p>${photo.name}</p>
                        </div>
                    </div>
                `;
                portfolioContainer.appendChild(portfolioItem);
            });
        }
    }
    
    // Load existing photos on page load
    updatePortfolioDisplay();
}

/*==================== AUTHENTICATION SYSTEM ====================*/
let currentUser = null;

// API helper function
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include',
            ...options
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`${response.status}: ${error.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-close');
    const authOverlay = document.getElementById('auth-overlay');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const authTitle = document.getElementById('auth-title');
    const logoutBtn = document.getElementById('logout-btn');
    const uploadPhotosButton = document.getElementById('upload-photos-btn');

    // Check if user is already logged in
    checkAuthStatus();

    // Event listeners
    loginBtn?.addEventListener('click', () => showAuthModal('login'));
    authClose?.addEventListener('click', hideAuthModal);
    authOverlay?.addEventListener('click', hideAuthModal);
    showRegister?.addEventListener('click', () => switchAuthForm('register'));
    showLogin?.addEventListener('click', () => switchAuthForm('login'));
    logoutBtn?.addEventListener('click', logout);
    uploadPhotosButton?.addEventListener('click', () => {
        if (window.showUploadModal) {
            window.showUploadModal();
        }
    });

    // Form submissions
    loginForm?.addEventListener('submit', handleLogin);
    registerForm?.addEventListener('submit', handleRegister);

    function showAuthModal(mode = 'login') {
        switchAuthForm(mode);
        authModal.classList.add('show');
    }

    function hideAuthModal() {
        authModal.classList.remove('show');
        // Reset forms
        loginForm?.reset();
        registerForm?.reset();
    }

    function switchAuthForm(mode) {
        if (mode === 'login') {
            authTitle.textContent = 'Login';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            authTitle.textContent = 'Register';
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await apiRequest('/api/login', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            currentUser = response.user;
            window.currentUser = response.user;
            updateUserUI();
            hideAuthModal();
            showNotification('Login successful!', 'success');
            console.log('User logged in:', window.currentUser);
        } catch (error) {
            showNotification('Login failed: ' + error.message, 'error');
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            fullName: formData.get('fullName'),
            password: password
        };

        try {
            const response = await apiRequest('/api/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            currentUser = response.user;
            window.currentUser = response.user;
            updateUserUI();
            hideAuthModal();
            showNotification('Registration successful!', 'success');
        } catch (error) {
            showNotification('Registration failed: ' + error.message, 'error');
        }
    }

    async function logout() {
        try {
            await apiRequest('/api/logout', { method: 'POST' });
            currentUser = null;
            window.currentUser = null;
            updateUserUI();
            showNotification('Logged out successfully', 'success');
        } catch (error) {
            showNotification('Logout failed: ' + error.message, 'error');
        }
    }

    async function checkAuthStatus() {
        try {
            const response = await apiRequest('/api/user');
            currentUser = response;
            window.currentUser = response;
            updateUserUI();
            console.log('Auth check - user found:', window.currentUser);
        } catch (error) {
            // User not logged in
            currentUser = null;
            window.currentUser = null;
            updateUserUI();
            console.log('Auth check - no user logged in');
        }
    }

    function updateUserUI() {
        if (currentUser) {
            loginBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            
            const profileName = document.getElementById('profile-name');
            const profileImage = document.getElementById('profile-image');
            
            profileName.textContent = currentUser.fullName || currentUser.username;
            profileImage.src = currentUser.profileImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="30" r="20" fill="%234f46e5"/%3E%3Ccircle cx="50" cy="80" r="30" fill="%234f46e5"/%3E%3C/svg%3E';
            profileImage.alt = currentUser.username;
        } else {
            loginBtn.style.display = 'flex';
            userProfile.style.display = 'none';
        }
        
        // Make currentUser globally accessible
        window.currentUser = currentUser;
    }
    
    // Make currentUser globally accessible initially
    window.currentUser = currentUser;
    
    // Initialize upload photos button event listener
    setTimeout(() => {
        const uploadButton = document.getElementById('upload-photos-btn');
        const myPhotosButton = document.getElementById('my-photos-btn');
        
        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                console.log('Upload button clicked, currentUser:', window.currentUser);
                if (window.showUploadModal) {
                    window.showUploadModal();
                } else {
                    console.error('showUploadModal function not available');
                }
            });
        }
        
        if (myPhotosButton) {
            myPhotosButton.addEventListener('click', () => {
                if (window.showMyPhotos) {
                    window.showMyPhotos();
                }
            });
        }
    }, 100);
}

/*==================== PHOTO UPLOAD SYSTEM ====================*/
function initPhotoUpload() {
    const uploadModal = document.getElementById('upload-modal');
    const uploadClose = document.getElementById('upload-close');
    const uploadOverlay = document.getElementById('upload-overlay');
    const uploadForm = document.getElementById('photo-upload-form');
    const uploadArea = document.getElementById('upload-drop-area');
    const fileInput = document.getElementById('photo-files');
    const preview = document.getElementById('photo-preview');
    const cancelBtn = document.getElementById('cancel-upload');

    let selectedFiles = [];

    // Event listeners
    uploadClose?.addEventListener('click', hideUploadModal);
    uploadOverlay?.addEventListener('click', hideUploadModal);
    cancelBtn?.addEventListener('click', hideUploadModal);
    uploadForm?.addEventListener('submit', handlePhotoUpload);
    
    // File input events
    uploadArea?.addEventListener('click', () => fileInput.click());
    uploadArea?.addEventListener('dragover', handleDragOver);
    uploadArea?.addEventListener('drop', handleFileDrop);
    fileInput?.addEventListener('change', handleFileSelect);

    window.showUploadModal = function() {
        console.log('showUploadModal called, currentUser:', window.currentUser);
        if (!window.currentUser) {
            showNotification('Please login to upload photos', 'error');
            return;
        }
        if (uploadModal) {
            uploadModal.classList.add('show');
            console.log('Upload modal shown');
        } else {
            console.error('Upload modal element not found');
        }
    }

    function hideUploadModal() {
        if (uploadModal) {
            uploadModal.classList.remove('show');
        }
        selectedFiles = [];
        if (preview) {
            preview.innerHTML = '';
        }
        uploadForm?.reset();
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (uploadArea) {
            uploadArea.classList.add('dragover');
        }
    }

    function handleFileDrop(e) {
        e.preventDefault();
        if (uploadArea) {
            uploadArea.classList.remove('dragover');
        }
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
    }

    function processFiles(files) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const validFiles = files.filter(file => validTypes.includes(file.type));
        
        if (validFiles.length !== files.length) {
            showNotification('Some files were skipped. Only JPG, PNG, and GIF files are allowed.', 'warning');
        }
        
        selectedFiles.push(...validFiles);
        updatePreview();
    }

    function displayPreview(file) {
        if (!preview) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview__item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button type="button" class="preview__remove" onclick="removeFilePreview('${file.name}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    }

    window.removeFilePreview = function(fileName) {
        selectedFiles = selectedFiles.filter(f => f.name !== fileName);
        updatePreview();
    };

    function updatePreview() {
        if (!preview) return;
        preview.innerHTML = '';
        selectedFiles.forEach(file => displayPreview(file));
    }

    async function handlePhotoUpload(e) {
        e.preventDefault();
        
        if (selectedFiles.length === 0) {
            showNotification('Please select at least one photo', 'error');
            return;
        }

        const formData = new FormData(e.target);
        const category = formData.get('category');
        const title = formData.get('title');
        const description = formData.get('description');
        const privacy = formData.get('privacy');

        if (!category) {
            showNotification('Please select a category', 'error');
            return;
        }

        try {
            for (const file of selectedFiles) {
                const uploadData = new FormData();
                uploadData.append('photo', file);
                uploadData.append('category', category);
                uploadData.append('title', title || file.name);
                uploadData.append('description', description);
                uploadData.append('privacy', privacy);

                const response = await fetch('/api/photos/upload', {
                    method: 'POST',
                    body: uploadData,
                    credentials: 'include'
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || `HTTP ${response.status}`);
                }
            }

            showNotification(`${selectedFiles.length} photo(s) uploaded successfully!`, 'success');
            hideUploadModal();
            loadPortfolioPhotos(); // Refresh portfolio
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Upload failed: ' + error.message, 'error');
        }
    }

    // Make showUploadModal globally accessible
    window.showUploadModal = showUploadModal;
}

/*==================== MY PHOTOS MANAGEMENT ====================*/
function initMyPhotos() {
    // Create My Photos modal
    const myPhotosModal = document.createElement('div');
    myPhotosModal.className = 'upload__modal';
    myPhotosModal.id = 'my-photos-modal';
    myPhotosModal.innerHTML = `
        <div class="upload__overlay" id="my-photos-overlay"></div>
        <div class="upload__content">
            <div class="upload__header">
                <h2>My Photos</h2>
                <button class="upload__close" id="my-photos-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="upload__body">
                <div class="my-photos__grid" id="my-photos-grid">
                    <div class="loading">Loading photos...</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(myPhotosModal);

    const overlay = myPhotosModal.querySelector('#my-photos-overlay');
    const closeBtn = myPhotosModal.querySelector('#my-photos-close');
    const photosGrid = myPhotosModal.querySelector('#my-photos-grid');

    // Event listeners
    overlay?.addEventListener('click', hideMyPhotos);
    closeBtn?.addEventListener('click', hideMyPhotos);

    window.showMyPhotos = async function() {
        if (!window.currentUser) {
            showNotification('Please login to view your photos', 'error');
            return;
        }
        myPhotosModal.classList.add('show');
        await loadMyPhotos();
    };

    function hideMyPhotos() {
        myPhotosModal.classList.remove('show');
    }

    async function loadMyPhotos() {
        try {
            const photos = await apiRequest('/api/photos/my');
            displayMyPhotos(photos);
        } catch (error) {
            console.error('Failed to load my photos:', error);
            photosGrid.innerHTML = '<div class="error">Failed to load photos</div>';
        }
    }

    function displayMyPhotos(photos) {
        if (photos.length === 0) {
            photosGrid.innerHTML = '<div class="no-photos">You haven\'t uploaded any photos yet.</div>';
            return;
        }

        photosGrid.innerHTML = '';
        photos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.className = 'my-photo__item';
            photoItem.innerHTML = `
                <div class="my-photo__image">
                    <img src="${photo.url}" alt="${photo.title}" loading="lazy">
                </div>
                <div class="my-photo__info">
                    <h4>${photo.title}</h4>
                    <p class="category">${photo.category}</p>
                    <p class="privacy ${photo.isPrivate ? 'private' : 'public'}">${photo.isPrivate ? 'Private' : 'Public'}</p>
                    <p class="date">${new Date(photo.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="my-photo__actions">
                    <button class="delete-btn" onclick="deletePhoto(${photo.id})" title="Delete photo">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            photosGrid.appendChild(photoItem);
        });
    }

    window.deletePhoto = async function(photoId) {
        if (!confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
            return;
        }

        try {
            await apiRequest(`/api/photos/${photoId}`, {
                method: 'DELETE'
            });
            showNotification('Photo deleted successfully', 'success');
            await loadMyPhotos(); // Refresh the grid
            loadPortfolioPhotos(); // Refresh the main portfolio
        } catch (error) {
            console.error('Delete photo error:', error);
            showNotification('Failed to delete photo: ' + error.message, 'error');
        }
    };
}

/*==================== PORTFOLIO PHOTOS LOADING ====================*/
async function loadPortfolioPhotos() {
    try {
        const photos = await apiRequest('/api/photos');
        updatePortfolioDisplay(photos);
    } catch (error) {
        console.error('Failed to load photos:', error);
    }
}

function updatePortfolioDisplay(photos) {
    const portfolioContainer = document.querySelector('.portfolio__container');
    if (!portfolioContainer) return;

    if (photos.length === 0) {
        // Keep placeholder content if no photos
        return;
    }

    portfolioContainer.innerHTML = '';
    photos.forEach(photo => {
        const portfolioItem = document.createElement('article');
        portfolioItem.className = 'portfolio__item';
        portfolioItem.setAttribute('data-category', photo.category);
        portfolioItem.innerHTML = `
            <div class="portfolio__image">
                <img src="${photo.url}" alt="${photo.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--border-radius-lg);">
                <div class="portfolio__overlay">
                    <h3>${photo.category.charAt(0).toUpperCase() + photo.category.slice(1)} Photography</h3>
                    <p>${photo.title}</p>
                    <small>by ${photo.username}</small>
                </div>
            </div>
        `;
        portfolioContainer.appendChild(portfolioItem);
    });

    // Re-initialize portfolio filter for new items
    initPortfolioFilter();
}

/*==================== INITIALIZE ALL FUNCTIONALITY ====================*/
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    enhanceAccessibility();
    handleReducedMotion();
    initThemeToggle();
    initPortfolioFilter();
    initLanguageToggle();
    initAuth();
    initPhotoUpload();
    initMyPhotos();
    loadPortfolioPhotos();
    
    // Add loading class removal for smoother initial render
    document.body.classList.add('loaded');
});

/*==================== VIEWPORT META TAG ENHANCEMENT ====================*/
// Prevent zoom on double tap for better mobile experience
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;

/*==================== ERROR HANDLING ====================*/
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error reporting service
});

/*==================== SERVICE WORKER REGISTRATION (if needed) ====================*/
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you add a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}
