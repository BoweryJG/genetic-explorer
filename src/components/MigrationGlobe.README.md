# MigrationGlobe Component

An interactive 3D globe visualization showing ancestry migration patterns throughout history.

## Features

### 1. **3D Interactive Globe**
- Powered by react-globe.gl with Three.js
- Auto-rotating globe with smooth camera controls
- Night-themed earth texture for elegant dark theme
- Starry background for immersive experience

### 2. **Animated Migration Paths**
- Arc animations showing historical migration routes
- Different colors for each ancestry type:
  - Ashkenazi Jewish: Purple (#8B5CF6)
  - Italian: Green (#10B981)
  - Eastern European: Amber (#F59E0B)
- Animated dashed lines with customizable stroke width
- Paths highlight when ancestry is selected

### 3. **Timeline Slider**
- Interactive timeline from 1000 BCE to 2020 CE
- Play/pause animation functionality
- Real-time filtering of migration paths based on historical period
- Timeline events display showing major historical migrations
- Smooth animations when dragging or auto-playing

### 4. **Clickable Countries**
- Interactive country markers sized by population
- Click to view detailed information:
  - Country name and population
  - Associated ancestries
  - Population density
- Visual highlighting based on selected ancestry

### 5. **Population Density Heat Maps**
- Adjustable heat map intensity
- Visual representation of population density
- Dynamic updates based on selected filters

### 6. **Dark Theme Integration**
- Seamless integration with app's dark aesthetic
- Glassmorphism effects on UI panels
- Purple accent colors matching the app theme
- High contrast for excellent readability

### 7. **User Ancestry Integration**
- Automatically calculates percentages from user's genetic data
- Highlights relevant migration paths for user's ancestry
- Dynamic legend showing ancestry composition

### 8. **Smooth Animations and Transitions**
- Fluid arc animations for migration paths
- Smooth camera transitions
- Animated timeline playback
- Hover effects on interactive elements

## Usage

```tsx
<MigrationGlobe
  segments={segments}
  selectedAncestry={selectedAncestry}
  onCountryClick={(country) => {
    console.log('Country clicked:', country)
  }}
/>
```

## Props

- `segments`: Array of AncestrySegment data from user's genetic information
- `selectedAncestry`: Currently selected ancestry to highlight (optional)
- `onCountryClick`: Callback function when a country is clicked (optional)

## Historical Data

The component includes pre-configured migration data for:
- Ashkenazi Jewish migrations (Levant → Rome → Central Europe → Eastern Europe)
- Italian migrations (Greek colonization, Celtic migrations, Germanic invasions)
- Eastern European migrations (Slavic expansion, Magyar settlement, Mongol invasions)

## Interactive Controls

1. **Timeline**: Drag to explore different historical periods
2. **Play Animation**: Auto-play through history
3. **Population Density**: Adjust heat map intensity
4. **Country Selection**: Click countries for details
5. **Ancestry Filter**: Click legend items to filter

## Performance Optimizations

- Efficient rendering with Three.js
- Memoized calculations for ancestry percentages
- Conditional rendering of migration paths
- Optimized animation loops