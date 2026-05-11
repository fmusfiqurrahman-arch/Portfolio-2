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

    function switchTheme() {
        var next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.classList.add('theme-transitioning');
        body.setAttribute('data-theme', next);
        localStorage.setItem('mrf-theme', next);
        setTimeout(function () { body.classList.remove('theme-transitioning'); }, 250);
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
       SCROLL DIRECTION TRACKER
    ───────────────────────────────────────── */
    var lastScrollY = window.pageYOffset;
    var scrollDir   = 'down';
    window.addEventListener('scroll', function () {
        var y = window.pageYOffset;
        if (y !== lastScrollY) { scrollDir = y > lastScrollY ? 'down' : 'up'; }
        lastScrollY = y;
    }, { passive: true });

    /* ─────────────────────────────────────────
       BIDIRECTIONAL SCROLL REVEAL (style + packages)
       Each section gets its own observer so stagger
       indices are local to that section, not global.
    ───────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
        function makeBidiObserver(cards) {
            var n = cards.length;
            cards.forEach(function (c) { c.classList.add('from-bottom'); });

            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var el  = entry.target;
                    var idx = cards.indexOf(el);

                    if (entry.isIntersecting) {
                        var fromClass  = scrollDir === 'up' ? 'from-top' : 'from-bottom';
                        var staggerIdx = scrollDir === 'up' ? (n - 1 - idx) : idx;

                        el.classList.remove('from-top', 'from-bottom');
                        el.classList.add(fromClass);
                        el.style.transitionDelay = (staggerIdx * 0.12) + 's';

                        requestAnimationFrame(function () {
                            requestAnimationFrame(function () { el.classList.add('revealed'); });
                        });
                    } else if (el.classList.contains('revealed')) {
                        /* Only reset after the card has been shown at least once.
                           Skipping this on initial observation prevents the observer's
                           first-fire from corrupting the starting position. */
                        el.style.transitionDelay = '0s';
                        el.style.transition = 'none';          /* snap out instantly — no visible exit flash */
                        el.classList.remove('revealed');
                        var exitedTop = entry.boundingClientRect.top < 0;
                        el.classList.remove('from-top', 'from-bottom');
                        el.classList.add(exitedTop ? 'from-bottom' : 'from-top');
                        requestAnimationFrame(function () {
                            el.style.transition = '';           /* restore class-driven transition */
                        });
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(function (c) { obs.observe(c); });
        }

        makeBidiObserver(Array.from(document.querySelectorAll('.style-section .pkg-reveal')));
        makeBidiObserver(Array.from(document.querySelectorAll('.packages .pkg-reveal')));
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
            var albumId  = item.getAttribute('data-album-id');
            var category = item.getAttribute('data-category');
            var album    = PORTFOLIO_ALBUMS.find(function (a) { return a.id === albumId; });
            var folder   = GALLERY_DATA.find(function (f) { return f.id === category; });
            if (!album || !folder) return;
            if (!gFoldersBuilt) { gBuildFolders(); gFoldersBuilt = true; }
            gModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            /* Open gallery filtered to just this album's photos */
            gOpenFolder({ id: album.id, label: album.title, photos: album.images });
        });
    });

    /* ─────────────────────────────────────────
       PORTFOLIO THUMBNAIL ROTATION
       Each grid item cycles through its album's
       images randomly so the grid feels alive.
    ───────────────────────────────────────── */
    function startPortfolioRotation() {
        var FADE_MS    = 1400;   /* fade-out + fade-in duration */
        var HOLD_MIN   = 6000;   /* minimum time each image is held */
        var HOLD_RANGE = 4000;   /* adds 0–4 s of extra random hold */

        portfolioItems.forEach(function (item) {
            var albumId = item.getAttribute('data-album-id');
            if (!albumId) return;
            var album = PORTFOLIO_ALBUMS.find(function (a) { return a.id === albumId; });
            if (!album || album.images.length < 2) return;

            var img = item.querySelector('img');
            var idx = 0;

            img.style.transition = 'opacity ' + (FADE_MS / 1000) + 's ease-in-out, ' +
                                   'filter 0.6s ease, transform 0.7s cubic-bezier(0.4,0,0.2,1)';

            function swapNext() {
                idx = (idx + 1) % album.images.length;

                /* fade out */
                img.style.opacity = '0';

                /* swap src after fade completes, then fade back in */
                setTimeout(function () {
                    img.src = album.images[idx].thumb;
                    img.onload = function () { img.style.opacity = '1'; };
                    if (img.complete) img.style.opacity = '1';
                }, FADE_MS);

                /* schedule the next swap */
                setTimeout(swapNext, FADE_MS + HOLD_MIN + Math.floor(Math.random() * HOLD_RANGE));
            }

            /* stagger each item's first swap so they don't all fire together */
            var firstDelay = HOLD_MIN + Math.floor(Math.random() * HOLD_RANGE);
            setTimeout(swapNext, firstDelay);
        });
    }

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

            var service       = document.getElementById('selected-service');
            var formspreeUrl  = window.MRF_CMS && window.MRF_CMS.data && window.MRF_CMS.data.formspreeUrl;
            var apiUrl        = formspreeUrl || ((window.MRF_API_URL || '') + '/api/contact');
            var payload       = {
                name:    nameInput.value.trim(),
                email:   emailInput.value.trim(),
                message: messageInput.value.trim(),
                service: service ? service.textContent : ''
            };

            fetch(apiUrl, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body:    JSON.stringify(payload)
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                submitBtn.classList.remove('loading');
                /* Formspree returns {ok:true}, backend returns {success:true} */
                if (data.ok || data.success) {
                    if (successEl) successEl.classList.add('visible');
                    contactForm.reset();
                    [nameInput, emailInput, messageInput].forEach(function (inp) {
                        if (inp) inp.classList.remove('invalid');
                    });
                } else {
                    if (errorEl) {
                        var errSpan = errorEl.querySelector('span');
                        if (errSpan) errSpan.textContent = (data.errors && data.errors[0] && data.errors[0].message) || data.message || 'Something went wrong.';
                        errorEl.classList.add('visible');
                    }
                }
            })
            .catch(function () {
                submitBtn.classList.remove('loading');
                if (errorEl) errorEl.classList.add('visible');
            });
        });
    }

    /* ─────────────────────────────────────────
       FULL GALLERY — Folders → Photos → Viewer
       PORTFOLIO_ALBUMS is the single source of
       truth. GALLERY_DATA is built from it so
       the gallery folders always stay in sync.
    ───────────────────────────────────────── */
    var PORTFOLIO_ALBUMS = (window.MRF_CMS && window.MRF_CMS.data && window.MRF_CMS.data.portfolioAlbums) || [
        /* ── Weddings ─────────────────────── */
        { id: 'elegant-wedding',    category: 'wedding',    title: 'Elegant Wedding',
          images: [
            { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', title: 'First Look' },
            { src: 'https://images.unsplash.com/photo-1606216794079-c8f53a0f7b9e?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1606216794079-c8f53a0f7b9e?w=400&q=80', title: 'Ceremony' },
            { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80', title: 'Vows' },
            { src: 'https://images.unsplash.com/photo-1511285560929-80b456503681?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1511285560929-80b456503681?w=400&q=80', title: 'First Dance' }
          ]
        },
        { id: 'romantic-ceremony',  category: 'wedding',    title: 'Romantic Ceremony',
          images: [
            { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80', title: 'Together' },
            { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80', title: 'Cinematic Moment' },
            { src: 'https://images.unsplash.com/photo-1520854221256-17538702c0cc?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1520854221256-17538702c0cc?w=400&q=80', title: 'Detail Shots' },
            { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', title: 'The Walk' }
          ]
        },
        { id: 'destination-wedding', category: 'wedding',   title: 'Destination Wedding',
          images: [
            { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80', title: 'Outdoor Ceremony' },
            { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80', title: 'Bride' },
            { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80', title: 'Golden Hour' },
            { src: 'https://images.unsplash.com/photo-1606216794079-c8f53a0f7b9e?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1606216794079-c8f53a0f7b9e?w=400&q=80', title: 'Vows' }
          ]
        },
        /* ── Portraits ─────────────────────── */
        { id: 'creative-portrait',  category: 'portrait',   title: 'Creative Portrait',
          images: [
            { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', title: 'Natural Light' },
            { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', title: 'Candid' },
            { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', title: 'Lifestyle' },
            { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', title: 'Portrait' }
          ]
        },
        { id: 'personal-branding',  category: 'portrait',   title: 'Personal Branding',
          images: [
            { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', title: 'Professional' },
            { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', title: 'Headshot' },
            { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', title: 'Studio' },
            { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', title: 'Casual' }
          ]
        },
        { id: 'executive-portrait', category: 'portrait',   title: 'Executive Portrait',
          images: [
            { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', title: 'Executive' },
            { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', title: 'Corporate' },
            { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', title: 'Director' },
            { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', title: 'Leadership' }
          ]
        },
        /* ── Editorial ─────────────────────── */
        { id: 'fashion-editorial',  category: 'editorial',  title: 'Fashion Editorial',
          images: [
            { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', title: 'Editorial' },
            { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80', title: 'Runway' },
            { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', title: 'High Fashion' },
            { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80', title: 'Portrait' }
          ]
        },
        { id: 'magazine-editorial', category: 'editorial',  title: 'Magazine Editorial',
          images: [
            { src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80', title: 'Magazine' },
            { src: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80', title: 'Couture' },
            { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', title: 'Spread' },
            { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80', title: 'Cover Story' }
          ]
        },
        /* ── Commercial ────────────────────── */
        { id: 'brand-campaign',     category: 'commercial', title: 'Brand Campaign',
          images: [
            { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80', title: 'Brand Campaign' },
            { src: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&q=80', title: 'Product' },
            { src: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80', title: 'Corporate' },
            { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', title: 'Retail' },
            { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=90', thumb: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80', title: 'Team' }
          ]
        }
    ];

    /* Build gallery category folders by aggregating all albums per category */
    var GALLERY_CAT_META = {
        wedding:    { label: 'Weddings'   },
        portrait:   { label: 'Portraits'  },
        editorial:  { label: 'Editorial'  },
        commercial: { label: 'Commercial' }
    };
    var GALLERY_DATA = ['wedding', 'portrait', 'editorial', 'commercial'].map(function (catId) {
        var albums = PORTFOLIO_ALBUMS.filter(function (a) { return a.category === catId; });
        var photos = [];
        albums.forEach(function (a) { photos = photos.concat(a.images); });
        return {
            id:     catId,
            label:  GALLERY_CAT_META[catId].label,
            cover:  photos.length ? photos[0].thumb : '',
            photos: photos
        };
    });

    /* ── All: every photo from every album ── */
    var allPhotos = [];
    PORTFOLIO_ALBUMS.forEach(function (a) { allPhotos = allPhotos.concat(a.images); });
    GALLERY_DATA.unshift({ id: 'all', label: 'All', cover: allPhotos[0] ? allPhotos[0].thumb : '', photos: allPhotos });

    /* ── Favorites: admin-curated, stored in CMS ── */
    var cmsData       = window.MRF_CMS && window.MRF_CMS.data;
    var favPhotos     = (cmsData && Array.isArray(cmsData.favorites)) ? cmsData.favorites : [];
    var favoritesFolder = { id: 'favorites', label: 'Favorites', cover: favPhotos[0] ? favPhotos[0].thumb : '', photos: favPhotos };
    GALLERY_DATA.push(favoritesFolder);

    /* ── Favorites helpers ── */
    var IS_ADMIN = localStorage.getItem('mrf_admin') === '1';

    function isFav(photo) {
        return favoritesFolder.photos.some(function (f) { return f.src === photo.src; });
    }

    function toggleFav(photo, btn) {
        var idx = favoritesFolder.photos.findIndex(function (f) { return f.src === photo.src; });
        if (idx > -1) {
            favoritesFolder.photos.splice(idx, 1);
            btn.classList.remove('fav-active');
            btn.setAttribute('aria-label', 'Add to favorites');
        } else {
            favoritesFolder.photos.push({ src: photo.src, thumb: photo.thumb, title: photo.title });
            btn.classList.add('fav-active');
            btn.setAttribute('aria-label', 'Remove from favorites');
        }
        favoritesFolder.cover = favoritesFolder.photos[0] ? favoritesFolder.photos[0].thumb : '';
        if (cmsData) {
            cmsData.favorites = favoritesFolder.photos;
            window.MRF_CMS.save(cmsData);
        }
        /* Update folder card count live */
        var favCard = gFoldersView ? gFoldersView.querySelector('[data-folder-id="favorites"]') : null;
        if (favCard) {
            var countEl = favCard.querySelector('.gallery-folder-count');
            if (countEl) countEl.textContent = favoritesFolder.photos.length + ' photos';
            var imgEl = favCard.querySelector('img');
            if (imgEl && favoritesFolder.cover) imgEl.src = favoritesFolder.cover;
        }
    }

    startPortfolioRotation();

    var gModal         = document.getElementById('gallery-modal');
    var gFoldersView   = document.getElementById('gallery-folders-view');
    var gPhotosView    = document.getElementById('gallery-photos-view');
    var gBackBtn       = document.getElementById('gallery-back-btn');
    var gBackLabel     = document.getElementById('gallery-back-label');
    var gCloseBtn      = document.getElementById('gallery-close-btn');
    var gTitle         = document.getElementById('gallery-modal-title');
    var gViewer        = document.getElementById('gallery-viewer');
    var gViewerImg     = document.getElementById('gallery-viewer-img');
    var gViewerTitle   = document.getElementById('gallery-viewer-title');
    var gViewerCounter = document.getElementById('gallery-viewer-counter');
    var gViewerPrev    = document.getElementById('gallery-viewer-prev');
    var gViewerNext    = document.getElementById('gallery-viewer-next');
    var gViewerBack    = document.getElementById('gallery-viewer-back-btn');
    var gViewerClose   = document.getElementById('gallery-viewer-close-btn');

    var gCurrentFolder = null;
    var gCurrentIdx    = 0;
    var gFoldersBuilt  = false;

    function gOpenModal() {
        if (!gFoldersBuilt) { gBuildFolders(); gFoldersBuilt = true; }
        gShowFolders();
        gModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function gCloseModal() {
        gViewer.classList.remove('active');
        gModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function gShowFolders() {
        gPhotosView.classList.add('gallery-view--hidden');
        gFoldersView.classList.remove('gallery-view--hidden');
        gFoldersView.scrollTop = 0;
        if (gBackLabel) gBackLabel.textContent = 'Back to Page';
        gBackBtn.onclick = gCloseModal;
        gBackBtn.classList.remove('gallery-view--hidden');
        gTitle.textContent = 'Gallery';
        gCurrentFolder = null;
    }

    function gBuildFolders() {
        GALLERY_DATA.forEach(function (folder) {
            var card = document.createElement('div');
            card.className = 'gallery-folder-card';
            card.setAttribute('data-folder-id', folder.id);
            if (folder.id === 'favorites') card.classList.add('gallery-folder-favorites');
            if (folder.id === 'all')       card.classList.add('gallery-folder-all');
            var coverSrc = folder.cover || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
            card.innerHTML =
                '<img src="' + coverSrc + '" alt="' + folder.label + '" loading="lazy">' +
                '<div class="gallery-folder-overlay">' +
                    '<h3 class="gallery-folder-label">' + folder.label + '</h3>' +
                    '<span class="gallery-folder-count">' + folder.photos.length + ' photos</span>' +
                '</div>';
            card.addEventListener('click', function () { gOpenFolder(folder); });
            gFoldersView.appendChild(card);
        });
    }

    function gOpenFolder(folder) {
        gCurrentFolder = folder;
        gTitle.textContent = folder.label;
        if (gBackLabel) gBackLabel.textContent = 'All Folders';
        gBackBtn.onclick = gShowFolders;
        gBackBtn.classList.remove('gallery-view--hidden');
        gFoldersView.classList.add('gallery-view--hidden');
        gPhotosView.classList.remove('gallery-view--hidden');
        gPhotosView.scrollTop = 0;
        gBuildPhotos(folder);
    }

    function gBuildPhotos(folder) {
        gPhotosView.innerHTML = '';

        if (folder.photos.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'gallery-empty-state';
            empty.innerHTML =
                '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
                '<p>No favorites yet.</p>' +
                (IS_ADMIN ? '<span>Hover any photo and tap the heart to add it here.</span>' : '');
            gPhotosView.appendChild(empty);
            return;
        }

        folder.photos.forEach(function (photo, i) {
            var item = document.createElement('div');
            item.className = 'gallery-photo-item';
            var favd = isFav(photo);
            var heartHtml = IS_ADMIN
                ? '<button class="gallery-heart-btn' + (favd ? ' fav-active' : '') + '" aria-label="' + (favd ? 'Remove from favorites' : 'Add to favorites') + '">' +
                  '<svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="' + (favd ? 'currentColor' : 'none') + '"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
                  '</button>'
                : '';
            item.innerHTML =
                '<img src="' + photo.thumb + '" alt="' + photo.title + '" loading="lazy">' +
                '<div class="gallery-photo-overlay"><span>' + photo.title + '</span></div>' +
                heartHtml;
            if (IS_ADMIN) {
                var hBtn = item.querySelector('.gallery-heart-btn');
                hBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    toggleFav(photo, hBtn);
                    /* update the SVG fill live */
                    var svg = hBtn.querySelector('svg');
                    if (svg) svg.setAttribute('fill', hBtn.classList.contains('fav-active') ? 'currentColor' : 'none');
                });
            }
            item.addEventListener('click', function () { gOpenViewer(i); });
            gPhotosView.appendChild(item);
        });
    }

    function gOpenViewer(idx) {
        gCurrentIdx = idx;
        gUpdateViewer();
        gViewer.classList.add('active');
    }

    function gUpdateViewer() {
        var photo = gCurrentFolder.photos[gCurrentIdx];
        gViewerImg.style.opacity = '0';
        gViewerImg.onload = function () { gViewerImg.style.opacity = '1'; };
        gViewerImg.src   = photo.src;
        gViewerImg.alt   = photo.title;
        if (gViewerTitle)   gViewerTitle.textContent   = photo.title;
        if (gViewerCounter) gViewerCounter.textContent =
            (gCurrentIdx + 1) + ' / ' + gCurrentFolder.photos.length;
    }

    function gCloseViewer() { gViewer.classList.remove('active'); }

    if (gCloseBtn)    gCloseBtn.addEventListener('click', gCloseModal);
    if (gViewerBack)  gViewerBack.addEventListener('click', gCloseViewer);
    if (gViewerClose) gViewerClose.addEventListener('click', gCloseModal);
    if (gModal)       gModal.addEventListener('click', function (e) { if (e.target === gModal) gCloseModal(); });

    if (gViewerPrev) gViewerPrev.addEventListener('click', function () {
        gCurrentIdx = (gCurrentIdx - 1 + gCurrentFolder.photos.length) % gCurrentFolder.photos.length;
        gUpdateViewer();
    });
    if (gViewerNext) gViewerNext.addEventListener('click', function () {
        gCurrentIdx = (gCurrentIdx + 1) % gCurrentFolder.photos.length;
        gUpdateViewer();
    });

    /* Touch swipe in viewer */
    var gSwipeStartX = 0;
    if (gViewer) {
        gViewer.addEventListener('touchstart', function (e) { gSwipeStartX = e.touches[0].clientX; }, { passive: true });
        gViewer.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].clientX - gSwipeStartX;
            if (Math.abs(dx) > 50) { dx < 0 ? gViewerNext.click() : gViewerPrev.click(); }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!gModal || !gModal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            if (gViewer.classList.contains('active')) { gCloseViewer(); }          /* photo → photos grid */
            else if (gCurrentFolder !== null)          { gShowFolders(); }          /* photos grid → folders */
            else                                       { gCloseModal(); }           /* folders → page */
        }
        if (gViewer.classList.contains('active')) {
            if (e.key === 'ArrowLeft')  gViewerPrev.click();
            if (e.key === 'ArrowRight') gViewerNext.click();
        }
    });

    var galleryBtn = document.getElementById('portfolio-gallery-btn');
    if (galleryBtn) galleryBtn.addEventListener('click', gOpenModal);

    /* Sections with data-open-album — open ONLY that album's images, no folder list */
    document.querySelectorAll('[data-open-album]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var albumId = el.getAttribute('data-open-album');
            var album   = PORTFOLIO_ALBUMS.find(function (a) { return a.id === albumId; });
            if (!album) return;
            if (!gFoldersBuilt) { gBuildFolders(); gFoldersBuilt = true; }
            gModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            /* Open photo grid for this album only */
            gOpenFolder({ id: album.id, label: album.title, photos: album.images });
            /* Override back button: return to page, not to folder list */
            gBackBtn.onclick = gCloseModal;
            if (gBackLabel) gBackLabel.textContent = 'Back to Page';
        });
    });

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

/* Dynamic copyright year */
(function () {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
})();

