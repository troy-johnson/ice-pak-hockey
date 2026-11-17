// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';

// https://astro.build/config
export default defineConfig({
  // The site uses no sessions and no image transforms at run time, so it needs no KV and no Images binding.
  session: false,
  adapter: cloudflare({ imageService: 'compile' }),
  // The middleware sets the cache time of each public page. A page with no cache time gets no-store.
  cache: { provider: cacheCloudflare() }
});
