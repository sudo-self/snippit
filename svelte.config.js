// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapters
    // If your environment is not supported, or you settled on a specific adapter, change this accordingly
    // See https://kit.svelte.dev/docs/adapters for more information and other adapters
    adapter: adapter(),
  },
  preprocess: preprocess(), // Add this line to use svelte-preprocess
};

export default config;

