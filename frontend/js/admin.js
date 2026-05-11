/* ===========================
   MRF Photography — admin.js
   Admin Panel Logic
   =========================== */

(function () {
    'use strict';

    /* ─────────────────────────────────────────
       CONSTANTS
    ───────────────────────────────────────── */
    var SESSION_KEY = 'mrf_admin';
    var ADMIN_USER  = 'admin';
    var ADMIN_PASS  = 'MRF@2024';

    var DEFAULT_PACKAGES = [
        {
            id: 'portrait',
            name: 'Portrait Photography',
            desc: 'Professional headshots, personal branding, and portrait sessions that capture your authentic self.',
            price: '500',
            duration: '2-hour session',
            features: ['2-hour session', '50+ edited photos', 'Online gallery', 'Print rights included', 'Delivered in 2 weeks'],
            visible: true
        },
        {
            id: 'wedding',
            name: 'Wedding Photography',
            desc: 'Complete wedding day coverage with cinematic storytelling and timeless elegance.',
            price: '3,500',
            duration: '8-hour coverage',
            features: ['8-hour coverage', '500+ edited photos', 'Engagement session', 'Custom album included', 'Second photographer', 'Delivered in 6 weeks'],
            visible: true
        },
        {
            id: 'commercial',
            name: 'Commercial Photography',
            desc: 'Product photography, brand campaigns, and corporate headshots for businesses.',
            price: '1,200',
            duration: 'Half-day session',
            features: ['Half-day session', '100+ edited photos', 'Commercial usage rights', 'Brand guideline adherence', 'Delivered in 3 weeks'],
            visible: true
        },
        {
            id: 'editorial',
            name: 'Editorial Photography',
            desc: 'Magazine spreads, fashion editorials, and artistic conceptual photography.',
            price: '2,000',
            duration: 'Full-day session',
            features: ['Full-day session', 'Concept development', '200+ edited photos', 'Location scouting', 'Styling consultation', 'Delivered in 4 weeks'],
            visible: true
        },
        {
            id: 'custom',
            name: 'Custom Package',
            desc: 'Something unique in mind? Let\'s build the perfect shoot around your vision.',
            price: 'Custom',
            duration: 'Fully bespoke',
            features: ['Multi-day or destination shoots', 'Commercial campaigns', 'Editorial & magazine work', 'Flexible timeline', 'Custom deliverables'],
            visible: true
        }
    ];

    var DEFAULT_TESTIMONIALS = [
        {
            name: 'Nadia & Rafiq Hossain',
            role: 'Wedding — Dhaka, December 2024',
            text: 'It rained for three hours during our wedding in Dhaka. I was devastated. Fahim pulled me aside and said — trust me, rain makes the best light. When I saw the photos, I cried. Every single rainy frame looked like a scene from a film. Our guests still ask us who our photographer was.',
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
            visible: true
        },
        {
            name: 'Sadia & Imran Khan',
            role: 'Wedding — Chittagong, August 2023',
            text: 'There is one photo Fahim took where my husband doesn\'t know I\'m looking at him. I\'m watching him from across the room and the way my face looks — I didn\'t know I could look at someone like that. I\'ve printed it. It\'s hanging in our home. Nothing else needs to be said.',
            photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
            visible: true
        },
        {
            name: 'Arif Chowdhury',
            role: 'Brand Portrait Session — 2023',
            text: 'I booked Fahim for a brand portrait session expecting standard headshots. What I received were photographs that looked like they belonged in Vogue. My LinkedIn profile picture has received more comments in two months than my previous one did in four years. He doesn\'t just take photos — he understands light in a way most photographers never will.',
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
            visible: true
        }
    ];

    var DEFAULT_EXPERIENCE = [
        { year: '2015', title: 'Studio Launch',   desc: 'Founded MRF Photography, Dhaka' },
        { year: '2018', title: 'Nat. Geographic', desc: 'First international editorial feature' },
        { year: '2020', title: 'First Book',      desc: 'Published visual narrative collection' },
        { year: '2022', title: 'Photo Award',     desc: 'Best Wedding Photographer — BD' },
        { year: '2024', title: 'Vogue Feature',   desc: 'Editorial spread — Asia edition' }
    ];

    /* ─────────────────────────────────────────
       DOM REFS
    ───────────────────────────────────────── */
    var loginScreen = document.getElementById('adm-login-screen');
    var adminApp    = document.getElementById('adm-app');
    var loginErr    = document.getElementById('adm-login-error');
    var userInput   = document.getElementById('adm-username');
    var passInput   = document.getElementById('adm-password');
    var loginBtn    = document.getElementById('adm-login-btn');
    var logoutBtn   = document.getElementById('adm-logout-btn');
    var navEl       = document.getElementById('adm-nav');
    var contentArea = document.getElementById('adm-content-area');
    var toastEl     = document.getElementById('adm-toast');

    var currentSection = 'about';

    /* ─────────────────────────────────────────
       AUTH
    ───────────────────────────────────────── */
    function checkAuth() {
        if (sessionStorage.getItem(SESSION_KEY) === 'true') {
            showApp();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        loginScreen.style.display = 'flex';
        adminApp.classList.remove('visible');
    }

    function showApp() {
        loginScreen.style.display = 'none';
        adminApp.classList.add('visible');
        showSection(currentSection);
    }

    function doLogin(user, pass) {
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            loginErr.classList.remove('visible');
            showApp();
        } else {
            loginErr.classList.add('visible');
            passInput.value = '';
            passInput.focus();
        }
    }

    function doLogout() {
        sessionStorage.removeItem(SESSION_KEY);
        showLogin();
    }

    loginBtn.addEventListener('click', function () {
        doLogin(userInput.value.trim(), passInput.value);
    });

    passInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doLogin(userInput.value.trim(), passInput.value);
    });

    userInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') passInput.focus();
    });

    logoutBtn.addEventListener('click', doLogout);

    /* ─────────────────────────────────────────
       NAVIGATION
    ───────────────────────────────────────── */
    navEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-section]');
        if (!btn) return;
        var section = btn.getAttribute('data-section');
        showSection(section);
    });

    function showSection(name) {
        currentSection = name;
        /* Update active nav */
        navEl.querySelectorAll('.adm-nav-item').forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('data-section') === name);
        });

        /* Render section */
        var renderers = {
            about:        renderAbout,
            gear:         renderGear,
            experience:   renderExperience,
            albums:       renderAlbums,
            featured:     renderFeatured,
            packages:     renderPackages,
            testimonials: renderTestimonials,
            contact:      renderContact
        };

        if (renderers[name]) {
            renderers[name]();
        } else {
            contentArea.innerHTML = '<div class="adm-card"><p>Section not found.</p></div>';
        }
    }

    /* ─────────────────────────────────────────
       TOAST
    ───────────────────────────────────────── */
    var toastTimer;
    function showToast(msg, type) {
        clearTimeout(toastTimer);
        toastEl.textContent = msg;
        toastEl.className   = 'adm-toast adm-toast--' + (type || 'success');
        toastEl.classList.add('visible');
        toastTimer = setTimeout(function () {
            toastEl.classList.remove('visible');
        }, 3000);
    }

    /* ─────────────────────────────────────────
       HELPERS
    ───────────────────────────────────────── */
    function cmsData() { return window.MRF_CMS.data; }

    function saveData(updatedData) {
        window.MRF_CMS.data = updatedData;
        window.MRF_CMS.save(updatedData);
    }

    function el(tag, cls, html) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    }

    function field(labelText, inputEl) {
        var wrap = el('div', 'adm-field');
        var lbl  = el('label');
        lbl.textContent = labelText;
        wrap.appendChild(lbl);
        wrap.appendChild(inputEl);
        return wrap;
    }

    function makeInput(value, placeholder) {
        var inp = el('input');
        inp.className   = 'adm-input';
        inp.type        = 'text';
        inp.value       = value || '';
        inp.placeholder = placeholder || '';
        return inp;
    }

    function makeTextarea(value, rows) {
        var ta       = el('textarea');
        ta.className = 'adm-textarea';
        ta.value     = value || '';
        ta.rows      = rows || 4;
        return ta;
    }

    function makeSelect(options, selected) {
        var sel = el('select', 'adm-select');
        options.forEach(function (opt) {
            var o = el('option');
            o.value       = opt.value;
            o.textContent = opt.label;
            if (opt.value === selected) o.selected = true;
            sel.appendChild(o);
        });
        return sel;
    }

    function makeToggle(checked, labelText) {
        var wrap = el('div', 'adm-toggle-wrap');
        var lbl  = document.createElement('label');
        lbl.className = 'adm-toggle';
        var inp = document.createElement('input');
        inp.type    = 'checkbox';
        inp.checked = !!checked;
        var slider = el('span', 'adm-toggle-slider');
        lbl.appendChild(inp);
        lbl.appendChild(slider);
        wrap.appendChild(lbl);
        if (labelText) {
            var txt = el('span', 'adm-toggle-label', labelText);
            wrap.appendChild(txt);
        }
        return { wrap: wrap, input: inp };
    }

    function makePillList(items, isGold, onRemove) {
        var list = el('div', 'adm-pill-list');
        function rebuildPills(arr) {
            list.innerHTML = '';
            arr.forEach(function (item, idx) {
                var pill   = el('span', 'adm-pill' + (isGold ? ' adm-pill-gold' : ''));
                var txt    = document.createTextNode(item);
                var btn    = el('button', 'adm-pill-remove');
                btn.type        = 'button';
                btn.textContent = '×';
                btn.title       = 'Remove';
                btn.addEventListener('click', function () { onRemove(idx); });
                pill.appendChild(txt);
                pill.appendChild(btn);
                list.appendChild(pill);
            });
        }
        rebuildPills(items);
        return list;
    }

    function makeImagePreview(src) {
        var img = el('img', 'adm-img-preview');
        img.alt = 'Preview';
        if (src) {
            img.src = src;
            img.classList.add('visible');
        }
        return img;
    }

    function bindPreview(inputEl, imgEl) {
        function update() {
            var val = inputEl.value.trim();
            if (val) {
                imgEl.src = val;
                imgEl.classList.add('visible');
            } else {
                imgEl.classList.remove('visible');
            }
        }
        inputEl.addEventListener('input', update);
        update();
    }

    /* ─────────────────────────────────────────
       SECTION: ABOUT
    ───────────────────────────────────────── */
    function renderAbout() {
        var d = cmsData().about || {};

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">About &amp; Profile</h2>';

        /* Photo */
        var photoInput   = makeInput(d.photo, 'https://...');
        var photoPreview = makeImagePreview(d.photo);
        bindPreview(photoInput, photoPreview);
        card.appendChild(field('Profile Photo URL', photoInput));
        card.appendChild(photoPreview);

        var hr1 = el('hr', 'adm-divider'); card.appendChild(hr1);

        /* Heading */
        var headingInput = makeTextarea(d.heading ? d.heading.replace(/<br\s*\/?>/gi, '\n') : '', 2);
        headingInput.placeholder = 'You Won\'t Remember\nthe Flowers.';
        card.appendChild(field('Section Heading (use newline for <br>)', headingInput));

        /* Lead */
        var leadInput = makeTextarea(d.lead, 3);
        card.appendChild(field('Lead Paragraph', leadInput));

        /* Bio */
        var bioInput = makeTextarea(d.bio, 4);
        card.appendChild(field('Bio Paragraph', bioInput));

        /* Quote */
        var quoteInput = makeInput(d.quote, '"I don\'t photograph weddings..."');
        card.appendChild(field('Pull Quote', quoteInput));

        var hr2 = el('hr', 'adm-divider'); card.appendChild(hr2);

        /* Stats */
        var statsTitle = el('div', 'adm-subsection-title', 'Stats');
        card.appendChild(statsTitle);

        var stats = d.stats || [{number:'500+',label:'Sessions'},{number:'10+',label:'Years'},{number:'50+',label:'Awards'}];
        var statInputs = [];
        stats.forEach(function (stat, idx) {
            var row  = el('div', 'adm-stats-row');
            var numF = el('div', 'adm-field');
            var numL = el('label'); numL.textContent = 'Stat ' + (idx+1) + ' Number';
            var numI = makeInput(stat.number, '500+');
            numF.appendChild(numL); numF.appendChild(numI);

            var lblF = el('div', 'adm-field');
            var lblL = el('label'); lblL.textContent = 'Label';
            var lblI = makeInput(stat.label, 'Sessions');
            lblF.appendChild(lblL); lblF.appendChild(lblI);

            row.appendChild(numF);
            row.appendChild(lblF);
            card.appendChild(row);
            statInputs.push({ number: numI, label: lblI });
        });

        /* Save */
        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save About');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var updatedStats = statInputs.map(function (s) {
                return { number: s.number.value.trim(), label: s.label.value.trim() };
            });
            var data = cmsData();
            data.about = {
                photo:   photoInput.value.trim(),
                heading: headingInput.value.replace(/\n/g, '<br>').trim(),
                lead:    leadInput.value.trim(),
                bio:     bioInput.value.trim(),
                quote:   quoteInput.value.trim(),
                stats:   updatedStats
            };
            saveData(data);
            showToast('About section saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       SECTION: GEAR
    ───────────────────────────────────────── */
    function renderGear() {
        var d = cmsData().gear || {};

        var groups = [
            { key: 'camera',   label: 'Camera / Equipment', isGold: true  },
            { key: 'editing',  label: 'Editing Software',   isGold: false },
            { key: 'workflow', label: 'Workflow Tools',      isGold: false }
        ];

        var gearState = {
            camera:   (d.camera   || ['Canon EOS R5','50mm f/1.2','85mm f/1.4','24-70mm f/2.8']).slice(),
            editing:  (d.editing  || ['Lightroom','Photoshop','Capture One','DaVinci Resolve']).slice(),
            workflow: (d.workflow || ['Notion','Calendly','WeTransfer','Google Drive']).slice()
        };

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">Gear &amp; Tools</h2>';

        groups.forEach(function (grp) {
            var section = el('div');

            var title = el('div', 'adm-subsection-title', grp.label);
            section.appendChild(title);

            var pillList = makePillList(gearState[grp.key], grp.isGold, function (idx) {
                gearState[grp.key].splice(idx, 1);
                refreshPills();
            });
            section.appendChild(pillList);

            function refreshPills() {
                var newList = makePillList(gearState[grp.key], grp.isGold, function (idx) {
                    gearState[grp.key].splice(idx, 1);
                    refreshPills();
                });
                pillList.replaceWith(newList);
                pillList = newList;
            }

            var addRow  = el('div', 'adm-add-row');
            var addInp  = makeInput('', 'New item...');
            var addBtn  = el('button', 'adm-btn adm-btn--ghost adm-btn--sm', '+ Add');
            addBtn.type = 'button';
            addBtn.addEventListener('click', function () {
                var val = addInp.value.trim();
                if (!val) return;
                gearState[grp.key].push(val);
                addInp.value = '';
                refreshPills();
            });
            addInp.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); }
            });
            addRow.appendChild(addInp);
            addRow.appendChild(addBtn);
            section.appendChild(addRow);

            var hr = el('hr', 'adm-divider');
            section.appendChild(hr);

            card.appendChild(section);
        });

        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save Gear');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var data  = cmsData();
            data.gear = {
                camera:   gearState.camera.slice(),
                editing:  gearState.editing.slice(),
                workflow: gearState.workflow.slice()
            };
            saveData(data);
            showToast('Gear & Tools saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       SECTION: EXPERIENCE
    ───────────────────────────────────────── */
    function renderExperience() {
        var d = cmsData();
        var expItems = (d.experience || DEFAULT_EXPERIENCE).map(function (e) {
            return { year: e.year, title: e.title, desc: e.desc };
        });

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">Experience</h2>';

        var actionsRow = el('div', 'adm-actions-row');
        var addBtn = el('button', 'adm-btn adm-btn--ghost adm-btn--sm', '+ Add New Entry');
        addBtn.type = 'button';
        actionsRow.appendChild(addBtn);
        card.appendChild(actionsRow);

        var listEl = el('div', 'adm-exp-list');
        card.appendChild(listEl);

        function buildList() {
            listEl.innerHTML = '';
            expItems.forEach(function (item, idx) {
                var itemEl = el('div', 'adm-exp-item');

                /* Delete button */
                var delBtn = el('button', 'adm-btn adm-btn--danger adm-btn--sm adm-exp-delete', '×');
                delBtn.type  = 'button';
                delBtn.title = 'Delete entry';
                delBtn.addEventListener('click', function () {
                    if (confirm('Delete this entry?')) {
                        expItems.splice(idx, 1);
                        buildList();
                    }
                });
                itemEl.appendChild(delBtn);

                /* Year + Title row */
                var fieldsRow = el('div', 'adm-exp-fields');
                var yearInp  = makeInput(item.year, '2015');
                var titleInp = makeInput(item.title, 'Studio Launch');
                yearInp.addEventListener('input',  function () { item.year  = yearInp.value;  });
                titleInp.addEventListener('input', function () { item.title = titleInp.value; });
                fieldsRow.appendChild(field('Year', yearInp));
                fieldsRow.appendChild(field('Title', titleInp));
                itemEl.appendChild(fieldsRow);

                /* Description */
                var descField = el('div', 'adm-field');
                var descLbl   = el('label'); descLbl.textContent = 'Description';
                var descTa    = makeTextarea(item.desc, 2);
                descTa.addEventListener('input', function () { item.desc = descTa.value; });
                descField.appendChild(descLbl);
                descField.appendChild(descTa);
                itemEl.appendChild(descField);

                listEl.appendChild(itemEl);
            });
        }

        buildList();

        addBtn.addEventListener('click', function () {
            expItems.push({ year: '', title: '', desc: '' });
            buildList();
            listEl.lastElementChild.querySelector('.adm-input').focus();
        });

        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save Experience');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var data = cmsData();
            data.experience = expItems.map(function (e) {
                return { year: e.year.trim(), title: e.title.trim(), desc: e.desc.trim() };
            });
            saveData(data);
            showToast('Experience saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       SECTION: ALBUMS
    ───────────────────────────────────────── */
    function renderAlbums() {
        var d = cmsData();

        /* Load albums — use saved or fall through to hardcoded defaults in window */
        var albums;
        if (d.portfolioAlbums) {
            albums = JSON.parse(JSON.stringify(d.portfolioAlbums));
        } else if (typeof PORTFOLIO_ALBUMS !== 'undefined') {
            albums = JSON.parse(JSON.stringify(PORTFOLIO_ALBUMS));
        } else {
            albums = [];
        }

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">Portfolio Albums</h2>';

        var actionsRow = el('div', 'adm-actions-row');
        var addBtn = el('button', 'adm-btn adm-btn--ghost', '+ Add New Album');
        addBtn.type = 'button';
        actionsRow.appendChild(addBtn);
        card.appendChild(actionsRow);

        var albumList = el('div', 'adm-album-list');
        card.appendChild(albumList);

        var catOptions = [
            { value: 'wedding',    label: 'Wedding'    },
            { value: 'portrait',   label: 'Portrait'   },
            { value: 'editorial',  label: 'Editorial'  },
            { value: 'commercial', label: 'Commercial' }
        ];

        function buildAlbums() {
            albumList.innerHTML = '';
            albums.forEach(function (album, aidx) {
                var albumCard = el('div', 'adm-album-card');

                /* Header */
                var head = el('div', 'adm-album-card-head');
                var chevron = el('span', 'adm-album-toggle-icon');
                chevron.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
                var titleSpan = el('span', 'adm-album-card-title', escHtml(album.title || 'Untitled Album'));
                var catBadge  = el('span', 'adm-album-card-cat', album.category || '');
                head.appendChild(chevron);
                head.appendChild(titleSpan);
                head.appendChild(catBadge);
                albumCard.appendChild(head);

                /* Body */
                var body = el('div', 'adm-album-card-body');

                /* Title */
                var titleInp = makeInput(album.title, 'Album Title');
                titleInp.addEventListener('input', function () {
                    album.title = titleInp.value;
                    titleSpan.textContent = titleInp.value || 'Untitled Album';
                });
                body.appendChild(field('Album Title', titleInp));

                /* Category */
                var catSel = makeSelect(catOptions, album.category);
                catSel.addEventListener('change', function () {
                    album.category = catSel.value;
                    catBadge.textContent = catSel.value;
                });
                body.appendChild(field('Category', catSel));

                /* Cover image */
                var coverInp     = makeInput(album.cover || (album.images && album.images[0] ? album.images[0].thumb : ''), 'https://...');
                var coverPreview = makeImagePreview(coverInp.value);
                bindPreview(coverInp, coverPreview);
                coverInp.addEventListener('input', function () { album.cover = coverInp.value.trim(); });
                body.appendChild(field('Cover Image URL', coverInp));
                body.appendChild(coverPreview);

                var hr1 = el('hr', 'adm-divider'); body.appendChild(hr1);

                /* Images */
                var imgTitle = el('div', 'adm-subsection-title', 'Photos in Album');
                body.appendChild(imgTitle);

                var imgGrid = el('div', 'adm-image-grid');
                body.appendChild(imgGrid);

                function buildImageGrid() {
                    imgGrid.innerHTML = '';
                    var images = album.images || [];
                    images.forEach(function (img, iidx) {
                        var wrap = el('div', 'adm-thumb-wrap');
                        var thumb = el('img', 'adm-thumb');
                        thumb.src = img.thumb || img.src || '';
                        thumb.alt = img.title || '';
                        var lbl = el('div', 'adm-thumb-label', escHtml(img.title || ''));
                        var del = el('button', 'adm-thumb-delete', '×');
                        del.type  = 'button';
                        del.title = 'Remove photo';
                        del.addEventListener('click', function () {
                            if (confirm('Remove this photo?')) {
                                album.images.splice(iidx, 1);
                                buildImageGrid();
                            }
                        });
                        wrap.appendChild(thumb);
                        wrap.appendChild(lbl);
                        wrap.appendChild(del);
                        imgGrid.appendChild(wrap);
                    });
                }

                buildImageGrid();

                /* Add image row */
                var addImgRow  = el('div', 'adm-add-image-row');
                var addSrcInp  = makeInput('', 'Full-res URL (https://...)');
                var addTitleInp = makeInput('', 'Photo title');
                var addImgBtn  = el('button', 'adm-btn adm-btn--ghost adm-btn--sm', '+ Add Photo');
                addImgBtn.type = 'button';
                addImgBtn.addEventListener('click', function () {
                    var src = addSrcInp.value.trim();
                    var ttl = addTitleInp.value.trim();
                    if (!src) { showToast('Please enter a photo URL.', 'error'); return; }
                    /* Build thumb URL from src by injecting w=400 */
                    var thumb = src.includes('unsplash.com') ? src.replace(/w=\d+/, 'w=400').replace(/q=\d+/, 'q=80') : src;
                    if (!album.images) album.images = [];
                    album.images.push({ src: src, thumb: thumb, title: ttl || 'Photo' });
                    addSrcInp.value   = '';
                    addTitleInp.value = '';
                    buildImageGrid();
                });
                addImgRow.appendChild(addSrcInp);
                addImgRow.appendChild(addTitleInp);
                addImgRow.appendChild(addImgBtn);
                body.appendChild(addImgRow);

                var hr2 = el('hr', 'adm-divider'); body.appendChild(hr2);

                /* Delete album */
                var delAlbumBtn = el('button', 'adm-btn adm-btn--danger adm-btn--sm', 'Delete This Album');
                delAlbumBtn.type = 'button';
                delAlbumBtn.addEventListener('click', function () {
                    if (confirm('Delete album "' + album.title + '"? This cannot be undone.')) {
                        albums.splice(aidx, 1);
                        buildAlbums();
                    }
                });
                body.appendChild(delAlbumBtn);

                albumCard.appendChild(body);

                /* Toggle open/close */
                head.addEventListener('click', function () {
                    albumCard.classList.toggle('open');
                });

                albumList.appendChild(albumCard);
            });
        }

        buildAlbums();

        addBtn.addEventListener('click', function () {
            albums.push({
                id:       'album-' + Date.now(),
                title:    '',
                category: 'wedding',
                cover:    '',
                images:   []
            });
            buildAlbums();
            /* Open the newly added album */
            var cards = albumList.querySelectorAll('.adm-album-card');
            if (cards.length) cards[cards.length - 1].classList.add('open');
        });

        /* Save */
        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save Albums');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var data = cmsData();
            data.portfolioAlbums = JSON.parse(JSON.stringify(albums));
            saveData(data);
            showToast('Portfolio albums saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       SECTION: FEATURED WOW
    ───────────────────────────────────────── */
    function renderFeatured() {
        var d  = cmsData();
        var fw = d.featuredWow || {};

        /* Get album IDs */
        var albumIds = [];
        if (d.portfolioAlbums) {
            albumIds = d.portfolioAlbums.map(function (a) { return { value: a.id, label: a.title + ' (' + a.id + ')' }; });
        } else if (typeof PORTFOLIO_ALBUMS !== 'undefined') {
            albumIds = PORTFOLIO_ALBUMS.map(function (a) { return { value: a.id, label: a.title + ' (' + a.id + ')' }; });
        }

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">Featured Story</h2>';

        var namesInp = makeInput(fw.names, 'Nadia & Rafiq');
        card.appendChild(field('Couple / Subject Names', namesInp));

        var placeInp = makeInput(fw.place, 'Dhaka, Bangladesh — 2024');
        card.appendChild(field('Place & Year', placeInp));

        var imgInp     = makeInput(fw.image, 'https://...');
        var imgPreview = makeImagePreview(fw.image);
        bindPreview(imgInp, imgPreview);
        card.appendChild(field('Background Image URL', imgInp));
        card.appendChild(imgPreview);

        var posInp = makeInput(fw.position || 'center 35%', 'center 35%');
        card.appendChild(field('Background Position (CSS)', posInp));

        if (albumIds.length) {
            var albumSel = makeSelect(albumIds, fw.albumId);
            card.appendChild(field('Linked Album (data-open-album)', albumSel));
        } else {
            var albumInp = makeInput(fw.albumId, 'elegant-wedding');
            card.appendChild(field('Linked Album ID', albumInp));
        }

        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save Featured Story');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var data = cmsData();
            data.featuredWow = {
                names:    namesInp.value.trim(),
                place:    placeInp.value.trim(),
                image:    imgInp.value.trim(),
                position: posInp.value.trim(),
                albumId:  albumIds.length ? albumSel.value : albumInp.value.trim()
            };
            saveData(data);
            showToast('Featured story saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       SECTION: PACKAGES
    ───────────────────────────────────────── */
    function renderPackages() {
        var d = cmsData();
        var packages = d.packages ? JSON.parse(JSON.stringify(d.packages)) : JSON.parse(JSON.stringify(DEFAULT_PACKAGES));

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">Packages</h2>';

        var pkgGrid = el('div', 'adm-pkg-grid');
        card.appendChild(pkgGrid);

        function buildPackages() {
            pkgGrid.innerHTML = '';
            packages.forEach(function (pkg, pidx) {
                var pkgCard = el('div', 'adm-pkg-card');

                var head = el('div', 'adm-pkg-head');
                var chevron = el('span', 'adm-pkg-toggle-icon');
                chevron.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
                var titleSpan = el('span', 'adm-pkg-title', escHtml(pkg.name || 'Package'));
                head.appendChild(chevron);
                head.appendChild(titleSpan);

                var tog = makeToggle(pkg.visible !== false, 'Visible');
                tog.input.addEventListener('change', function () {
                    pkg.visible = tog.input.checked;
                });
                head.appendChild(tog.wrap);

                pkgCard.appendChild(head);
                head.addEventListener('click', function (e) {
                    if (e.target.closest('.adm-toggle-wrap')) return;
                    pkgCard.classList.toggle('open');
                });

                var body = el('div', 'adm-pkg-body');

                var nameInp = makeInput(pkg.name, 'Package Name');
                nameInp.addEventListener('input', function () {
                    pkg.name = nameInp.value;
                    titleSpan.textContent = nameInp.value || 'Package';
                });
                body.appendChild(field('Package Name', nameInp));

                var descTa = makeTextarea(pkg.desc, 3);
                descTa.addEventListener('input', function () { pkg.desc = descTa.value; });
                body.appendChild(field('Description', descTa));

                var priceRow = el('div', 'adm-price-row');
                var priceInp = makeInput(pkg.price, '500');
                priceInp.addEventListener('input', function () { pkg.price = priceInp.value; });
                var durInp = makeInput(pkg.duration, '2-hour session');
                durInp.addEventListener('input', function () { pkg.duration = durInp.value; });

                var priceField = field('Price (number or "Custom")', priceInp);
                var durField   = field('Duration', durInp);
                priceField.style.margin = '0';
                durField.style.margin   = '0';
                priceRow.appendChild(priceField);
                priceRow.appendChild(durField);
                body.appendChild(priceRow);

                var hr = el('hr', 'adm-divider'); body.appendChild(hr);

                /* Features */
                var featTitle = el('div', 'adm-subsection-title', 'Package Features');
                body.appendChild(featTitle);

                var features = (pkg.features || []).slice();

                var featPillList = makePillList(features, false, function (idx) {
                    features.splice(idx, 1);
                    pkg.features = features.slice();
                    refreshFeats();
                });
                body.appendChild(featPillList);

                function refreshFeats() {
                    var newList = makePillList(features, false, function (idx) {
                        features.splice(idx, 1);
                        pkg.features = features.slice();
                        refreshFeats();
                    });
                    featPillList.replaceWith(newList);
                    featPillList = newList;
                }

                var addRow = el('div', 'adm-add-row');
                var addInp = makeInput('', 'New feature...');
                var addBtn = el('button', 'adm-btn adm-btn--ghost adm-btn--sm', '+ Add');
                addBtn.type = 'button';
                addBtn.addEventListener('click', function () {
                    var val = addInp.value.trim();
                    if (!val) return;
                    features.push(val);
                    pkg.features = features.slice();
                    addInp.value = '';
                    refreshFeats();
                });
                addInp.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); }
                });
                addRow.appendChild(addInp);
                addRow.appendChild(addBtn);
                body.appendChild(addRow);

                pkgCard.appendChild(body);
                pkgGrid.appendChild(pkgCard);
            });
        }

        buildPackages();

        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save Packages');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var data = cmsData();
            data.packages = JSON.parse(JSON.stringify(packages));
            saveData(data);
            showToast('Packages saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       SECTION: TESTIMONIALS
    ───────────────────────────────────────── */
    function renderTestimonials() {
        var d = cmsData();
        var testimonials = d.testimonials
            ? JSON.parse(JSON.stringify(d.testimonials))
            : JSON.parse(JSON.stringify(DEFAULT_TESTIMONIALS));

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">Testimonials</h2>';

        var actionsRow = el('div', 'adm-actions-row');
        var addBtn = el('button', 'adm-btn adm-btn--ghost adm-btn--sm', '+ Add New Testimonial');
        addBtn.type = 'button';
        actionsRow.appendChild(addBtn);
        card.appendChild(actionsRow);

        var listEl = el('div', 'adm-testi-list');
        card.appendChild(listEl);

        function buildList() {
            listEl.innerHTML = '';
            testimonials.forEach(function (testi, tidx) {
                var teCard = el('div', 'adm-testi-card');

                var header = el('div', 'adm-testi-header');
                var nameSpan = el('span', 'adm-testi-name', escHtml(testi.name || 'Testimonial ' + (tidx+1)));
                var actions  = el('div', 'adm-flex');

                var tog = makeToggle(testi.visible !== false, 'Visible');
                tog.input.addEventListener('change', function () { testi.visible = tog.input.checked; });

                var delBtn = el('button', 'adm-btn adm-btn--danger adm-btn--sm', '×');
                delBtn.type  = 'button';
                delBtn.title = 'Delete';
                delBtn.addEventListener('click', function () {
                    if (confirm('Delete this testimonial?')) {
                        testimonials.splice(tidx, 1);
                        buildList();
                    }
                });

                actions.appendChild(tog.wrap);
                actions.appendChild(delBtn);
                header.appendChild(nameSpan);
                header.appendChild(actions);
                teCard.appendChild(header);

                var nameInp = makeInput(testi.name, 'Full Name');
                nameInp.addEventListener('input', function () {
                    testi.name = nameInp.value;
                    nameSpan.textContent = nameInp.value || 'Testimonial';
                });
                teCard.appendChild(field('Name', nameInp));

                var roleInp = makeInput(testi.role, 'Wedding — City, Year');
                roleInp.addEventListener('input', function () { testi.role = roleInp.value; });
                teCard.appendChild(field('Role / Session', roleInp));

                var textTa = makeTextarea(testi.text, 4);
                textTa.addEventListener('input', function () { testi.text = textTa.value; });
                teCard.appendChild(field('Testimonial Text', textTa));

                var photoInp     = makeInput(testi.photo, 'https://...');
                var photoPreview = makeImagePreview(testi.photo);
                bindPreview(photoInp, photoPreview);
                photoInp.addEventListener('input', function () { testi.photo = photoInp.value.trim(); });
                teCard.appendChild(field('Photo URL', photoInp));
                teCard.appendChild(photoPreview);

                listEl.appendChild(teCard);
            });
        }

        buildList();

        addBtn.addEventListener('click', function () {
            testimonials.push({ name: '', role: '', text: '', photo: '', visible: true });
            buildList();
            listEl.lastElementChild.querySelector('.adm-input').focus();
        });

        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save Testimonials');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var data = cmsData();
            data.testimonials = JSON.parse(JSON.stringify(testimonials));
            saveData(data);
            showToast('Testimonials saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       SECTION: CONTACT
    ───────────────────────────────────────── */
    function renderContact() {
        var d = cmsData();
        var c = d.contact || {};

        var card = el('div', 'adm-card');
        card.innerHTML = '<h2 class="adm-section-title">Contact Info</h2>';

        var emailInp = makeInput(c.email, 'hello@mrfphotography.com');
        card.appendChild(field('Email Address', emailInp));

        var phoneInp = makeInput(c.phone, '+880 1700 000 000');
        card.appendChild(field('Phone / WhatsApp', phoneInp));

        var locInp = makeInput(c.location, 'Dhaka, Bangladesh');
        card.appendChild(field('Location (Based In)', locInp));

        var saveBar = el('div', 'adm-save-bar');
        var saveBtn = el('button', 'adm-btn adm-btn--primary', 'Save Contact Info');
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', function () {
            var data = cmsData();
            data.contact = {
                email:    emailInp.value.trim(),
                phone:    phoneInp.value.trim(),
                location: locInp.value.trim()
            };
            saveData(data);
            showToast('Contact info saved!', 'success');
        });
        saveBar.appendChild(saveBtn);
        card.appendChild(saveBar);

        contentArea.innerHTML = '';
        contentArea.appendChild(card);
    }

    /* ─────────────────────────────────────────
       UTILITY: escHtml
    ───────────────────────────────────────── */
    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ─────────────────────────────────────────
       INIT
    ───────────────────────────────────────── */
    checkAuth();

})();
