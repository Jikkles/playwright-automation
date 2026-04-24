const password = process.env.TEST_PASSWORD ?? 'secret_sauce';

export const credentials = {
  standardUser: {
    username: process.env.STANDARD_USER ?? 'standard_user',
    password,
  },
  lockedOutUser: {
    username: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
    password,
  },
  problemUser: {
    username: process.env.PROBLEM_USER ?? 'problem_user',
    password,
  },
  performanceGlitchUser: {
    username: process.env.PERFORMANCE_GLITCH_USER ?? 'performance_glitch_user',
    password,
  },
  errorUser: {
    username: process.env.ERROR_USER ?? 'error_user',
    password,
  },
  visualUser: {
    username: process.env.VISUAL_USER ?? 'visual_user',
    password,
  },
};
