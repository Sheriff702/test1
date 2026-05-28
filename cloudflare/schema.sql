-- Apply this to the D1 database after creating it.
--
--   wrangler d1 execute mares --remote --file=cloudflare/schema.sql
--
-- Or from the Cloudflare dashboard: D1 → mares → Console, paste these
-- statements one at a time.

CREATE TABLE IF NOT EXISTS `products` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `subtitle` text DEFAULT '' NOT NULL,
  `price` integer DEFAULT 0 NOT NULL,
  `currency` text DEFAULT '€' NOT NULL,
  `category` text DEFAULT 'tops' NOT NULL,
  `drop` text DEFAULT '' NOT NULL,
  `description` text DEFAULT '' NOT NULL,
  `sizes` text DEFAULT '[]' NOT NULL,
  `colors` text DEFAULT '[]' NOT NULL,
  `images` text DEFAULT '[]' NOT NULL,
  `featured` integer DEFAULT 0 NOT NULL,
  `archived` integer DEFAULT 0 NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `products_slug_unique` ON `products` (`slug`);

CREATE TABLE IF NOT EXISTS `site_content` (
  `id` text PRIMARY KEY NOT NULL,
  `lang` text NOT NULL,
  `key` text NOT NULL,
  `value` text DEFAULT '' NOT NULL,
  `updated_at` integer NOT NULL
);
