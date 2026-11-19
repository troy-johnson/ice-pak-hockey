// The Worker: the Astro pages, and the Cron Trigger that reads the Calendar Feed each hour.

import { handle } from "@astrojs/cloudflare/handler";
import { cache } from "cloudflare:workers";
import { syncCalendar } from "./lib/calendar-sync";
import { SITE_DATA_TAG } from "./lib/page-cache";

export default {
  fetch: handle,
  async scheduled(_controller, _env, ctx) {
    ctx.waitUntil(
      (async () => {
        const result = await syncCalendar();
        console.log("Calendar Feed sync", result);
        // The cached public pages show the Games, so a change removes them from the cache.
        if (result.added || result.changed || result.removed) await cache.purge({ tags: [SITE_DATA_TAG] });
      })(),
    );
  },
} satisfies ExportedHandler<Env>;
