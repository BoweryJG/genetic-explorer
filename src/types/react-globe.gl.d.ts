declare module 'react-globe.gl' {
  import { FC } from 'react'
  
  interface GlobeProps {
    globeImageUrl?: string
    backgroundImageUrl?: string
    
    // Arc layer
    arcsData?: any[]
    arcStartLat?: (d: any) => number
    arcStartLng?: (d: any) => number
    arcEndLat?: (d: any) => number
    arcEndLng?: (d: any) => number
    arcColor?: (d: any) => string
    arcDashLength?: number
    arcDashGap?: number
    arcDashAnimateTime?: number
    arcStroke?: (d: any) => number
    
    // Points layer
    pointsData?: any[]
    pointLat?: (d: any) => number
    pointLng?: (d: any) => number
    pointColor?: (d: any) => string
    pointAltitude?: number
    pointRadius?: (d: any) => number
    pointLabel?: (d: any) => string
    onPointClick?: (point: any) => void
    
    // Heatmap layer
    heatmapsData?: any[]
    heatmapPointLat?: (d: any) => number
    heatmapPointLng?: (d: any) => number
    heatmapPointWeight?: (d: any) => number
    heatmapTopAltitude?: number
    heatmapsTransitionDuration?: number
    
    // Camera
    pointOfView?: { lat: number; lng: number; altitude: number }
    
    // Controls
    controls?: () => any
  }
  
  const Globe: FC<GlobeProps>
  export default Globe
}