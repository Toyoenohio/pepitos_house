/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/cloudflare" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
 DATABASE_URL: string;
 ADMIN_PASSWORD?: string;
}>;

declare namespace App {
 interface Locals extends Runtime {}
}
