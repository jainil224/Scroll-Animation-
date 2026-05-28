# 🌌 Step Into Wonder: Immersive Parallax Landing Page

Step Into Wonder is a single-page, highly cinematic, immersive parallax landing page built using **React (v19)**, **TypeScript**, **Tailwind CSS**, and **Vite**. 

The entire experience lives in a single-file implementation inside `src/App.tsx`, leveraging a direct-DOM high-performance animation engine to achieve a flawless **60fps interactive experience** across all device viewports.

👉 **GitHub Repository**: [https://github.com/jainil224/Scroll-Animation-](https://github.com/jainil224/Scroll-Animation-)

---

## 📸 Core Features & Design Aesthetics

1. **Direct-DOM Parallax Engine**:
   To bypass React's Virtual DOM reconciliation overhead during high-frequency mouse movements and rapid scrolling, all translation, scaling, and opacity properties are mutated directly on DOM elements inside a passive `requestAnimationFrame` render loop.

2. **Cinematic Responsive UI Scenes**:
   * **Scene 1 (Fall into Reverie)**: Centered hero titles, slider dots indicators, and floating interactive glassmorphism cards. Layouts dynamically rearrange across mobile, tablet, and desktop breakpoints.
   * **Scene 2 (Forge Beyond the Real)**: Dynamic header titles and the radial sweeping arc card slider floating elegantly over mountains.
   * **Scroll Cue**: A floating indicator animating with a smooth keyframe translation.

3. **Radial Arc Card Slider**:
   Renders 9 pastel-colored cards along a curved mathematical radial path. The cards sweep, rotate, and align dynamically as the user scrolls between `70%` and `100%` scroll progress.
   * **Clipping Protection**: The container is configured with `overflow: 'visible'` and `zIndex: 11` to float cards beautifully in front of the background scenery without any edge clipping.

4. **Curtains Mount Animate**:
   Rocky curtain overlays slide in smoothly from the outer viewport edges (`translateX(-100%)` and `translateX(100%)`) on load, settling into position at `translateX(0%)` to frame the portal opening, and then pull outward as you scroll down.

5. **Signature Branding Capsule**:
   A floating `"MADE WITH ♥ BY JAINIL PATEL"` pill signature set in the bottom-right corner, crafted with a blur backdrop and subtle drop shadow to guarantee 100% text legibility under any textured background pattern.

---

## 📐 Mathematical Layout Setup

### Parallax & Smoothing
* **Eased Scroll Progress (`ep`)**:
  Computes normalized scroll percentage and applies a **Quadratic Ease-In-Out** curve:
  $$t < 0.5 ? 2t^2 : -1 + (4 - 2t)t$$
* **Mouse Damping**:
  Dampens mouse X and Y coordinates smoothly with a standard interpolation speed factor of `0.07`:
  $$current += (target - current) \times 0.07$$

### Radial Slider Coordinate Formulas
For each card $i$ from 0 to 8:
* **Sweep Angle ($deg$)**:
  $$deg = baseDeg - rotationOffset + (centerIndex \times cardSpacingDeg)$$
* **Viewport Placement ($x, y$)**:
  $$x = \sin(rad) \times arcRadius$$
  $$y = arcRadius - \cos(rad) \times arcRadius$$
* **DOM Positioning**:
  ```ts
  bottom = -y + offset
  left = calc(50% + x - cardWidth / 2)
  transform = rotate(deg)
  transformOrigin = (cardWidth / 2)px (arcRadius)px
  ```

---

## 🛠️ Technology Stack

* **Core**: React 19, TypeScript
* **Styling**: Tailwind CSS (for layout breakpoints) & Inline React `CSSProperties`
* **Build System**: Vite, PostCSS, Autoprefixer
* **Typography**: Google Fonts loaded via preconnect link tags:
  * **Viaoda Libre** (Headings)
  * **Imprima** (Body Text & Signature)

---

## 🚀 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jainil224/Scroll-Animation-.git
   cd Scroll-Animation-
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Compile a production build**:
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author

**Jainil Patel**
* Made with love, code, and math.
* Repository: [https://github.com/jainil224/Scroll-Animation-](https://github.com/jainil224/Scroll-Animation-)
