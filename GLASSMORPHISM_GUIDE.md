# Enhanced Glassmorphism UI Guide

## Overview
This guide documents the enhanced glassmorphism effects and how to use them in the Genetic Explorer app.

## Color Palette

The following CSS variables are available in `:root`:

```css
--deep-space-black: #0A0A0F;
--cosmic-black: #050508;
--bioluminescent-blue: #00D9FF;
--electric-blue: #0099FF;
--genetic-purple: #8B5CF6;
--royal-purple: #6B46C1;
--helix-pink: #EC4899;
--hot-pink: #FF0080;
--phosphorescent-green: #10B981;
--emerald-green: #059669;
--aurora-cyan: #06B6D4;
--nebula-indigo: #4F46E5;
--stellar-white: #F9FAFB;
--glass-white: rgba(255, 255, 255, 0.08);
--glass-border: rgba(255, 255, 255, 0.15);
--neon-glow: rgba(0, 217, 255, 0.5);
```

## Glass Card Variants

### 1. Base Glass Card
```jsx
<div className="glass-card p-6">
  <h3>Your content here</h3>
</div>
```
- Multi-layered glassmorphism effect
- Hover animation with shimmer effect
- Enhanced depth through shadows

### 2. Iridescent Glass
```jsx
<div className="glass-iridescent p-6">
  <h3>Your content here</h3>
</div>
```
- Animated gradient borders
- Color-shifting background
- Perfect for highlighting special content

### 3. Neon Glow Glass
```jsx
<div className="glass-neon p-6">
  <h3>Your content here</h3>
</div>
```
- Flickering neon border effect
- Vibrant glow animation
- Great for CTAs and important sections

### 4. Deep Glass Panel
```jsx
<div className="glass-deep p-8">
  <h3>Your content here</h3>
</div>
```
- Maximum depth and blur
- Enhanced contrast
- Ideal for main content areas

### 5. Holographic Glass
```jsx
<div className="glass-holographic p-8">
  <h3>Your content here</h3>
</div>
```
- Rotating conic gradient overlay
- Holographic rainbow effect
- Perfect for futuristic elements

## Interactive Components

### Glass Button
```jsx
<button className="glass-button">
  Click Me
</button>
```
- Ripple effect on hover
- 3D transform on click
- Neon glow on focus

### Glass Input
```jsx
<input 
  type="text" 
  className="glass-input" 
  placeholder="Enter data..."
/>
```
- Subtle glassmorphism
- Purple glow on focus
- Smooth transitions

### Glass Progress Bar
```jsx
<div className="glass-progress">
  <div className="glass-progress-bar" style={{ width: '60%' }} />
</div>
```
- Animated gradient fill
- Glowing progress indicator
- Smooth width transitions

### Glass Badge
```jsx
<div className="glass-badge">
  <Dna className="w-4 h-4" />
  <span>Genetic</span>
</div>
```
- Compact glassmorphism chip
- Hover glow effect
- Perfect for tags and labels

## Animation Classes

### DNA Base Pair Animation
```jsx
<div className="dna-base-pair">
  <YourIcon />
</div>
```
- 360° rotation on hover
- Scale transformation
- DNA twist effect

### Chromosome Wiggle
```jsx
<div className="chromosome-element">
  <YourContent />
</div>
```
- Continuous wiggle animation
- Pauses on hover
- Subtle movement effect

### Particle Trail
```jsx
<div className="particle-trail" />
```
- Floating particle animation
- Glowing trail effect
- Automatic movement

### DNA Decorator
```jsx
<div className="glass-card">
  <div className="dna-decorator" />
  <YourContent />
</div>
```
- Flowing DNA strands on sides
- Continuous animation
- Adds genetic theme to any container

## Floating Particles

To add floating particles to your app:

```jsx
import { FloatingParticles } from './components/FloatingParticles'

function App() {
  return (
    <>
      <FloatingParticles />
      {/* Your app content */}
    </>
  )
}
```

## Utility Classes

### Glass Shimmer
```jsx
<div className="glass-card glass-shimmer">
  <YourContent />
</div>
```
- Adds shimmer effect on hover
- Works with any glass variant
- Subtle light reflection

## Best Practices

1. **Performance**: Use `glass-deep` sparingly as it has the heaviest blur effect
2. **Accessibility**: Ensure sufficient contrast for text on glass backgrounds
3. **Mobile**: Glass effects are automatically reduced on mobile for performance
4. **Reduced Motion**: All animations respect `prefers-reduced-motion`

## Example Integration

```jsx
<div className="glass-deep p-8">
  <div className="dna-decorator" />
  
  <h2 className="text-2xl font-bold text-white mb-4">
    Genetic Analysis
  </h2>
  
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="glass-card p-4">
      <div className="chromosome-element">
        <Dna className="w-8 h-8 text-purple-400" />
      </div>
      <p className="text-purple-200">DNA Markers</p>
    </div>
    
    <div className="glass-iridescent p-4">
      <Heart className="w-8 h-8 text-pink-400 dna-base-pair" />
      <p className="text-purple-200">Health Traits</p>
    </div>
  </div>
  
  <button className="glass-button w-full">
    View Full Report
  </button>
</div>
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with -webkit- prefixes)
- Mobile browsers: Reduced effects for performance

## Customization

You can customize any glass effect by modifying the CSS variables or creating new variants in `App.css`. The modular structure makes it easy to create new glass effects while maintaining consistency.