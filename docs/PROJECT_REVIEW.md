# Orderly — Project Review

_Reviewed on 2026-09-25 against commit `846ae75`._

This review covers bugs, security issues, codebase health, and missing features in the Orderly app (React 19, Vite, Redux Toolkit, Firebase).

## How the review was done

- Read the active source tree (`src/` excluding the stale `src/src/` copy), `firestore.rules`, and the build and lint config.
- Ran the project's own checks:
  - `npm run lint`: clean, with no errors or warnings.
  - `npm test`: 3 of 3 pass. The tests cover only two reducers.
  - `vite build`: succeeds. The largest chunks are firebase (485 kB), index (296 kB), and react (104 kB).
  - `npm audit --omit=dev`: 0 vulnerabilities.

Severity key: 🔴 critical, 🟠 high, 🟡 medium, ⚪ low.

---

## 1. Summary

| # | Finding | Severity | Area |
|---|---------|----------|------|
| S1 | Demo account email and password are hard-coded in the client bundle | 🔴 | Security |
| S2 | Anyone can overwrite any guest's order (no participant ownership in rules) | 🟠 | Security |
| S3 | Joining with an existing display name takes over that participant | 🟠 | Security / UX |
| B1 | Category filter makes the +/- counters change the wrong dish | 🔴 | Bug |
| B2 | Guests are not notified when the host finalizes, so later edits fail with errors | 🟠 | Bug |
| B3 | Any signed-in user sees "Finalize & Lock Order" in another host's room | 🟠 | Bug |
| B4 | Footer links `/about` and `/contact` go to non-existent routes (no 404 page) | 🟡 | Bug |
| B5 | Currency mix-up: amounts use Egyptian pounds with Arabic digits, labels say `$` | 🟡 | Bug / UX |
| B6 | Favourite menus lose item descriptions when reused | 🟡 | Bug |
| B7 | Finalized receipt merges different items that share a name | ⚪ | Bug |
| B8 | Active spaces always show a total of 0 on the dashboard | ⚪ | Bug |
| B9 | Proportional fee split can be off by a cent (floating-point money) | ⚪ | Bug |
| H1 | A stale duplicate app (`src/src/`, plus `src/package.json` and others) is committed | 🟠 | Health |
| H2 | Large amount of dead code: unused slices, hooks, components, models, and API methods | 🟡 | Health |
| H3 | Dev-only `/components-test` route ships to production | 🟡 | Health |
| H4 | Duplicated auth-state listeners and duplicated demo-login code | ⚪ | Health |
| H5 | Very little test coverage and no CI | 🟡 | Health |

---

## 2. Security

### S1 🔴 Demo credentials are in the client bundle
- **Where:** `src/components/Auth.jsx:199`, `src/components/Auth.jsx:205`, `src/pages/SignUp.jsx:172`, `src/pages/SignUp.jsx:178`, and `src/Firebase/config.js:28`.
- **Problem:** The "Skip Auth (Demo Sign In)" button signs in with a real email and a plaintext password (`123456Maz`), and creates that account if it does not exist.
  - Everyone who opens the site can read these credentials from the JavaScript bundle and the git history.
  - Everyone shares one account. Any visitor can see, finalize, or delete every space the demo user owns, and can change or reset its password, which locks everyone else out.
  - `isVerifiedUser()` also skips email verification for that address.
- **Fix:**
  1. Remove the button, the hard-coded password, and the `DEMO_EMAIL` exception.
  2. Rotate the password now, because it is already in git history.
  3. For a demo mode, use **Firebase Anonymous Auth**. Each visitor then gets an isolated, throwaway account, and the existing `adminId == request.auth.uid` rules keep working.

### S2 🟠 Participant documents have no ownership check
- **Where:** `firestore.rules:44` (participant `update`).
- **Problem:** Any unauthenticated client can update any participant document in any non-finalized space, including the `name` and `selectedItems` fields.
  - Participant IDs are publicly readable (`allow read: if true`), so an attacker can list them and rewrite other people's orders.
  - `selectedItems` also has no size limit and no schema check, and it carries a client-supplied `price`.
