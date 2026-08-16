// 700ms Luxury Automobile Showroom Transition Animations

export const TRANSITION_DURATION = 0.7; // 700ms in seconds

export const vehicleViewerVariants = {
  initial: {
    opacity: 0,
    scale: 0.88,
    y: 15,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: TRANSITION_DURATION,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for smooth luxury ease
    },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: -15,
    transition: {
      duration: TRANSITION_DURATION * 0.8,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

export const categoryTabVariants = {
  active: {
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  inactive: {
    scale: 0.96,
  },
};
