# 🍽️ Orderly — Collaborative Group Food Ordering

> **Streamlined group dining, effortless selections, and transparent bill splitting.**

Orderly is a real-time web application that eliminates the chaos of group food orders. Whether you're organizing an office lunch, a Friday pizza party, or coffee runs with friends, Orderly lets hosts create a shared ordering space in seconds, gives teammates a live menu with personal selections, and automatically consolidates items for the kitchen with built-in bill and fee splitting.

---

## ✨ Features

### 🚀 Real-time Live Spaces
- **Instant Space Creation:** Launch a room in seconds with customized restaurant details.
- **Real-time Synchronization:** Built on Firebase Firestore snapshots—see teammate selections, participant counts, and grand totals update live with zero delay.
- **Dual-Pane Interface:** Sticky desktop sidebar displays your personal selection, participants list, and consolidated kitchen order side-by-side with menu items.

### 📱 Easy Sharing & Onboarding
- **Direct WhatsApp Sharing:** Share formatted space invitations directly to WhatsApp group chats with one click.
- **Instant QR Codes:** Generate scannable QR codes for table or office ordering without typing URLs.
- **Frictionless Participant Entry:** Join spaces as a guest with just a display name—no mandatory sign-up required for participants.

### 🍕 Smart Menu Management
- **1-Click Menu Presets:** Pre-loaded templates for *Coffee & Bakery*, *Pizza & Sides*, and *Burger Bar*.
- **Bulk Text Parser:** Paste raw menu text (e.g. `Cheeseburger - $12\nFries - $4`) to auto-populate rows instantly.
- **Category Filter Pills:** Seamlessly filter dishes by *All*, *Mains*, *Drinks*, *Desserts*, and *Sides*.
- **Save Favourite Menus:** Hosts can save custom menus to their profile for quick reuse.

### 💰 Smart Bill Splitting & Receipt Export
- **Delivery & Tip Calculator:** Add delivery fees and tax/tip with choice of **Proportional** (based on food subtotal) or **Equal** split across participants.
- **Consolidated Kitchen View:** Grouped breakdown showing exact quantities of every dish ordered.
- **Individual Participant Breakdown:** Clear receipts showing each person's exact subtotal, extra fee share, and final amount owed.
- **Host Payment Handle:** Include Venmo, Instapay, or PayPal handles directly in the summary.
- **Multi-Platform Receipt Export:** 1-click formatted text export for Slack, WhatsApp, or email.

### 🎨 Design & Accessibility
- **Warm Editorial Theme:** Styled with Tailwind CSS v4 and DaisyUI's warm `caramellatte` palette.
- **Accessible Touch Targets:** Minimum 44px hit areas on counters and buttons with active push micro-interactions.
- **Live Password Feedback:** Interactive checklist for password security requirements on registration.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite](https://vite.dev/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) + `redux-persist` |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/) |
| **Backend & Realtime** | [Firebase Firestore](https://firebase.google.com/products/firestore) (Realtime listeners) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/products/auth) (Email/Password & Google Sign-In) |
| **Icons & Animation** | Custom SVG suite + CSS animations |
| **Notifications** | [SweetAlert2](https://sweetalert2.github.io/) |

---

## 📁 Project Structure

```
orderly/
├── src/
│   ├── assets/
│   │   └── icons/          # Brand mark, food category illustrations, UI icons
│   ├── components/
│   │   ├── spaceScreenInfo/# Realtime sidebar widgets (Participants, MySelection, CollectiveOrder)
│   │   ├── Auth.jsx        # Authentication form with live password meter
│   │   ├── Counter.jsx     # Tactile quantity counter
│   │   ├── FormInput.jsx   # Reusable accessible form input
│   │   ├── Navbar.jsx      # Responsive navigation with mobile drawer
│   │   ├── OrderItem.jsx   # Menu item card with fallback category art
│   │   └── RecentOrder.jsx # Interactive dashboard space card
│   ├── features/
│   │   ├── slices/         # Redux slices (admin, space, order, menu, participants)
│   │   └── store.js        # Redux store with redux-persist
│   ├── Firebase/
│   │   ├── config.js       # Firebase SDK initialization
│   │   └── api_util.js     # Modular Firestore & Auth API layer
│   ├── pages/
│   │   ├── Landing.jsx     # Host dashboard with active & past space cards
│   │   ├── CreateSpacePage.jsx # Multi-step space creation & menu presets
│   │   ├── SpaceScreen.jsx # Realtime live collaborative ordering room
│   │   ├── FinalizedOrderPage.jsx # Bill splitting & consolidated receipt
│   │   ├── SignUp.jsx      # User registration
│   │   ├── AboutUsPage.jsx # Mission & product features
│   │   └── ContactUsPage.jsx # Inquiry form & team contacts
│   ├── utils/
│   │   └── formatCurrency.js # Currency formatting utility
│   ├── App.jsx             # Route definitions
│   └── index.css           # Global Tailwind v4 styles and custom surface utilities
├── firestore.rules         # Secure Firestore database rules
├── firebase.json           # Firebase Hosting & rewrite configurations
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or later
- **npm**: `v9.0.0` or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ahmed-yasser66/orderly.git
   cd orderly
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📦 Scripts

- `npm run dev` — Start local Vite development server
- `npm run build` — Build optimized production bundle to `dist/`
- `npm run lint` — Run ESLint code quality checks
- `npm run preview` — Locally preview the production build

---

## 🔒 Firebase Deployment

1. **Deploy Firestore Security Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Deploy Hosting with SPA deep-linking:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 👥 Team 4A

- **Ahmed Gamal**
- **Ahmed Yasser**
- **Ahmed Bakr**
- **Ahmed Adel**

---

## 📄 License

This project is licensed under the MIT License.