- **Fix:**
  1. Sign guests in with **Anonymous Auth** and use `request.auth.uid` as the participant document ID. The update rule can then require `participantId == request.auth.uid`.
  2. Validate `selectedItems` (`size() <= N`, fields and types).
  3. At finalization, never trust a client price. `OrderSideInfo` already prefers the menu price, but it falls back to `selected.price` when an item ID does not match.

### S3 🟠 Joining with an existing name takes over that participant
- **Where:** `src/pages/SpaceScreen.jsx:105`.
- **Problem:** `handleGuestSubmit` reuses the ID of any participant with the same trimmed name.
  - This is meant for rejoining after a tab closes, since the ID is kept in `sessionStorage`.
  - It also means anyone who types "Alex" becomes Alex and can change Alex's order.
  - Two different people with the same first name silently share one cart.
- **Fix:** Anonymous Auth (see S2) fixes rejoining properly. Until then, keep the participant ID in `localStorage` and ask "Is this you?" before reusing a name.

### Other security notes (⚪)
- **Third-party QR service:** The room link is sent to `api.qrserver.com` to draw the QR code (`src/pages/SpaceScreen.jsx:229`). Generate the code in the browser instead, for example with `qrcode`.
- **Public space documents:** Space documents are world-readable, including `finalizedOrder`, which holds participant names and amounts. This is acceptable for invite links. It should be documented, or the receipt data moved to a subcollection with narrower read rules.
- **Hard-coded Firebase config fallback:** `src/Firebase/config.js:13` falls back to a hard-coded Firebase config. The web API key is not a secret, but the fallback silently points forks and CI at the production project. Fail loudly when the `VITE_FIREBASE_*` variables are missing.
- **No hosting security headers:** `firebase.json` sets no CSP, `X-Frame-Options`, or similar headers.

---

## 3. Bugs

### B1 🔴 Category filter changes the wrong dish
- **Where:** `src/pages/SpaceScreen.jsx:360` → `src/components/OrderItem.jsx:53` → `src/components/Counter.jsx`.
- **Problem:** `SpaceScreen` passes the **filtered** list (`filteredMenu`) to `OrderItem`. `OrderItem` gives each `Counter` its index within that filtered list (`ind`). But `Counter` reads and writes `state.single.arr[ind]`, which is the **unfiltered** menu.
- **Repro:**
  1. Pick the "Burger Bar" preset.
  2. In the room, choose the **Drinks** tab. It shows only "Vanilla Bean Shake".
  3. Press **+**. The quantity goes to "Classic Cheeseburger", which is `arr[0]`, and the shake counter shows the burger's count.

  With the "All" tab the indexes happen to match, so the bug is easy to miss.
- **Fix:** Key counters by item **id**, not array position. Either pass `arr.indexOf(item)` or, better, change `setQuantity` to take `{ id, quantity }`.

### B2 🟠 Guests never find out the order was finalized
- **Where:** `src/pages/SpaceScreen.jsx:125-138`.
- **Problem:**
  - The space document is fetched once with `getSpaceById`. Only the participants collection has a live listener, so `spaceFinalized` never changes while the page is open.
  - After the host finalizes, guests can keep tapping **+** and **-**. Each tap triggers a Firestore write that the rules reject, and each rejection shows an "Oops…" error popup.
  - The page never switches to a "finalized" state.
- **Fix:** Subscribe to the space document with `onSnapshot`. When `status === "finalized"`, disable the counters and show a link to the receipt. The menu could be live too, so edits made after creation reach guests.

### B3 🟠 "Finalize & Lock Order" shows for any signed-in user
- **Where:** `src/components/spaceScreenInfo/OrderSideInfo.jsx:16`.
- **Problem:** `isAdmin` only checks that *someone* is signed in (`auth.currentUser.uid === adminId`). It never compares against the space's `adminId`.
  - A signed-in host who opens another host's invite link sees the finalize button and "Exit to Dashboard".
  - Clicking finalize fails with a permission error.
