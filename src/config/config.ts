const config = {
  MOBILE_BREAKPOINT: 800,
  DEFAULT_DIMENSIONS: { width: 150, height: 150 },
  POINT_OPTIONS: [5, 10],
  ANT_OPTIONS: [1, 5],
  ITERATION_OPTIONS: [1, 3, 10],
  SPEED_OPTIONS: [
    { name: "1", value: 100 },
    { name: "10", value: 10 },
    { name: "100", value: 1 },
  ],
  DEFAULT_SPEED: 10,
  GRID_BACKGROUND: `
  repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 2px, transparent 2px, transparent 40px),
  repeating-linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 2px, transparent 2px, transparent 40px)
`,
  DEFAULT_ANT_COLONY_OPTIONS: {
    alpha: 1,
    beta: 5,
    evaporationRate: 0.5,
    Q: 100,
    numAnts: 5,
    numIterations: 1,
  },
  DEFAULT_MARGINS: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  MARGINS_WITH_POINTS: {
    top: 40,
    bottom: 10,
    left: 15,
    right: 15,
  },
  DEFAULT_THEME_INDEX: 2,
  DEFAULT_ALGORITHM_INDEX: 0,
};

export default config;
