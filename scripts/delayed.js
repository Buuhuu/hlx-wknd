// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadCSS } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here