- **Fix:** Pass `spaceInfo.adminId` into `OrderSideInfo` and use `isAdmin = auth.currentUser?.uid === spaceInfo.adminId`.

### B4 🟡 Broken footer links and no 404 page
- **Where:** `src/components/Layout.jsx:28` and `src/components/Layout.jsx:31`.
- **Problem:** The footer links to `/about` and `/contact`, but the routes are `/about-us` and `/contact-us`. The navbar has the correct paths. The router also has no catch-all route or `errorElement`, so these links show React Router's default "Unexpected Application Error" screen.
- **Fix:** Correct the paths, and add a `path: "*"` NotFound route plus an `errorElement` on the root route.

### B5 🟡 Currency and locale do not match
- **Where:** `src/utils/formatCurrency.js:3`, `src/pages/FinalizedOrderPage.jsx:226`, `src/pages/FinalizedOrderPage.jsx:241`, and `src/components/FavouriteMenuSection.jsx:38`.
- **Problem:**
  - Every amount is formatted with the `"ar"` locale in EGP, so it renders with Arabic-Indic digits, for example `١٢٫٥٠ ج.م.‏`.
  - Form labels, the favourite-menu preview, the menu presets, and the README all use `$`.
  - The exported WhatsApp or Slack receipt mixes Arabic digits into English text.
- **Fix:**
  1. Store a `currency` on each space. A picker on the create-space form could default from the host's locale.
  2. Format with `navigator.language`, or with an explicit locale.
  3. Cache the `Intl.NumberFormat` instance instead of creating one per call.

### B6 🟡 Favourite menus lose item descriptions
- **Where:** `src/Firebase/api_util.js:262-265`.
- **Problem:** `getFavouriteMenuItemsByAdmin` copies only `name` and `price`. A space created from a favourite therefore has no descriptions or `imageUrl`, which also weakens the keyword-based category filter.
- **Fix:** Copy `description` and `imageUrl` as well.

### B7 ⚪ Receipt merges items that share a name
- **Where:** `src/components/spaceScreenInfo/OrderSideInfo.jsx:82`.
- **Problem:** The collective order is grouped by `itemName`. Two menu entries with the same name and different prices, for example "Latte" in two sizes, merge into one line. Its `pricePerItem` is the first entry's price, although the subtotal is correct.
- **Fix:** Group by the menu item ID.

### B8 ⚪ Dashboard totals are 0 for active rooms
- **Where:** `src/pages/Landing.jsx:137`.
- **Problem:** `total` is written only at finalization, so every active room card shows the currency's zero value.
- **Fix:** Show a participant count or the running total, or hide the amount until the room is finalized.

### B9 ⚪ Money uses floating point
- **Problem:**
  - Prices are stored as strings or floats and summed as floats.
  - The proportional split divides fees by float ratios, so participant shares can add up to a cent more or less than the total.
  - Delivery fee and tip settings are not saved (see F3).
- **Fix:** Store amounts in minor units (integer cents), and give any leftover cent from the split to the largest share.

### Smaller issues
- **Guessed categories:** The category filter guesses from keywords (`src/pages/SpaceScreen.jsx:210-227`). "Mains" includes anything that is not coffee, tea, cake, dessert, or juice, so fries, salads, and shakes appear under both Sides and Mains. Let hosts set a real `category` field per item instead.
- **Signed-in users see the login form at `/`:** The index route `/` renders the sign-in form even for signed-in hosts. Redirect them to `/home`.
- **A Firestore write on every tap:** `saveParticipantOrder` fires on every counter tap (`src/pages/SpaceScreen.jsx:173`). The writes are serialized but not debounced. Debounce them by about 300 ms to cut write costs.
- **"Connected" dot is always green:** In `Participants`, every participant shows a green "Connected" dot. There is no presence tracking (see F7).
- **Menu item IDs stored twice:** The client-side `id: Date.now()` values are written into Firestore menu item documents (`createSpaceWithMenu` spreads the whole item), which is what created the `legacyId` confusion. Strip `id` before writing.
- **React StrictMode is disabled** in `src/main.jsx`. Re-enable it to catch effect bugs.

