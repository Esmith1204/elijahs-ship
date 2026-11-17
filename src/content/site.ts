/** Site-wide copy and links. Edit here, not in components. */

export const site = {
  name: 'Elijah Smith',
  wordmark: "Elijah's Ship",
  role: 'Product Designer',
  url: 'https://elijahsship.com',
  email: 'elijahiya1204@gmail.com',
  title: 'Elijah Smith: Product Designer @ UC Irvine',
  description:
    'Elijah Smith is a product designer at UC Irvine who designs in Figma and builds what he designs in React.',
  /**
   * Site look, on every page. 'blue' = sky and deep water with white text
   * and buttons. 'light' = the original off-white page.
   */
  theme: 'blue' as 'blue' | 'light',
  links: {
    linkedin: 'https://www.linkedin.com/in/elijah-smith-71319429a/',
    github: 'https://github.com/Esmith1204',
    instagram: 'https://www.instagram.com/elijah._s/',
    resume: 'https://drive.google.com/file/d/1u2qszTvOtS1g5uhGT_FIayijTVymTw3y/view?usp=sharing',
  },
} as const;
