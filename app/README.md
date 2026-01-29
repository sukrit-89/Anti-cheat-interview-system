# InterGEN Neural Constellation

A production-grade interview interface that visualizes AI agents as a "Neural Constellation" ecosystem using React, Three.js, and glassmorphic UI design.

## Features

- **3D Neural Constellation**: Five AI agents orbiting in 3D space with reactive scaling and glowing connections
- **Real-time Code Editor**: Monaco Editor with TypeScript support for live coding interviews
- **Video Conference Grid**: WebRTC-style video tiles with participant controls
- **Agent Metrics Panel**: Collapsible sidebar showing real-time agent performance metrics
- **Glassmorphic UI**: Modern translucent interface with backdrop blur effects

## Tech Stack

- React 18+ with TypeScript
- Three.js via React Three Fiber (R3F) + React Three Drei
- Tailwind CSS for styling
- Framer Motion for animations
- Monaco Editor for code editing
- Lucide React for icons

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

### Layered Stack (z-index separation)

1. **BACKGROUND (z-0)**: R3F Canvas with WebGL context
   - Dark gradient base (#0f172a to #1e293b)
   - Floating particle field (instanced mesh, 200 particles)
   - Ambient fog for depth

2. **MIDDLE (z-10)**: 3D Agent Constellation
   - 5 orbital AI agents with unique shapes and colors
   - Each agent orbits at different speeds with vertical bobbing
   - Reactive scaling (0.5x to 2x) based on mock activity data
   - Glowing connection lines between agents

3. **FOREGROUND (z-50)**: Glassmorphic UI Overlay
   - Logo, Monaco Editor, Video Grid, Agent Sidebar, Status Bar

## Performance Optimizations

### Critical Constraints Implemented

1. **R3F Canvas dpr**: Limited to [1, 1.5] (not 2) to reduce GPU load
2. **Antialias disabled**: WebGLRenderer runs without antialiasing
3. **Instanced mesh**: Particle field uses single instanced mesh (200 particles)
4. **Frame rate limiting**: R3F capped at 60fps
5. **Lazy loading**: Monaco Editor loaded on demand
6. **MeshBasicMaterial**: All 3D materials use simple materials (no PBR)

### Additional Optimizations

- **useMemo**: Geometry and particle data cached
- **useCallback**: Event handlers memoized
- **requestAnimationFrame**: Smooth data interpolation
- **Throttled mouse tracking**: Mouse parallax updates at ~60fps
- **Suspense + lazy**: 3D components code-split

## Agent Configuration

| Agent | Color | Shape | Orbit Radius | Speed |
|-------|-------|-------|--------------|-------|
| CodingAgent | Cyan (#00d4ff) | Wireframe Box | 3 | 0.5 |
| SpeechAgent | Pink (#ff006e) | Sphere | 4 | 0.35 |
| VisionAgent | Orange (#fb5607) | Icosahedron | 5 | 0.25 |
| ReasoningAgent | Purple (#8338ec) | Torus Knot | 6 | 0.15 |
| EvaluationAgent | Gold (#ffbe0b) | Octahedron | Center | 0 |

## Responsive Design

- **Desktop**: Full 3D constellation visible
- **Tablet**: Simplified 3D, collapsible sidebar
- **Mobile**: 3D disabled, static gradient background

## Accessibility

- `aria-live` region for agent status updates
- Keyboard navigation (Tab cycles through interactive elements)
- Reduced motion support (disables 3D rotation and parallax)
- Color contrast minimum 4.5:1 for all text
- Focus-visible styles for keyboard users

## Mock Data

Agent state cycles every 3 seconds with smooth interpolation:

```typescript
interface AgentState {
  coding: { score: number; status: 'analyzing' | 'idle'; complexity: number };
  speech: { clarity: number; pace: number; fillerWords: number };
  vision: { eyeContact: number; posture: 'good' | 'poor'; confidence: number };
  reasoning: { depth: number; approach: 'optimal' | 'suboptimal'; steps: number };
  evaluation: { overall: number; recommendation: 'strong_hire' | 'hire' | 'reject' };
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- WebKit browsers fully supported for glassmorphism effects

## License

MIT
