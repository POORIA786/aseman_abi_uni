
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    initializeAOS();
    initializeNavbar();
    initializeDarkMode();
    initializeScrollToTop();
    initializeCounters();
    initializeTooltips();
    initializeRippleEffect();
    initializeLazyLoad();
    initializeFormValidation();
    initializeSearchModal();
    initializeSmoothScroll();
    initializePreloader();

    function initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }
    }

    function initializeNavbar() {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (navbar) {

                if (scrollTop > navbarHeight) {
                    navbar.classList.add('navbar-sticky');

                    if (scrollTop > lastScrollTop && scrollTop > 300) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                } else {
                    navbar.classList.remove('navbar-sticky');
                }
            }
            lastScrollTop = scrollTop;
        });

        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            });
        });
    }

    function initializeScrollToTop() {

        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.className = 'scroll-to-top';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            z-index: 1049;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.display = 'block';
                setTimeout(() => {
                    scrollButton.style.opacity = '1';
                    scrollButton.style.transform = 'scale(1)';
                }, 10);
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    scrollButton.style.display = 'none';
                }, 300);
            }
        });

        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function initializeCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (counters.length > 0) {
            const observerOptions = {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            };
            const counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                        animateCounter(entry.target);
                        entry.target.classList.add('counted');
                    }
                });
            }, observerOptions);
            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        }
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000; // Animation duration in ms
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = formatNumber(target);
                    clearInterval(timer);
                } else {
                    element.textContent = formatNumber(Math.floor(current));
                }
            }, 16);
        }
        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    function initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    function initializeRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {

                const existingRipple = this.querySelector('.ripple');
                if (existingRipple) {
                    existingRipple.remove();
                }

                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    function initializeLazyLoad() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                        // Add fade in effect
                        img.addEventListener('load', function() {
                            img.classList.add('fade-in');
                        });
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {

            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    function initializeFormValidation() {
        const forms = document.querySelectorAll('.needs-validation');
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (form.checkValidity()) {

                    handleFormSubmit(form);
                }
                form.classList.add('was-validated');
            });

            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.value) {
                        this.classList.add('touched');
                    }
                });
                input.addEventListener('input', function() {
                    if (form.classList.contains('was-validated')) {
                        validateField(this);
                    }
                });
            });
        });
        function validateField(field) {
            if (field.checkValidity()) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            } else {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
            }
        }
        function handleFormSubmit(form) {

            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>در حال ارسال...';
            submitBtn.disabled = true;

            setTimeout(() => {

                form.reset();
                form.classList.remove('was-validated');

                showNotification('success', 'فرم با موفقیت ارسال شد!');

                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    }

    function initializeSearchModal() {
        const searchTriggers = document.querySelectorAll('[data-search-toggle]');
        if (searchTriggers.length > 0) {

            if (!document.getElementById('searchModal')) {
                createSearchModal();
            }
            const searchModal = document.getElementById('searchModal');
            const searchInput = searchModal.querySelector('#searchInput');
            const searchResults = searchModal.querySelector('#searchResults');

            searchTriggers.forEach(trigger => {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    searchModal.classList.add('show');
                    searchInput.focus();
                });
            });

            searchModal.querySelector('.close-search').addEventListener('click', function() {
                searchModal.classList.remove('show');
                searchInput.value = '';
                searchResults.innerHTML = '';
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && searchModal.classList.contains('show')) {
                    searchModal.classList.remove('show');
                }
            });

            searchInput.addEventListener('input', debounce(function() {
                const query = this.value.trim();
                if (query.length > 2) {
                    performSearch(query, searchResults);
                } else {
                    searchResults.innerHTML = '';
                }
            }, 300));
        }
        function createSearchModal() {
            const modalHTML = `
                <div id="searchModal" class="search-modal">
                    <div class="search-modal-content">
                        <button class="close-search">&times;</button>
                        <div class="search-form">
                            <input type="text" id="searchInput" placeholder="جستجو کنید..." autocomplete="off">
                            <i class="fas fa-search"></i>
                        </div>
                        <div id="searchResults" class="search-results"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        function performSearch(query, resultsContainer) {

            const mockResults = [
                { title: 'کارگاه آموزشی محیط زیست', url: 'calendar.html', category: 'رویداد' },
                { title: 'عضویت در بنیاد آسمان آبی', url: 'membership.html', category: 'عضویت' },
                { title: 'تیم مدیریت', url: 'team.html', category: 'درباره ما' }
            ];
            resultsContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div></div>';
            setTimeout(() => {
                const filteredResults = mockResults.filter(item => 
                    item.title.includes(query) || item.category.includes(query)
                );
                if (filteredResults.length > 0) {
                    resultsContainer.innerHTML = filteredResults.map(result => `
                        <a href="${result.url}" class="search-result-item">
                            <h6>${result.title}</h6>
                            <small class="text-muted">${result.category}</small>
                        </a>
                    `).join('');
                } else {
                    resultsContainer.innerHTML = '<p class="text-center text-muted">نتیجه‌ای یافت نشد</p>';
                }
            }, 500);
        }
    }

    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function initializePreloader() {

        if (!document.querySelector('.preloader')) {
            const preloaderHTML = `
                <div class="preloader">
                    <div class="preloader-inner">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">در حال بارگذاری...</span>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
        }
        const preloader = document.querySelector('.preloader');

        window.addEventListener('load', function() {
            setTimeout(() => {
                if (preloader) {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 300);
                }
            }, 500);
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
        `;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--info-color)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 1060;
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function getPersianDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('fa-IR', options);
    }

    function toPersianNumber(num) {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, x => persianNumbers[x]);
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;

        const installButton = document.getElementById('installPWA');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', function() {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });

if (typeof Swiper !== 'undefined') {

    const heroSlider = new Swiper('.hero-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            disabledClass: 'swiper-button-disabled',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,

        observer: true,
        observeParents: true,

        centeredSlides: true,
        grabCursor: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },

        on: {
            init: function () {
                console.log('Hero Slider initialized');

                this.navigation.update();
            },
            slideChange: function () {
                console.log('Slide changed to:', this.activeIndex);
            },
            reachEnd: function () {

                this.navigation.update();
            },
            reachBeginning: function () {

                this.navigation.update();
            }
        }
    });

    const articlesSlider = new Swiper('.articles-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.articles-slider .swiper-button-next',
            prevEl: '.articles-slider .swiper-button-prev',
        },
        pagination: {
            el: '.articles-slider .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
        observer: true,
        observeParents: true,
    });
}

    if (typeof L !== 'undefined' && document.getElementById('map')) {
        const map = L.map('map').setView([35.7219, 51.3347], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        const customIcon = L.divIcon({
            html: '<div style="background: #2196F3; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.3);"><i class="fas fa-leaf"></i></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        L.marker([35.7219, 51.3347], { icon: customIcon })
            .addTo(map)
            .bindPopup('<h6>بنیاد آسمان آبی</h6><p>دفتر مرکزی</p>')
            .openPopup();
    }

    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', pageLoadTime + 'ms');

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_timing', {
                        'value': pageLoadTime,
                        'event_category': 'performance'
                    });
                }
            }, 0);
        });
    }

    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);

    });
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);

    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.3s;
    }
    .search-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1060;
    }
    .search-modal.show {
        display: flex;
    }
    .search-modal-content {
        background: white;
        padding: 40px;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        position: relative;
    }
    .close-search {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 30px;
        background: none;
        border: none;
        cursor: pointer;
    }
    .search-form {
        position: relative;
        margin-bottom: 30px;
    }
    .search-form input {
        width: 100%;
        padding: 15px 50px 15px 20px;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        font-size: 18px;
    }
    .search-form i {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
    }
    .search-result-item {
        display: block;
        padding: 15px;
        border-bottom: 1px solid #e0e0e0;
        text-decoration: none;
        color: inherit;
        transition: background 0.3s;
    }
    .search-result-item:hover {
        background: #f8f9fa;
    }
`;
document.head.appendChild(style);