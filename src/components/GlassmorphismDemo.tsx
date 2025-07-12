// import React from 'react'
import { Dna, Heart, Users, Globe2, Activity } from 'lucide-react'

/**
 * Demo component showcasing the enhanced glassmorphism effects
 * This file demonstrates how to use the new CSS classes defined in App.css
 */
export function GlassmorphismDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Enhanced Glassmorphism Components
        </h1>

        {/* Base Glass Cards */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-200 mb-4">Glass Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Base Glass Card</h3>
              <p className="text-purple-200">Multi-layered glassmorphism with hover effects</p>
            </div>
            
            <div className="glass-iridescent p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Iridescent Glass</h3>
              <p className="text-purple-200">Animated gradient borders with color shifting</p>
            </div>
            
            <div className="glass-neon p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Neon Glow Glass</h3>
              <p className="text-purple-200">Flickering neon effects with vibrant glow</p>
            </div>
          </div>
        </section>

        {/* Deep and Holographic Glass */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-deep p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Deep Glass Panel</h3>
              <p className="text-purple-200 mb-4">
                Ultra-deep glassmorphism with enhanced depth and shadows
              </p>
              <div className="flex gap-3">
                <div className="glass-badge">
                  <Dna className="w-4 h-4" />
                  <span>Genetic</span>
                </div>
                <div className="glass-badge">
                  <Heart className="w-4 h-4" />
                  <span>Health</span>
                </div>
              </div>
            </div>
            
            <div className="glass-holographic p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Holographic Glass</h3>
              <p className="text-purple-200 mb-4">
                Rotating conic gradient with holographic effects
              </p>
              <div className="dna-decorator" />
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-200 mb-4">Interactive Elements</h2>
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Glass Buttons</h4>
                <div className="flex flex-wrap gap-3">
                  <button className="glass-button">
                    Primary Action
                  </button>
                  <button className="glass-button">
                    <Users className="w-4 h-4 mr-2" />
                    With Icon
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Glass Input</h4>
                <input 
                  type="text" 
                  placeholder="Enter your genetic data..." 
                  className="glass-input w-full"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Glass Progress Bar</h4>
              <div className="glass-progress">
                <div className="glass-progress-bar" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* DNA Base Pair Animation Demo */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-200 mb-4">Micro-interactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 dna-base-pair cursor-pointer">
              <Globe2 className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-center text-white">Hover for DNA twist</p>
            </div>
            
            <div className="glass-card p-6 chromosome-element">
              <Activity className="w-12 h-12 text-pink-400 mx-auto mb-3" />
              <p className="text-center text-white">Chromosome wiggle</p>
            </div>
            
            <div className="glass-card p-6 relative overflow-visible">
              <div className="particle-trail" />
              <Heart className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-center text-white">Particle trails</p>
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="glass-deep p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Usage Guide</h2>
          <div className="space-y-4 text-purple-200">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Available Classes:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><code className="text-pink-400">.glass-card</code> - Base glassmorphism card</li>
                <li><code className="text-pink-400">.glass-iridescent</code> - Iridescent borders</li>
                <li><code className="text-pink-400">.glass-neon</code> - Neon glow effects</li>
                <li><code className="text-pink-400">.glass-deep</code> - Deep glass panel</li>
                <li><code className="text-pink-400">.glass-holographic</code> - Holographic effects</li>
                <li><code className="text-pink-400">.glass-button</code> - Interactive button</li>
                <li><code className="text-pink-400">.glass-input</code> - Form input field</li>
                <li><code className="text-pink-400">.glass-progress</code> - Progress bar container</li>
                <li><code className="text-pink-400">.glass-badge</code> - Small badge/chip</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Animation Classes:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><code className="text-pink-400">.dna-base-pair</code> - DNA twist on hover</li>
                <li><code className="text-pink-400">.chromosome-element</code> - Wiggle animation</li>
                <li><code className="text-pink-400">.particle-trail</code> - Floating particles</li>
                <li><code className="text-pink-400">.dna-decorator</code> - DNA flow decorators</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}