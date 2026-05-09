/* ===========================
   MRF Photography — script.js
   Single source of truth
   =========================== */

(function () {
    'use strict';

    /* ─────────────────────────────────────────
       PRELOADER
    ───────────────────────────────────────── */
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        setTimeout(function () {
            if (preloader) preloader.classList.add('hidden');
        }, 900);

        document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
            if (!img.complete) {
                img.addEventListener('load', function () { img.classList.add('loaded'); });
            }
        });
    });

    /* ─────────────────────────────────────────
       THEME TOGGLE — smooth crossfade flash
    ───────────────────────────────────────── */
    var themeToggle = document.getElementById('theme-toggle');
    var body        = document.body;

    var flashEl = document.createElement('div');
    flashEl.id  = 'theme-flash';
    body.appendChild(flashEl);

    function switchTheme() {
        var next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.classList.add('theme-transitioning');
        flashEl.style.background = next === 'dark'
            ? 'rgba(12,12,12,0.35)' : 'rgba(250,250,248,0.35)';
        flashEl.classList.add('active');
        setTimeout(function () {
            body.setAttribute('data-theme', next);
            localStorage.setItem('mrf-theme', next);
            flashEl.classList.remove('active');
        }, 120);
        setTimeout(function () { body.classList.remove('theme-transitioning'); }, 700);
    }

    if (themeToggle) themeToggle.addEventListener('click', switchTheme);

    /* ─────────────────────────────────────────
       NAVIGATION — scroll shadow + mobile drawer
    ───────────────────────────────────────── */
    var nav       = document.getElementById('nav');
    var navToggle = document.getElementById('nav-toggle');
    var navMenu   = document.getElementById('nav-menu');

    window.addEventListener('scroll', function () {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('.nav-link, .btn-nav').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    /* ─────────────────────────────────────────
       ACTIVE NAV LINK ON SCROLL
    ───────────────────────────────────────── */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', function () {
        var scrollY  = window.pageYOffset + 130;
        var current  = '';
        sections.forEach(function (sec) {
            if (scrollY >= sec.offsetTop) current = sec.getAttribute('id');
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, { passive: true });

    /* ─────────────────────────────────────────
       HERO SLIDER — auto-advance with pause on interact
    ───────────────────────────────────────── */
    var slides        = document.querySelectorAll('.hero-slide');
    var dotsContainer = document.querySelector('.slider-dots');
    var currentSlide  = 0;
    var slideInterval;

    if (slides.length && dotsContainer) {
        slides.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', function () { pauseAndGo(i); });
            dotsContainer.appendChild(dot);
        });

        function goToSlide(i) {
            slides[currentSlide].classList.remove('active');
            dotsContainer.querySelectorAll('.slider-dot')[currentSlide].classList.remove('active');
            currentSlide = i;
            slides[currentSlide].classList.add('active');
            dotsContainer.querySelectorAll('.slider-dot')[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
        function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

        function pauseAndGo(i) {
            clearInterval(slideInterval);
            goToSlide(i);
            slideInterval = setInterval(nextSlide, 5500);
        }

        var prevBtn = document.querySelector('.slider-btn.prev');
        var nextBtn = document.querySelector('.slider-btn.next');
        if (prevBtn) prevBtn.addEventListener('click', function () { pauseAndGo((currentSlide - 1 + slides.length) % slides.length); });
        if (nextBtn) nextBtn.addEventListener('click', function () { pauseAndGo((currentSlide + 1) % slides.length); });

        slideInterval = setInterval(nextSlide, 5500);
    }

    /* ─────────────────────────────────────────
       EXPERIENCE DRUM ODOMETER
    ───────────────────────────────────────── */
    (function () {
        var entries = [
            { year: '2015', title: 'Studio Launch',    sub: 'Founded MRF Photography, Dhaka' },
            { year: '2018', title: 'Nat. Geographic',  sub: 'First international editorial feature' },
            { year: '2020', title: 'First Book',       sub: 'Published visual narrative collection' },
            { year: '2022', title: 'Photo Award',      sub: 'Best Wedding Photographer — BD' },
            { year: '2024', title: 'Vogue Feature',    sub: 'Editorial spread — Asia edition' }
        ];

        var current  = 0;
        var spinning = false;
        var autoTimer;

        var drumFace    = document.getElementById('exp-drum-face');
        var drumEntries = document.getElementById('exp-drum-entries');
        var drumFill    = document.getElementById('exp-drum-fill');
        var drumCounter = document.getElementById('exp-drum-counter');
        var prevBtn     = document.getElementById('exp-drum-prev');
        var nextBtn     = document.getElementById('exp-drum-next');
        if (!drumFace || !drumEntries) return;

        var TEETH = 28;
        for (var t = 0; t < TEETH; t++) {
            var tooth = document.createElement('div');
            tooth.className = 'exp-tooth';
            tooth.style.transform = 'rotateX(' + (t * (360 / TEETH)) + 'deg) translateZ(52px)';
            drumFace.appendChild(tooth);
        }

        entries.forEach(function (e, i) {
            var el = document.createElement('div');
            el.className = 'exp-panel-entry' + (i === 0 ? ' active' : '');
            el.innerHTML =
                '<span class="exp-panel-year">'  + e.year  + '</span>' +
                '<span class="exp-panel-title">' + e.title + '</span>' +
                '<span class="exp-panel-sub">'   + e.sub   + '</span>';
            drumEntries.appendChild(el);
        });

        var panelEls     = drumEntries.querySelectorAll('.exp-panel-entry');
        var currentAngle = 0;
        var degsPerStep  = 360 / TEETH * 2;

        function goTo(index, direction) {
            if (spinning) return;
            spinning = true;
            currentAngle -= (direction === 'next' ? 1 : -1) * degsPerStep;
            drumFace.style.transform = 'rotateX(' + currentAngle + 'deg)';
            panelEls[current].classList.add(direction === 'next' ? 'exit-up' : 'exit-down');
            current = index;
            setTimeout(function () {
                panelEls.forEach(function (el) { el.classList.remove('active', 'exit-up', 'exit-down'); });
                panelEls[current].classList.add('active');
                if (drumFill) drumFill.style.width = (current / (entries.length - 1) * 100) + '%';
                if (drumCounter) drumCounter.textContent = (current + 1) + ' / ' + entries.length;
                spinning = false;
            }, 420);
        }

        function advance(dir) {
            goTo(dir === 'next'
                ? (current + 1) % entries.length
                : (current - 1 + entries.length) % entries.length, dir);
        }

        function startAuto() { autoTimer = setInterval(function () { advance('next'); }, 2800); }

        if (prevBtn) prevBtn.addEventListener('click', function () { clearInterval(autoTimer); advance('prev'); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { clearInterval(autoTimer); advance('next'); startAuto(); });

        if (drumFill) drumFill.style.width = '0%';
        if (drumCounter) drumCounter.textContent = '1 / ' + entries.length;
        startAuto();
    })();

    /* ─────────────────────────────────────────
       REVEAL ANIMATIONS — IntersectionObserver
    ───────────────────────────────────────── */
    var REVEAL_CLASSES = ['reveal-up', 'reveal-fade', 'reveal-left', 'reveal-right', 'reveal-scale', 'reveal-line'];

    document.querySelectorAll('.stagger-children').forEach(function (parent) {
        Array.from(parent.children).forEach(function (child, i) {
            var hasReveal = REVEAL_CLASSES.some(function (c) { return child.classList.contains(c); });
            if (!hasReveal) child.classList.add('reveal-scale');
            var existing = parseFloat(child.style.transitionDelay || '0');
            child.style.transitionDelay = (existing + i * 0.1) + 's';
        });
    });

    var revealEls = document.querySelectorAll(
        '.reveal-up,.reveal-fade,.reveal-left,.reveal-right,.reveal-scale,.reveal-line'
    );

    if ('IntersectionObserver' in window) {
        var motionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var dataDelay = el.getAttribute('data-delay');
                if (dataDelay && !el.style.transitionDelay) {
                    el.style.transitionDelay = (parseInt(dataDelay, 10) / 1000) + 's';
                }
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () { el.classList.add('revealed'); });
                });
                motionObserver.unobserve(el);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { motionObserver.observe(el); });

        setTimeout(function () {
            revealEls.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('revealed');
                    motionObserver.unobserve(el);
                }
            });
        }, 100);
    } else {
        revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ─────────────────────────────────────────
       PARALLAX — hero bg + portfolio micro
    ───────────────────────────────────────── */
    var heroImageEl = document.querySelector('.hero-image');
    var parallaxTick = false;

    window.addEventListener('scroll', function () {
        if (parallaxTick) return;
        parallaxTick = true;
        requestAnimationFrame(function () {
            var scrollY = window.pageYOffset;
            var vH      = window.innerHeight;

            if (heroImageEl && scrollY < vH) {
                heroImageEl.style.transform = 'scale(1.08) translateY(' + (scrollY * 0.25) + 'px)';
            }

            document.querySelectorAll('.portfolio-item img').forEach(function (img) {
                var rect = img.closest('.portfolio-item').getBoundingClientRect();
                if (rect.top < vH && rect.bottom > 0) {
                    var p = (vH - rect.top) / (vH + rect.height);
                    img.style.transform = 'scale(1.08) translateY(' + ((p - 0.5) * 18) + 'px)';
                }
            });

            parallaxTick = false;
        });
    }, { passive: true });

    /* ─────────────────────────────────────────
       PORTFOLIO FILTER + LIGHTBOX
    ───────────────────────────────────────── */
    var filterBtns     = document.querySelectorAll('.filter-btn');
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    var lightbox       = document.getElementById('lightbox');
    var lightboxImg    = document.getElementById('lightbox-img');
    var lightboxTitle  = document.getElementById('lightbox-title');
    var lightboxCat    = document.getElementById('lightbox-category');
    var lightboxItems  = [];
    var lightboxIndex  = 0;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter  = btn.getAttribute('data-filter');
            var visible = 0;

            portfolioItems.forEach(function (item) {
                var show = filter === 'all' || item.getAttribute('data-category') === filter;
                if (show) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.94)';
                    var delay = visible * 40;
                    visible++;
                    setTimeout(function () {
                        item.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)';
                        item.style.opacity    = '1';
                        item.style.transform  = 'scale(1)';
                    }, delay);
                } else {
                    item.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
                    item.style.opacity    = '0';
                    item.style.transform  = 'scale(0.94)';
                    setTimeout(function () { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    portfolioItems.forEach(function (item) {
        item.addEventListener('touchend', function (e) {
            if (item.classList.contains('tapped')) return;
            e.preventDefault();
            document.querySelectorAll('.portfolio-item.tapped').forEach(function (el) { el.classList.remove('tapped'); });
            item.classList.add('tapped');
        });
    });
    document.addEventListener('touchstart', function (e) {
        if (!e.target.closest('.portfolio-item')) {
            document.querySelectorAll('.portfolio-item.tapped').forEach(function (el) { el.classList.remove('tapped'); });
        }
    }, { passive: true });

    portfolioItems.forEach(function (item) {
        item.addEventListener('click', function () {
            lightboxItems = Array.from(document.querySelectorAll('.portfolio-item:not([style*="display: none"])'));
            if (!lightboxItems.length) lightboxItems = Array.from(portfolioItems);
            lightboxIndex = lightboxItems.indexOf(item);
            openLightbox(lightboxIndex);
        });
    });

    function openLightbox(i) {
        if (!lightbox || !lightboxItems[i]) return;
        var item  = lightboxItems[i];
        var img   = item.querySelector('img');
        var title = item.querySelector('h4');
        var cat   = item.querySelector('.portfolio-category');
        lightboxImg.src = img ? img.src : '';
        lightboxImg.alt = img ? img.alt : '';
        if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : '';
        if (lightboxCat)   lightboxCat.textContent   = cat   ? cat.textContent   : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    var lbClose = document.querySelector('.lightbox-close');
    var lbPrev  = document.querySelector('.lightbox-nav.prev');
    var lbNext  = document.querySelector('.lightbox-nav.next');

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', function () { lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length; openLightbox(lightboxIndex); });
    if (lbNext)  lbNext.addEventListener('click', function () { lightboxIndex = (lightboxIndex + 1) % lightboxItems.length; openLightbox(lightboxIndex); });
    if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft'  && lbPrev) lbPrev.click();
        if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    });

    /* ─────────────────────────────────────────
       TESTIMONIALS SLIDER — auto with pause
    ───────────────────────────────────────── */
    var testimonialTrack         = document.querySelector('.testimonial-track');
    var testimonialCards         = document.querySelectorAll('.testimonial-card');
    var testimonialDotsContainer = document.querySelector('.testimonial-dots');
    var currentTestimonial       = 0;
    var testimonialTimer;

    if (testimonialTrack && testimonialCards.length) {
        testimonialCards.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
            dot.addEventListener('click', function () { pauseTestimonial(); goToTestimonial(i); resumeTestimonial(); });
            if (testimonialDotsContainer) testimonialDotsContainer.appendChild(dot);
        });

        function goToTestimonial(i) {
            currentTestimonial = i;
            testimonialTrack.style.transform = 'translateX(-' + (i * 100) + '%)';
            document.querySelectorAll('.testimonial-dot').forEach(function (d, idx) {
                d.classList.toggle('active', idx === i);
            });
        }

        function pauseTestimonial()  { clearInterval(testimonialTimer); }
        function resumeTestimonial() { testimonialTimer = setInterval(function () { goToTestimonial((currentTestimonial + 1) % testimonialCards.length); }, 6000); }

        var tPrev = document.querySelector('.testimonial-btn.prev');
        var tNext = document.querySelector('.testimonial-btn.next');
        if (tPrev) tPrev.addEventListener('click', function () { pauseTestimonial(); goToTestimonial((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length); resumeTestimonial(); });
        if (tNext) tNext.addEventListener('click', function () { pauseTestimonial(); goToTestimonial((currentTestimonial + 1) % testimonialCards.length); resumeTestimonial(); });

        resumeTestimonial();
    }

    /* ─────────────────────────────────────────
       BOOKING MODAL
    ───────────────────────────────────────── */
    var bookingModal      = document.getElementById('booking-modal');
    var selectedServiceEl = document.getElementById('selected-service');
    var modalClose        = document.querySelector('.modal-close');

    document.querySelectorAll('.book-service').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (selectedServiceEl) selectedServiceEl.textContent = btn.getAttribute('data-service') || 'Photography Session';
            if (bookingModal) { bookingModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
        });
    });

    if (modalClose) modalClose.addEventListener('click', function () {
        if (bookingModal) bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    if (bookingModal) bookingModal.addEventListener('click', function (e) {
        if (e.target === bookingModal) { bookingModal.classList.remove('active'); document.body.style.overflow = ''; }
    });

    /* ─────────────────────────────────────────
       CONTACT FORM — full validation
    ───────────────────────────────────────── */
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        var submitBtn    = contactForm.querySelector('.contact-submit');
        var successEl    = document.getElementById('form-success');
        var errorEl      = document.getElementById('form-error');
        var nameInput    = document.getElementById('name');
        var emailInput   = document.getElementById('email');
        var messageInput = document.getElementById('message');

        function validateField(input) {
            var valid = input.checkValidity() && input.value.trim() !== '';
            input.classList.toggle('invalid', !valid && input.value.length > 0);
            return valid;
        }

        [nameInput, emailInput, messageInput].forEach(function (inp) {
            if (!inp) return;
            inp.addEventListener('blur',  function () { validateField(inp); });
            inp.addEventListener('input', function () { if (inp.classList.contains('invalid')) validateField(inp); });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameOk  = validateField(nameInput);
            var emailOk = validateField(emailInput);
            var msgOk   = validateField(messageInput);

            if (!nameOk || !emailOk || !msgOk) {
                [nameInput, emailInput, messageInput].forEach(function (inp) {
                    if (inp && !validateField(inp)) {
                        inp.classList.add('invalid');
                        inp.style.animation = 'shake 0.4s ease';
                        setTimeout(function () { inp.style.animation = ''; }, 400);
                    }
                });
                return;
            }

            submitBtn.classList.add('loading');
            if (successEl) successEl.classList.remove('visible');
            if (errorEl)   errorEl.classList.remove('visible');

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                if (successEl) successEl.classList.add('visible');
                contactForm.reset();
                [nameInput, emailInput, messageInput].forEach(function (inp) {
                    if (inp) inp.classList.remove('invalid');
                });
            }, 1800);
        });
    }

    /* ─────────────────────────────────────────
       VIEW FULL GALLERY BUTTON
    ───────────────────────────────────────── */
    var galleryBtn = document.getElementById('portfolio-gallery-btn');
    if (galleryBtn) {
        galleryBtn.addEventListener('click', function () {
            // Reset filter to All
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            var allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            portfolioItems.forEach(function (item) {
                item.style.display = '';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });
            // Collect all visible items and open lightbox from first
            lightboxItems = Array.from(portfolioItems);
            lightboxIndex = 0;
            openLightbox(0);
        });
    }

    /* ─────────────────────────────────────────
       SMOOTH SCROLL
    ───────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ─────────────────────────────────────────
       CARD 3D TILT — portfolio + style cards
    ───────────────────────────────────────── */
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.card-3d').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width  - 0.5;
                var y = (e.clientY - r.top)  / r.height - 0.5;
                card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
                card.style.transform  = 'perspective(700px) rotateX(' + (-y * 9) + 'deg) rotateY(' + (x * 9) + 'deg) scale(1.03)';
                card.style.boxShadow  = '0 20px 50px rgba(0,0,0,0.15)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1), box-shadow 0.6s ease';
                card.style.transform  = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
                card.style.boxShadow  = '';
            });
        });
    }

    /* ─────────────────────────────────────────
       MAGNETIC BUTTONS — hero CTAs
    ───────────────────────────────────────── */
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var x = (e.clientX - r.left - r.width  / 2) * 0.3;
                var y = (e.clientY - r.top  - r.height / 2) * 0.3;
                btn.style.transition = 'transform 0.1s ease';
                btn.style.transform  = 'translate(' + x + 'px, ' + y + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
                btn.style.transform  = 'translate(0, 0)';
            });
        });
    }

    /* ─────────────────────────────────────────
       STATS COUNTER — animated count-up
    ───────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
        var statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el      = entry.target;
                var raw     = el.textContent.replace(/[^0-9]/g, '');
                var target  = parseInt(raw, 10);
                var hasPlus = el.textContent.includes('+');
                if (!target) return;

                var startTime = null;
                var duration  = 1400;

                function step(ts) {
                    if (!startTime) startTime = ts;
                    var p     = Math.min((ts - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(eased * target) + (hasPlus ? '+' : '');
                    if (p < 1) requestAnimationFrame(step);
                }

                requestAnimationFrame(step);
                statsObserver.unobserve(el);
            });
        }, { threshold: 0.6 });

        document.querySelectorAll('.stat-number').forEach(function (el) {
            statsObserver.observe(el);
        });
    }

})();
