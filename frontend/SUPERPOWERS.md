# 🔥 FRONTEND SUPERPOWERS GUIDE

## What's Installed:

### 1. **Layout & Structure System** 📐
**File:** `src/lib/utils.ts`

Perfect spacing, typography, and layout utilities:

```tsx
import { layout, typography, components } from './lib/utils'

// Perfect containers
<div className={layout.container.lg}>  // max-w-7xl mx-auto px-6
<div className={layout.container.xl}>  // max-w-[1400px]

// Section spacing
<section className={layout.section.md}>  // py-24
<section className={layout.section.lg}>  // py-32

// Perfect grids
<div className={layout.grid.cols3}>  // 1 col mobile, 2 tablet, 3 desktop
<div className={layout.grid.cols4}>  // Responsive 4-column grid

// Typography
<h1 className={typography.h1}>  // text-5xl md:text-6xl lg:text-7xl
<p className={typography.lead}>   // text-xl md:text-2xl text-gray-400

// Components
<button className={components.button.primary}>
<div className={components.card.base}>
<input className={components.input}>
```

---

### 2. **GSAP Professional Animations** 🎬
**File:** `src/lib/gsap-utils.ts`

Scroll-triggered animations like award-winning sites:

```tsx
import { useGSAPScrollAnimation, gsapAnimations } from './lib/gsap-utils'

// Fade in on scroll
const ref = useGSAPScrollAnimation((el) => gsapAnimations.fadeInUp(el))
<div ref={ref}>Content fades in</div>

// Stagger children (for lists)
const gridRef = useGSAPScrollAnimation((el) => gsapAnimations.staggerChildren(el))
<div ref={gridRef}>
  <div>Item 1</div>  {/* Animates with 0.1s delay */}
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Number counter
const counterRef = useGSAPScrollAnimation((el) => gsapAnimations.numberCounter(el, 1247))
<div ref={counterRef}>0</div>  {/* Counts to 1247 */}

// Parallax effect
import { useParallax } from './lib/gsap-utils'
const parallaxRef = useParallax(0.5)
<div ref={parallaxRef}>Moves slower on scroll</div>
```

---

### 3. **Aceternity-Style Components** ✨

#### **BentoGrid** (Apple-style grid layout)
```tsx
import { BentoGrid, BentoGridItem } from './components/ui/BentoGrid'

<BentoGrid>
  <BentoGridItem
    title="Yield Optimizer"
    description="AI-powered yield allocation"
    icon={<span>📈</span>}
    className="md:col-span-2"  // Takes 2 columns
  />
  <BentoGridItem title="Feature 2" />
</BentoGrid>
```

#### **Animated Cards** (Hover effects + glow)
```tsx
import { AnimatedCard, GlowCard, TiltCard } from './components/ui/AnimatedCard'

// Card with animated border
<AnimatedCard>
  <h3>Content</h3>
  {/* Lifts + glowing border on hover */}
</AnimatedCard>

// Card with glow effect
<GlowCard glowColor="rgba(168, 85, 247, 0.4)">
  <h3>Glowing!</h3>
</GlowCard>

// 3D tilt effect
<TiltCard>
  <h3>Tilts in 3D!</h3>
</TiltCard>
```

#### **Background Effects**
```tsx
import { GridBackground, DotBackground, Spotlight } from './components/ui/GridBackground'

// Animated grid background
<GridBackground>
  <YourContent />
</GridBackground>

// Dot pattern
<DotBackground dotSize={2} spacing={30}>
  <YourContent />
</DotBackground>

// Spotlight effect (like Apple)
<div className="relative">
  <Spotlight className="-top-40 left-0 md:left-60" />
  <YourContent />
</div>
```

#### **Text Effects**
```tsx
import { TextGradient, TextShine, TextReveal } from './components/ui/TextGradient'

// Animated gradient text
<TextGradient animated>
  Payment Orchestration
</TextGradient>

// Shimmering text
<TextShine>Amazing Feature</TextShine>

// Letter-by-letter reveal
<TextReveal delay={0.5}>
  This appears letter by letter
</TextReveal>
```

---

### 4. **Framer Motion Presets** 🎭
**File:** `src/lib/utils.ts`

```tsx
import { animations, viewport } from './lib/utils'

// Fade in
<motion.div
  initial={animations.fadeIn.initial}
  animate={animations.fadeIn.animate}
  transition={animations.fadeIn.transition}
>

// Stagger children
<motion.div
  variants={animations.stagger.container}
  initial="hidden"
  animate="show"
>
  <motion.div variants={animations.stagger.item}>Item 1</motion.div>
  <motion.div variants={animations.stagger.item}>Item 2</motion.div>
</motion.div>

// Scroll-triggered
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={viewport.once}
>
```

---

### 5. **Class Utility (cn)** 🎨
Merge classes intelligently (handles Tailwind conflicts):

```tsx
import { cn } from './lib/utils'

<div className={cn(
  'bg-gray-900 p-4',
  isActive && 'bg-purple-500',
  'hover:scale-105'
)}>
```

---

## 🎯 QUICK START EXAMPLES:

### Create a Perfect Section:
```tsx
import { layout, typography } from './lib/utils'
import { AnimatedCard } from './components/ui/AnimatedCard'

<section className={`${layout.container.lg} ${layout.section.md}`}>
  <h2 className={typography.h2}>Features</h2>
  <p className={typography.lead}>Description here</p>
  
  <div className={`${layout.grid.cols3} ${layout.gap.lg} mt-12`}>
    {features.map(f => (
      <AnimatedCard key={f.id}>
        <h3>{f.title}</h3>
      </AnimatedCard>
    ))}
  </div>
</section>
```

### Add Scroll Animation:
```tsx
import { useGSAPScrollAnimation, gsapAnimations } from './lib/gsap-utils'

const ref = useGSAPScrollAnimation((el) => gsapAnimations.fadeInUp(el))

<div ref={ref} className="content">
  Fades in when scrolled into view
</div>
```

### Create Hero with Effects:
```tsx
import { GridBackground, Spotlight } from './components/ui/GridBackground'
import { TextGradient } from './components/ui/TextGradient'

<GridBackground>
  <Spotlight className="-top-40 left-0" />
  
  <h1>
    <TextGradient animated>
      Your Headline
    </TextGradient>
  </h1>
</GridBackground>
```

---

## 🚀 WHAT YOU CAN DO NOW:

✅ **Perfect Layouts** - No more guessing spacing  
✅ **Scroll Animations** - GSAP-powered like Stripe/Apple  
✅ **Animated Cards** - Hover effects + glow  
✅ **Bento Grids** - Apple-style layouts  
✅ **Text Effects** - Gradients, shine, reveals  
✅ **Background Effects** - Grid, dots, spotlight  
✅ **Smart Class Merging** - No Tailwind conflicts  
✅ **Motion Presets** - Framer Motion shortcuts  

---

## 📝 BEST PRACTICES:

1. **Use layout utilities** for consistency
2. **Use typography presets** for perfect text
3. **Wrap sections** in proper containers
4. **Add scroll animations** to important elements
5. **Use AnimatedCard** for interactive elements
6. **Add backgrounds** for depth

Your frontend will now look PROFESSIONAL by default! 🔥
