CREATE TABLE "bling_product_images" (
	"product_id" bigint PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"bytes" "bytea" NOT NULL,
	"source_key" text NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bling_product_images" ADD CONSTRAINT "bling_product_images_product_id_bling_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."bling_products"("id") ON DELETE cascade ON UPDATE no action;