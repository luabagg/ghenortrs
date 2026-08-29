CREATE TYPE "public"."seller_status" AS ENUM('pending', 'approved', 'rejected', 'suspended');--> statement-breakpoint
CREATE TABLE "b2b_quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"items" jsonb NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bling_oauth_tokens" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"token_type" text DEFAULT 'Bearer' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"scope" text,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bling_oauth_tokens_singleton" CHECK ("bling_oauth_tokens"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "bling_products" (
	"id" bigint PRIMARY KEY NOT NULL,
	"sku" text,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image_url" text,
	"price_cents" integer,
	"stock" numeric,
	"unit" text,
	"min_quantity" integer DEFAULT 1 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"visible_b2b" boolean DEFAULT true NOT NULL,
	"price_start_cents" integer,
	"price_pro_cents" integer,
	"price_max_cents" integer,
	"category" text,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"search_terms" text DEFAULT '' NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sellers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"company_name" text NOT NULL,
	"cnpj" text NOT NULL,
	"phone" text NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"status" "seller_status" DEFAULT 'pending' NOT NULL,
	"approved_at" timestamp with time zone,
	"approved_by" text,
	"rejected_reason" text,
	"volume" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sellers_email_unique" UNIQUE("email"),
	CONSTRAINT "sellers_cnpj_digits" CHECK ("sellers"."cnpj" ~ '^\d{14}$')
);
--> statement-breakpoint
ALTER TABLE "b2b_quote_requests" ADD CONSTRAINT "b2b_quote_requests_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;