---

## 4. Codebase health

### H1 🟠 Stale duplicate project committed
- **Problem:** `src/src/` has 68 files. It is an old copy of the app, and `src/` also contains its own `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `eslint.config.js`, `README.md`, and `public/`.
- **Other junk:** `cls` and `src/cls` are pasted `git log` output that includes ANSI color codes.
- **Why it matters:** None of this is used; ESLint already ignores `src/src/**`. It confuses contributors, search results, and IDE auto-imports.
- **Fix:** Delete all of it.

### H2 🟡 Dead code
- **Unused slices and models:**
  - `features/slices/orderReducer.js`, `menuReducer.js`, and `tempReducer.js` are unused. `orderReducer.js` also declares a second slice named `order`, which clashes with `orderSlice.js`.
  - `collectiveOrderReducer` is in the store, but no UI uses it.
  - `Firebase/models.js` is unused, and its `fromFirestore` methods pass arguments the constructors ignore.
- **Unused hooks:** `usePrompt`, `useConfirmNavigation`, `useGoogleAuth`, `useSyncOrderToFirebase` (which writes to an `orders` collection the rules don't allow), and `useConfirmExit .js` (the filename contains a space).
- **Unused components:** `TestDashBoard`, `NavigationPromptWrapper`, `LoginForm`, `components/SignUp`, `Home`, `Pagination`, `TextField`, and `CheckItem`. Several are used only by the dev test page.
- **Unused API methods:** `submitOrder`, `getMyOrder`, `createSpace`, `addMenuItem`, `updateMenuItem`, `getSpaceDetails`, `isInUse`, `updateSpaceName`, `deleteSpace`, and `fetchAdminData`.
- **Unused state:** The `admin` slice's `spaces`, `orders`, `currentOrder`, and `currentSpace` fields are set but never read.
- **Unused dependencies:** `framer-motion` is never imported. `lodash` is used only by a dead hook.
- **Leftovers:**
  - `console.log` calls remain in reducers and the API layer.
  - The `internal-nav` session flag is written but never read.
  - Collection names are misspelled (`menueItems`, `particpant/...` action types). Keep `menueItems` for existing data, but hide the name behind the constant.

### H3 🟡 Dev test page ships to production
`/components-test` is routed in `src/App.jsx:88`. Remove it, or register it only when `import.meta.env.DEV` is true.

### H4 ⚪ Duplicated logic
- **Two auth listeners:** `AuthSessionSync` (`App.jsx:33`) and `RequireAuth` (`RequireAuth.jsx:16`) both subscribe to `onAuthStateChanged` and dispatch the same actions. `AuthSessionSync` also re-subscribes every time `adminId` changes. Keep one listener that stores an `authReady` flag in Redux.
- **Copied demo login:** The demo-login block is copied between `Auth.jsx` and `pages/SignUp.jsx`. It is removed anyway under S1.
- **Scattered room math:** Order aggregation happens in `CollectiveOrder`, `OrderSideInfo`, and `collectiveOrderReducer`, each slightly differently. Move it into one pure, tested helper.
- **Router rebuilt every render:** `createBrowserRouter` is called inside `App()`. Move it to module scope so it runs once.

### H5 🟡 Tests and CI
- **Test coverage:** Only `singlemenu` and `collectiveOrderReducer` have tests. Suggested additions:
  1. Unit tests for the finalize aggregation and the bill split, after extracting them into pure functions.
  2. Firestore rules tests using `@firebase/rules-unit-testing` and the emulator.
  3. One Playwright happy-path test: create a space, join as a guest, pick items, finalize, and view the receipt.
- **CI:** There is no CI. Add a GitHub Actions workflow that runs `npm ci && npm run lint && npm test && npm run build`.

### Dependencies and build
- **Outdated packages:** Everything is within its semver range. Minor updates are available for Firebase 11.10, React 19.3, RTK 2.12, and DaisyUI 5.7. Firebase 12 and React Router 8 are major upgrades to plan separately.
- **Redundant router package:** Both `react-router` and `react-router-dom` are installed, and imports mix the two. On v7, use `react-router` only.
- **Unnecessary font subsets:** `@fontsource/poppins` bundles every subset, including Devanagari. Import the `latin` files only.
- **Large index chunk:** The 296 kB index chunk includes SweetAlert2 and the icons. Consider lazy-loading SweetAlert2 or replacing it with DaisyUI toasts and modals.

---

## 5. Missing features and suggested improvements

### Core product
- **F1. Host space management:** Add delete and archive actions, rename, re-open, and duplicate ("order again"). The API already has `deleteSpace` and `updateSpaceName`, but nothing in the UI uses them.
- **F2. Menu editing after creation:** Let hosts add, edit, remove, or mark items "sold out" in a live room. Guests would see the changes through a live listener (see B2).
- **F3. Saved and shared bill-split settings:** The delivery fee, tip, split mode, and payment handle live only in the host's local React state. Save them on the space so they survive a reload and guests see the same numbers.
- **F4. Guest receipt view:** `/finalized-order/:id` requires sign-in, so guests cannot see what they owe. Add a public read-only receipt, with a "paid" checkbox per participant that the host can tick.
- **F5. Ordering deadline:** Add an optional cut-off time with a countdown that auto-locks the room, plus a host "close for edits" state before finalizing.
- **F6. Item notes and modifiers:** Add a per-item note field, for example "no onions" or "oat milk", included in the kitchen view and the exported receipt.
- **F7. Real presence:** Replace the always-green dot with actual online status, for example through Realtime Database `onDisconnect`. Let the host remove a participant; the rules already allow host deletes.
- **F8. Proper favourite menus:** Favourites are currently whole spaces flagged `isFavourite`, loaded with one query per space. Store them in their own `users/{uid}/menus` collection with edit and delete options, and add a "save this menu as favourite" action after a room is created.
- **F9. Real item categories:** Let hosts choose a category per item (see Smaller issues), and add search for long menus.

### Platform and UX
- **F10. Anonymous auth for guests:** This fixes S2 and S3 and gives each guest a stable identity across tabs and devices.
- **F11. Currency and locale settings, plus internationalization:** There is an Arabic-number utility (`toArabicNumber.js`) and EGP formatting, but the UI copy is English only. Choose one direction and support it fully, including RTL if Arabic is a target.
- **F12. Accessibility:**
  - Add focus trapping and Escape-to-close to the share and username modals.
  - Give `RecentOrder` cards a keyboard-accessible link; right now they are a clickable `div`.
  - Link the `<label>` elements on the finalized page's inputs to those inputs.
  - Check color contrast on the `text-neutral/70` text.
- **F13. PWA and offline:** Add a manifest and service worker so the room can be installed from a QR scan, and turn on Firestore offline persistence.
- **F14. Error boundary and monitoring:** Add a top-level error boundary and hook up the Analytics or Crashlytics setup that is already stubbed in `config.js`.
- **F15. README accuracy:** The README says "Real-time synchronization… zero delay". That holds for participants, but not for the space's status or its menu (see B2). It also describes `$` pricing (see B5). Update it once the fixes land.

---

## 6. Suggested order of work

1. **Now (security and correctness):**
   - S1: remove the demo credentials and rotate the password.
   - B1: key counters by item ID.
   - B3: fix the admin check.
   - B4: fix the footer links and add a 404 route.
2. **Next:**
   - F10: Anonymous Auth, then tighten the participant rules (fixes S2 and S3).
   - B2: live listener on the space document.
   - B5: one currency and locale setting per space.
3. **Cleanup:** H1 and H2 (delete `src/src`, the `cls` files, and dead code and dependencies), H3, and H5 (CI plus rules and aggregation tests).
4. **Features:** F3, F4, F1, and F2 give the most value to hosts and guests. Then F5, F6, and F7.
