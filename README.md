# 🌿 Spicera — Pure Ceylon Spices E-Commerce Platform

Official web application for **Spicera** ([www.spicera.store](https://www.spicera.store/)), dedicated to providing pure, single-origin, artisanal Ceylon spices direct to consumers and culinary professionals.

---

## ✨ Features & Architecture

### 1. 🛡️ High-Security Admin Control Panel (`/admin`)
- **Protected Routing & Firebase Authentication:** Guarded by `ProtectedRoute` using Firebase Auth (`signInWithEmailAndPassword`, `signOut`, `sendPasswordResetEmail`).
- **Brute-Force & Lockout Defense:** Built-in rate-limiting logic on login attempts with automatic cooldown protection.
- **First-Time Admin Account Initialization:** Toggle on the login screen (`/admin/login`) allows the site owner to register their initial master admin account safely.
- **Full Product Lifecycle (CRUD):**
  - **Add New Spice Products:** Name, tagline, category, price, pack size/unit, currency, origin, aroma profile, description, in-stock switch, and featured status.
  - **Edit Any Product & Details:** Instant real-time updates synced across all connected devices via Cloud Firestore `onSnapshot`.
  - **Multi-Source Image System:**
    1. Upload direct from device (uploads to Firebase Storage with base64 fallback).
    2. Custom external image URL.
    3. Pre-loaded Spicera high-res transparent PNG spice assets (`/saffron-hero.png`, `/cinnamon-hero.png`, `/pepper-hero.png`, `/moringa.png`, `/turmeric.png`).
  - **Delete Products:** Protected by a double-confirmation modal to prevent accidental data loss.
  - **Instant 1-Click Toggles:** Toggle "In Stock" / "Out of Stock" or "Featured on Homepage" directly from the dashboard table or mobile cards.
  - **One-Click Firestore Database Seeding:** Instant button in admin to populate the 5 core spices into Firestore if the cloud database is empty.
- **Mobile-Friendly Layout:** Responsive design with mobile cards view, sticky floating action button, and desktop table view.

### 2. 📲 Seamless WhatsApp Ordering
- **Single-Item Instant WhatsApp Order:** "Order on WhatsApp" button on every product card formats an immediate order inquiry message to `+94 77 856 7622`.
- **Spice Order Bag (Consolidated Inquiries):**
  - Slide-in side drawer allows customers to add multiple spices with quantity increment/decrement controls.
  - Calculates running estimated subtotal in Sri Lankan Rupees (Rs.).
  - Includes a delivery location / notes field.
  - "Confirm Order via WhatsApp" formats a professional, itemized bill message and opens WhatsApp.
- **Floating WhatsApp Speed-Dial Widget:** Pulsing floating action button on the bottom-right corner for instant inquiries.

### 3. 🎨 Visual Experience & Performance
- **Signature Light Theme Preserved:** Warm cream palette (`#FDFBF5`, `#FFFBF1`) accented with natural spice tones:
  - Saffron Gold (`#D48C00`)
  - Cinnamon Amber (`#B85B14`)
  - Pepper Charcoal (`#4A5568`)
  - Moringa Olive (`#556B2F`)
  - Turmeric Sun (`#FFA500`)
- **Hardware-Accelerated Micro-Animations:** Parallax 3D tilt effects (`react-parallax-tilt`), interactive particle dust backgrounds, and Framer Motion spring physics.
- **Brand Consistency:** Unaltered official brand logo (`/logo.png`) and favicon (`/favicon.ico`).
- **Product Quick View Modal:** Full-screen modal with aroma tags, origin stamps, botanical details, and direct order buttons.
- **New Trust & Heritage Sections:**
  - Single-Origin Ceylon Pillars (ethical sourcing, pure unadulterated spice, swift islandwide delivery).
  - From Soil to Savor (Artisanal curing and stone-milling process).
  - Verified Customer & Chef Reviews.
  - Wholesale / Custom Gift Boxes WhatsApp callout banner.

---

## 🚀 Deployment Guide (GitHub + Vercel)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: Spicera store with secure Firebase admin panel and WhatsApp order bag"
git branch -M main
git remote add origin https://github.com/Shavin-Joseph/spicera-site.git
git push -u origin main --force
```

### 2. Deploy on Vercel
1. Log in to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
2. Select your repository `spicera-site`.
3. Framework Preset: **Create React App**.
4. Build Command: `npm run build`
5. Output Directory: `build`
6. Click **Deploy**.

> **Note:** The repository already includes `vercel.json` configured with SPA routing rewrites:
> ```json
> {
>   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
> }
> ```
> This ensures routes like `/products`, `/admin`, and `/admin/login` never return 404 errors on browser refresh!

---

## 🔐 Firebase Security Configuration

This project includes production-ready security rules:
- `firestore.rules`: Public read access for the catalog; authenticated admin-only write, edit, and delete access.
- `storage.rules`: Public read access for spice images; authenticated admin-only upload and delete access.

To deploy security rules using Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Build production bundle
npm run build
```
Builds with **0 errors and 0 warnings**.
