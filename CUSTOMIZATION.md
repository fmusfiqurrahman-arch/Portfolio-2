# Customization Guide

This guide will help you personalize the website to match your brand and content.

## 🎨 Quick Start Customization

### 1. Update Basic Information

#### In `index.html`:

**Navigation Logo (Line ~32)**
```html
<a href="#hero" class="nav-logo">Your Name</a>
```
Change "Your Name" to your actual name or brand.

**Page Title (Line ~18)**
```html
<title>Your Name - Photographer & Writer</title>
```

**Hero Section (Lines ~85-92)**
```html
<h1 class="hero-title">Capturing Moments,<br>Crafting Stories</h1>
<p class="hero-description">Award-winning visual storytelling...</p>
```
Update with your unique value proposition.

**Footer (Line ~845)**
```html
<h3>Your Name</h3>
<p>Capturing moments, crafting stories.</p>
```

### 2. Replace Images

All placeholder images use Unsplash. Replace with your own:

**Hero Slider (Lines ~75-84)**
```html
<div class="hero-image" style="background-image: url('YOUR_IMAGE.jpg')"></div>
```

**About Image (Line ~187)**
```html
<img src="YOUR_PORTRAIT.jpg" alt="Professional portrait">
```

**Portfolio Images**
Look for all `img src` tags in the portfolio section and replace with your work.

### 3. Update Contact Information

**Contact Section (Lines ~720-755)**
```html
<a href="mailto:hello@yourname.com">hello@yourname.com</a>
<a href="tel:+1234567890">+1 (234) 567-890</a>
<p>New York, NY</p>
```

**Social Media Links**
Find all social media `<a>` tags and add your profile URLs:
```html
<a href="https://instagram.com/yourusername" aria-label="Instagram">
```

---

## 🎨 Branding & Colors

### Change Brand Colors

In `css/styles.css`, modify the CSS variables (Line ~10):

```css
:root {
    /* Your brand color */
    --color-accent: #C9A661;
    --color-accent-dark: #B08D4A;
    
    /* Background colors */
    --color-bg: #FAFAFA;
    --color-surface: #FFFFFF;
    
    /* Text colors */
    --color-text: #1A1A1A;
    --color-text-muted: #6B6B6B;
}
```

**Example: Change to Blue Theme**
```css
:root {
    --color-accent: #3498db;
    --color-accent-dark: #2980b9;
}
```

### Change Typography

Replace Google Fonts link in HTML (Line ~20):
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_DISPLAY_FONT&family=YOUR_BODY_FONT&display=swap" rel="stylesheet">
```

Update CSS variables (Line ~25):
```css
:root {
    --font-serif: 'Your Display Font', serif;
    --font-sans: 'Your Body Font', sans-serif;
}
```

**Popular Font Combinations:**
- Playfair Display + Raleway
- Libre Baskerville + Source Sans Pro
- Crimson Text + Work Sans
- Lora + Roboto

---

## 💼 Services & Pricing

### Update Service Cards

Find the services section in HTML (starting ~205) and modify:

```html
<div class="service-card">
    <h4 class="service-title">Your Service Name</h4>
    <p class="service-description">Your description...</p>
    <div class="service-details">
        <div class="service-price">Starting at <span>$XXX</span></div>
        <ul class="service-includes">
            <li>What's included</li>
            <li>Another inclusion</li>
        </ul>
        <div class="service-timeline">Delivered within X weeks</div>
    </div>
</div>
```

### Add or Remove Services

**To add a service:**
1. Copy an existing `.service-card` div
2. Paste it within `.services-grid`
3. Update all content
4. Add to the contact form service dropdown

**To remove a service:**
1. Delete the entire `.service-card` div
2. Remove from contact form dropdown

---

## 📸 Portfolio Configuration

### Change Portfolio Categories

**In HTML**, update filter buttons (Line ~395):
```html
<button class="filter-btn" data-filter="your-category">Your Category</button>
```

**For each portfolio item**, set the category:
```html
<div class="portfolio-item" data-category="your-category">
```

### Add Portfolio Items

Copy this structure:
```html
<div class="portfolio-item" data-category="CATEGORY">
    <img src="YOUR_IMAGE.jpg" alt="Description" loading="lazy">
    <div class="portfolio-overlay">
        <h4>Project Title</h4>
        <span class="portfolio-category">Category</span>
    </div>
</div>
```

---

## ✍️ Writing Section

### Update Articles

Find the writing section and modify each card:

```html
<article class="writing-card" data-category="CATEGORY">
    <div class="writing-image">
        <img src="YOUR_IMAGE.jpg" alt="Article title">
    </div>
    <div class="writing-content">
        <div class="writing-meta">
            <span class="writing-category">Category</span>
            <span class="writing-date">Date</span>
        </div>
        <h3 class="writing-title">Your Article Title</h3>
        <p class="writing-excerpt">Your excerpt...</p>
        <div class="writing-footer">
            <span class="writing-publication">Published in XXX</span>
            <a href="ARTICLE_URL" class="writing-link">Read More →</a>
        </div>
    </div>
</article>
```

---

## 🗣️ Testimonials

### Update Testimonials

Find the testimonials section (Line ~625) and modify:

```html
<div class="testimonial-card">
    <div class="testimonial-rating">
        <!-- Five star SVGs -->
    </div>
    <p class="testimonial-text">"Your client's testimonial..."</p>
    <div class="testimonial-author">
        <img src="CLIENT_PHOTO.jpg" alt="Client Name">
        <div class="testimonial-info">
            <h4>Client Name</h4>
            <span>Client Role/Company</span>
        </div>
    </div>
