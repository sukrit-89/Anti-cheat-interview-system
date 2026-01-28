# AI Interview Platform - Figma Design System

Complete design specification for production-grade UI/UX implementation.

---

## Design Philosophy
- **Futuristic aesthetic**: Dark theme with purple/pink gradients
- **Glassmorphism**: Translucent cards with blur effects
- **3D elements**: Floating geometric shapes, particle effects
- **Professional**: Enterprise-ready, clean, minimal
- **Engaging**: Smooth animations, interactive elements

---

## Color Palette

### Primary Colors
```
Background:  #030712 (Gray 950)
Surface:     #111827 (Gray 900)
Purple:      #8B5CF6 (Primary action)
Pink:        #EC4899 (Accent)
```

### Gradients
- **Primary**: `linear-gradient(to right, #c084fc, #ec4899, #a855f7)`
- **Background**: `radial-gradient(circle, rgba(88, 28, 135, 0.2), #030712)`
- **Button**: `linear-gradient(to right, #7c3aed, #db2777)`

### Status Colors
```css
Success/Live:    #4ADE80 (Green 400)
Scheduled:       #60A5FA (Blue 400)
Error:           #F87171 (Red 400)
Completed:       #9CA3AF (Gray 400)
```

### Opacity Levels
```
Glass Background:  rgba(255, 255, 255, 0.05)
Glass Border:      rgba(255, 255, 255, 0.1)
Text Secondary:    rgba(255, 255, 255, 0.6)
Text Tertiary:     rgba(255, 255, 255, 0.4)
```

---

## Typography

### Font Stack
```css
Primary:  'Inter', -apple-system, system-ui, sans-serif
Code:     'JetBrains Mono', 'Fira Code', monospace
```

### Text Sizes
```
Hero H1:         96px / 6rem / font-bold
Page H1:         48px / 3rem / font-bold
Section H2:      40px / 2.5rem / font-semibold
Card Title:      24px / 1.5rem / font-semibold
Body Large:      20px / 1.25rem / font-normal
Body:            16px / 1rem / font-normal
Small:           14px / 0.875rem / font-normal
Caption:         12px / 0.75rem / font-normal
```

---

## Spacing System

```
4px   = 0.25rem  (Tiny)
8px   = 0.5rem   (Small)
16px  = 1rem     (Default)
24px  = 1.5rem   (Medium)
32px  = 2rem     (Large)
48px  = 3rem     (XL)
64px  = 4rem     (Section)
```

---

## Component Specs

### Glassmorphic Card
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
padding: 24px;

/* Hover */
border-color: rgba(139, 92, 246, 0.5);
transform: scale(1.01);
```

### Primary Button
```css
background: linear-gradient(to right, #7c3aed, #db2777);
color: white;
font-size: 16px;
font-weight: 600;
padding: 12px 24px;
border-radius: 8px;
box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);

/* Hover */
filter: brightness(1.1);
transform: scale(1.02);

/* Active */
transform: scale(0.98);
```

### Input Field
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 8px;
padding: 12px 16px;
color: white;

/* Focus */
border-color: #8B5CF6;
outline: 2px solid #8B5CF6;
```

---

## Layout Specifications

### Grid System
- Container: max-width 1280px, centered
- Columns: 12-column grid
- Gutters: 24px
- Margins: 64px (desktop), 24px (mobile)

### Breakpoints
```
Mobile:   320px - 767px
Tablet:   768px - 1023px
Desktop:  1024px+
```

---

## Page Layouts

### Landing Page
1. **Navigation** (h: 64px)
   - Logo + Nav items + CTA buttons
   - Glass background with blur

2. **Hero** (h: 90vh)
   - 3D floating shapes background
   - Center: Badge → H1 → Subtitle → CTAs → Stats
   
3. **Features** (6 cards, 3-col grid)
   - Icon (48px) + Title + Description
   
4. **CTA Section**
   - Large card, centered content

5. **Footer**
   - Copyright text

### Dashboard Pages
1. **Navigation** (same as landing)
2. **Page Header**
   - Title + Subtitle (left)
   - Action button (right)
3. **Stats Grid** (4 columns)
4. **Content Cards** (list/grid)

### Interview Room
1. **Top Bar** (h: 64px)
   - Session info (left) + Controls (right)
2. **Main Layout**
   - Sidebar (320px): Video + Metrics
   - Main (flex-1): Code Editor
3. **Status Bar** (h: 48px)
   - Session code + Duration

---

## Animations

### Card Entry
```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: fadeSlideUp 0.8s ease;
```

### Hover Effects
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: scale(1.01);
```

### Stagger Delay
```
First card:  delay 0s
Second:      delay 0.1s
Third:       delay 0.2s
```

---

## 3D Elements

### Floating Shapes (React Three Fiber)
```jsx
<Float speed={2} rotationIntensity={0.5}>
  <mesh>
    <torusKnotGeometry args={[1, 0.3, 128, 16]} />
    <meshStandardMaterial
      color="#8B5CF6"
      metalness={0.8}
      roughness={0.2}
    />
  </mesh>
</Float>
```

### Particles
- Count: 2000
- Size: 0.02
- Color: #8B5CF6
- Opacity: 0.6
- Slow rotation

---

## Design Tokens (Tailwind Config)

```js
colors: {
  purple: { 400: '#c084fc', 500: '#a855f7', 600: '#7c3aed' },
  pink: { 400: '#f472b6', 500: '#ec4899', 600: '#db2777' },
  gray: { 900: '#111827', 950: '#030712' },
}

borderRadius: {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
}

boxShadow: {
  card: '0 8px 32px rgba(0, 0, 0, 0.3)',
  hover: '0 12px 48px rgba(139, 92, 246, 0.2)',
  button: '0 4px 16px rgba(124, 58, 237, 0.3)',
}
```

---

## Accessibility

✓ Contrast ratio minimum 4.5:1
✓ Focus states with 2px purple ring
✓ Touch targets minimum 44×44px
✓ Alt text for all images/icons
✓ Keyboard navigation support
✓ ARIA labels where needed

---

## Figma Workflow

1. **Create Frame**: 1440×900 (Desktop), 375×812 (Mobile)
2. **Set Grid**: 12 columns, 24px gutters
3. **Create Components**: Cards, Buttons, Inputs
4. **Use Auto Layout**: For responsive components
5. **Create Variants**: Button states, card types
6. **Export Assets**: @2x PNG, SVG for icons

---

**Status**: ✅ All designs implemented in Next.js frontend
**Location**: `/frontend/src/` components match this spec
**Live Preview**: http://localhost:3000
