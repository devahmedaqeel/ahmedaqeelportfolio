/* ============================================================
   3-BAND STACK NETWORK — Full Document Background Config.
   Spans document top-to-bottom: Client (cyan), Service (blue), Model (violet).
   ============================================================ */

window.STACK_NETWORK_CONFIG = {
  dprCap: 2,
  targetFps: 30,
  idleTimeoutMs: 30000,

  // Node density scaling per 1000px document height
  nodesPerThousandPx: 9,
  maxNodesDesktop: 140,
  maxNodesMobile: 45,
  mobileBreakpoint: 768,

  // Spatial Index cell size (px)
  spatialCellSize: 180,
  cullMarginPx: 200,

  // Band document height ranges & overlaps
  bands: {
    client: {
      range: [0.0, 0.30],
      shape: "square",
      color: [0, 240, 255], // Cyan
      connectDist: 170,
      parallaxRate: 0.92,
      style: "orthogonal"
    },
    service: {
      range: [0.28, 0.65],
      shape: "diamond",
      color: [59, 130, 246], // Blue
      connectDist: 150,
      parallaxRate: 1.0,
      style: "dashed"
    },
    model: {
      range: [0.62, 1.00],
      shape: "circle",
      color: [168, 85, 247], // Violet
      connectDist: 140,
      parallaxRate: 1.08,
      style: "weighted"
    }
  },

  // Section density multipliers
  sectionDensities: {
    hero: 1.0,
    skills: 0.45,
    services: 0.45,
    projects: 0.6,
    contact: 0.75,
    footer: 0.75,
    default: 0.5
  },

  // Pulse & Attention Arc parameters
  pulse: {
    speedPxPerSec: 280,
    maxTrailPx: 24
  },

  arc: {
    marginPx: 300,
    maxRadiusPx: 260
  },

  resizeDebounceMs: 150
};
