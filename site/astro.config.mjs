// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // The site uses no sessions and no image transforms at run time, so it needs no KV and no Images binding.
  session: false,
  adapter: cloudflare({ imageService: 'compile' })
});
