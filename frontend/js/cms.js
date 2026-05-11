/* ===========================
   MRF Photography — cms.js
   Content Management Layer
   Runs BEFORE script.js
   =========================== */

(function () {
    'use strict';

    var STORAGE_KEY = 'mrf_cms';

    var DEFAULTS = {
        about: {
            photo:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
            heading: 'You Won\'t Remember<br>the Flowers.',
            lead:    'You\'ll remember the way he looked at you. The laugh that escaped before the vows. Your mother\'s face when you walked in.',
            bio:     'I\'m Fahim. For over a decade I\'ve photographed weddings and portraits across Bangladesh and internationally — not to document your day, but to preserve the feeling of it. The images I make are ones you\'ll pull out ten years from now and feel everything all over again.',
            quote:   '"I don\'t photograph weddings. I photograph the love inside them."',
            stats:   [
                { number: '500+', label: 'Sessions' },
                { number: '10+',  label: 'Years'    },
                { number: '50+',  label: 'Awards'   }
            ]
        },
        gear: {
            camera:  ['Canon EOS R5', '50mm f/1.2', '85mm f/1.4', '24-70mm f/2.8'],
            editing: ['Lightroom', 'Photoshop', 'Capture One', 'DaVinci Resolve'],
            workflow: ['Notion', 'Calendly', 'WeTransfer', 'Google Drive']
        },
        featuredWow: {
            albumId:  'elegant-wedding',
            names:    'Nadia & Rafiq',
            place:    'Dhaka, Bangladesh — 2024',
            image:    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=90',
            position: 'center 35%'
        },
        contact: {
            email:    'hello@mrfphotography.com',
            phone:    '+880 1700 000 000',
            location: 'Dhaka, Bangladesh'
        },
        experience: [
            { year: '2015', title: 'Studio Launch',   desc: 'Founded MRF Photography, Dhaka' },
            { year: '2018', title: 'Nat. Geographic', desc: 'First international editorial feature' },
            { year: '2020', title: 'First Book',      desc: 'Published visual narrative collection' },
            { year: '2022', title: 'Photo Award',     desc: 'Best Wedding Photographer — BD' },
            { year: '2024', title: 'Vogue Feature',   desc: 'Editorial spread — Asia edition' }
        ],
        portfolioAlbums: null,
        testimonials:    null,
        packages:        null
    };

    /* Deep-merge saved data over defaults */
    function loadData() {
        var saved = null;
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) saved = JSON.parse(raw);
        } catch (e) { /* ignore parse errors */ }

        if (!saved) return deepClone(DEFAULTS);

        var merged = deepClone(DEFAULTS);
        /* Shallow-merge top-level sections */
        var keys = Object.keys(saved);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (saved[k] !== null && typeof saved[k] === 'object' && !Array.isArray(saved[k]) &&
                merged[k] !== null && typeof merged[k] === 'object' && !Array.isArray(merged[k])) {
                var subKeys = Object.keys(saved[k]);
                for (var j = 0; j < subKeys.length; j++) {
                    merged[k][subKeys[j]] = saved[k][subKeys[j]];
                }
            } else {
                merged[k] = saved[k];
            }
        }
        return merged;
    }

    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) { /* quota exceeded etc */ }
    }

    var data = loadData();

    window.MRF_CMS = {
        data:     data,
        defaults: DEFAULTS,
        save:     save
    };

    /* ── Apply saved content to DOM after DOM ready ── */
    function applyToDom() {
        var d = window.MRF_CMS.data;

        /* About photo */
        var photoImg = document.querySelector('.bento-photo img');
        if (photoImg && d.about && d.about.photo) {
            photoImg.src = d.about.photo;
        }

        /* About heading */
        var headingEl = document.querySelector('.bento-bio .section-title');
        if (headingEl && d.about && d.about.heading) {
            headingEl.innerHTML = d.about.heading;
        }

        /* About lead */
        var leadEl = document.querySelector('.bento-bio .lead');
        if (leadEl && d.about && d.about.lead) {
            leadEl.textContent = d.about.lead;
        }

        /* About bio — first <p> inside .bento-bio that is neither .lead nor .about-quote */
        var bentoParas = document.querySelectorAll('.bento-bio p');
        for (var i = 0; i < bentoParas.length; i++) {
            var p = bentoParas[i];
            if (!p.classList.contains('lead') && !p.classList.contains('about-quote')) {
                if (d.about && d.about.bio) p.textContent = d.about.bio;
                break;
            }
        }

        /* About quote */
        var quoteEl = document.querySelector('.about-quote');
        if (quoteEl && d.about && d.about.quote) {
            quoteEl.textContent = d.about.quote;
        }

        /* About stats */
        if (d.about && d.about.stats) {
            var statEls = document.querySelectorAll('.about-stats .stat');
            for (var s = 0; s < statEls.length && s < d.about.stats.length; s++) {
                var numEl = statEls[s].querySelector('.stat-number');
                var lblEl = statEls[s].querySelector('.stat-label');
                if (numEl) numEl.textContent = d.about.stats[s].number;
                if (lblEl) lblEl.textContent = d.about.stats[s].label;
            }
        }

        /* Gear pills — rebuild all three groups */
        if (d.gear) {
            var groups = [
                { key: 'camera',   gold: true  },
                { key: 'editing',  gold: false },
                { key: 'workflow', gold: false }
            ];
            var toolsGroups = document.querySelectorAll('.bento-tools .tools-group');
            for (var g = 0; g < groups.length && g < toolsGroups.length; g++) {
                var gKey   = groups[g].key;
                var isGold = groups[g].gold;
                var pills  = d.gear[gKey];
                if (!pills) continue;
                var pillsContainer = toolsGroups[g].querySelector('.tools-pills');
                if (!pillsContainer) continue;
                pillsContainer.innerHTML = '';
                for (var pi = 0; pi < pills.length; pi++) {
                    var span = document.createElement('span');
                    span.className = isGold ? 'pill pill-gold' : 'pill';
                    span.textContent = pills[pi];
                    pillsContainer.appendChild(span);
                }
            }
        }

        /* Featured Wow section */
        if (d.featuredWow) {
            var fw = d.featuredWow;
            var wowEl = document.querySelector('.portfolio-wow');
            if (wowEl) {
                if (fw.albumId) wowEl.setAttribute('data-open-album', fw.albumId);

                var wowImageEl = wowEl.querySelector('.portfolio-wow-image');
                if (wowImageEl) {
                    if (fw.image)    wowImageEl.style.backgroundImage = 'url(\'' + fw.image + '\')';
                    if (fw.position) wowImageEl.style.backgroundPosition = fw.position;
                }

                var wowNames = wowEl.querySelector('.portfolio-wow-names');
                if (wowNames && fw.names) wowNames.textContent = fw.names;

                var wowPlace = wowEl.querySelector('.portfolio-wow-place');
                if (wowPlace && fw.place) wowPlace.innerHTML = fw.place.replace('—', '&mdash;');
            }
        }

        /* Contact email */
        if (d.contact && d.contact.email) {
            var emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            for (var el = 0; el < emailLinks.length; el++) {
                emailLinks[el].href        = 'mailto:' + d.contact.email;
                emailLinks[el].textContent = d.contact.email;
            }
        }

        /* Contact phone */
        if (d.contact && d.contact.phone) {
            var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            var phoneDigits = d.contact.phone.replace(/[^0-9+]/g, '');
            for (var ph = 0; ph < phoneLinks.length; ph++) {
                phoneLinks[ph].href        = 'tel:' + phoneDigits;
                phoneLinks[ph].textContent = d.contact.phone;
            }
        }

        /* Contact location */
        if (d.contact && d.contact.location) {
            var locationEls = document.querySelectorAll('.contact-details p');
            for (var loc = 0; loc < locationEls.length; loc++) {
                /* The location paragraph is inside a .contact-item that contains "Based In" */
                var parent = locationEls[loc].closest('.contact-item');
                if (parent) {
                    var h4 = parent.querySelector('h4');
                    if (h4 && h4.textContent === 'Based In') {
                        locationEls[loc].textContent = d.contact.location;
                    }
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyToDom);
    } else {
        applyToDom();
    }

})();