</div>
```

### Add/Remove Testimonials

1. Copy entire `.testimonial-card` div
2. Add to `.testimonial-track`
3. JavaScript will automatically handle navigation dots

---

## 📅 Calendly Integration

### Setup Booking System

1. Create a Calendly account at https://calendly.com
2. Set up your event types
3. Get your scheduling link

**In HTML** (Line ~825), replace placeholder:
```html
<!-- Remove the placeholder div -->
<!-- Add this instead: -->
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/YOUR-USERNAME/YOUR-EVENT-TYPE" 
     style="min-width:320px;height:630px;">
</div>
<script type="text/javascript" 
        src="https://assets.calendly.com/assets/external/widget.js" 
        async>
</script>
```

---

## 📧 Contact Form Backend

### Option 1: Formspree (Easiest - Free Tier)

1. Sign up at https://formspree.io
2. Create a form
3. Update HTML form tag:

```html
<form action="https://formspree.io/f/YOUR-FORM-ID" 
      method="POST" 
      class="contact-form">
```

### Option 2: Netlify Forms

Add `data-netlify="true"` to form:
```html
<form name="contact" 
      method="POST" 
      data-netlify="true" 
      class="contact-form">
```

### Option 3: Custom PHP Backend

Create `api/contact.php`:
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $to = "your@email.com";
    $subject = "New Contact Form Submission";
    $message = "Name: " . $data['name'] . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    $message .= "Message: " . $data['message'];
    
    $headers = "From: noreply@yourwebsite.com";
    
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>
```

Update JavaScript (Line ~550 in script.js):
```javascript
fetch('/api/contact.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
```

---

## 🌓 Dark Mode Customization

### Adjust Dark Theme Colors

In CSS (Line ~35):
```css
[data-theme="dark"] {
    --color-bg: #0A0A0A;
    --color-surface: #151515;
    --color-text: #F5F5F5;
    /* Modify these to your preference */
}
```

### Disable Dark Mode

To remove dark mode completely:

1. Remove theme toggle button from HTML (Line ~51)
2. Remove dark theme CSS (Lines ~35-50)
3. Remove theme toggle JavaScript (Lines ~60-80 in script.js)

---

## 📱 Responsive Breakpoints

### Adjust Mobile Menu Breakpoint

In CSS (Line ~1950):
```css
@media (max-width: 768px) {
    /* Change 768px to your preferred breakpoint */
}
```

### Customize Grid Columns

**Portfolio Grid:**
```css
.portfolio-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    /* Change 350px to adjust minimum card width */
}
```

**Services Grid:**
```css
.services-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    /* Change 300px for different card sizes */
}
```

---

## ⚡ Performance Optimization

### Optimize Images

1. **Resize Images:**
   - Hero images: 1920x1080px
   - Portfolio: 800x600px
   - Thumbnails: 400x300px

2. **Compress Images:**
   - Use TinyPNG.com
   - Use ImageOptim (Mac)
   - Use Squoosh (Web)

3. **Convert to WebP:**
```html
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description">
</picture>
```

### Enable Lazy Loading

Already implemented! All images have:
```html
<img src="..." loading="lazy">
```

---

## 🔍 SEO Customization

### Update Meta Tags

In HTML `<head>` section:

```html
<meta name="description" content="Your unique description here">
<meta name="keywords" content="your, keywords, here">

<meta property="og:title" content="Your Name - Photographer & Writer">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yoursite.com/image.jpg">
```

### Add Google Analytics

Before closing `</head>` tag:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎯 Animation Customization

### Change Animation Speed

In CSS variables:
```css
:root {
    --transition-fast: 0.2s ease;    /* Quick hovers */
    --transition-base: 0.3s ease;    /* Standard */
    --transition-slow: 0.5s ease;    /* Smooth transitions */
}
```

### Disable Animations

Add to CSS:
```css
* {
    animation: none !important;
    transition: none !important;
}
```

Or remove from specific elements:
```css
.hero-title {
    animation: none;
}
```

---

## 📂 File Organization Tips

### Recommended Structure
```
your-website/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   ├── hero/
│   ├── portfolio/
│   ├── about/
│   └── testimonials/
└── assets/
    └── icons/
```

### Image Naming Convention
- Use descriptive names: `wedding-beach-ceremony.jpg`
- Lowercase, use hyphens
- Include category: `portrait-headshot-ceo.jpg`

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Replace all placeholder content
- [ ] Update all images with your work
- [ ] Test contact form
- [ ] Configure Calendly
- [ ] Add Google Analytics
- [ ] Test on mobile devices
- [ ] Check all links
- [ ] Optimize images
- [ ] Add favicon
- [ ] Create 404 page
- [ ] Set up SSL certificate
- [ ] Create sitemap.xml
- [ ] Submit to Google Search Console

---

## 🆘 Common Issues & Solutions

### Issue: Images not loading
**Solution:** Check file paths are correct and images are in the right folder.

### Issue: Contact form not working
**Solution:** Set up backend (Formspree, Netlify Forms, or custom PHP).

### Issue: Dark mode not persisting
**Solution:** Ensure localStorage is enabled in browser.

### Issue: Mobile menu not closing
**Solution:** Check JavaScript is loaded and no console errors.

### Issue: Slider not working
**Solution:** Verify JavaScript is loaded after HTML elements.

---

## 📞 Need Help?

If you need custom modifications beyond this guide:
- Hire a web developer on Upwork or Fiverr
- Post on Stack Overflow with specific questions
- Refer to MDN Web Docs for HTML/CSS/JS questions

---

**Happy Customizing! 🎉**

Remember: Start with small changes and test frequently. Keep backups before major modifications.
