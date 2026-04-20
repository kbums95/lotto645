# Lotto 6/45 Application Blueprint

## Overview
A modern, interactive web application to generate and manage Lotto 6/45 numbers. The application focuses on a high-quality user experience with responsive design, modern CSS features, and interactive Web Components.

## Project Details & Design
- **Architecture:** Framework-less web application using Vanilla HTML, CSS, and JavaScript.
- **Components:** Custom Web Components (e.g., `<lotto-ball>`) for modularity and encapsulation.
- **Styling:** 
    - Modern CSS features: Container Queries, Cascade Layers, `:has()` selector, Logical Properties.
    - Vibrant color palette using `oklch` for perceptual uniformity.
    - Glassmorphism effects, multi-layered shadows, and subtle background textures.
    - Responsive layout (mobile-first).
- **Interactivity:** Smooth animations and feedback for number generation.
- **Accessibility:** Adheres to A11Y standards for inclusive access.

## Current State: Multi-Set Gravity Reveal
The application now generates 5 sets of Lotto numbers with a high-impact "Gravity Drop" animation.

### Implemented Features
- **Multi-Set Generation:** Generates 5 rows of 6 unique numbers (1-45).
- **Gravity Drop Animation:** Balls fall from above with a bounce effect, staggered by row and individual ball index.
- **Row Completion Effect:** Rows highlight with a subtle glow and background shift once all balls in the set have landed.
- **Responsive Design:** Balls and rows scale down for mobile devices to ensure a clean 5-row layout.
- **Interactive Controls:** "Generate" button is disabled during animation to prevent state conflicts, with a smooth exit animation for old results.

## Next Steps
- **History Tracking:** Persist generated numbers to `localStorage`.
- **Manual Selection:** Allow users to "pin" numbers they want to keep.
