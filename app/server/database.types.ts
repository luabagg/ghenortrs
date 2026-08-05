// Hand-authored Supabase Database types.
//
// The Supabase CLI (`npx supabase gen types typescript --local`) requires a
// running local Postgres/Docker stack, which is unavailable in this sandbox
// and in CI without secrets. This file mirrors exactly what that command
// would produce for `supabase/migrations/20260801000000_b2b_sellers_bling.sql`.
//
// Regenerate against a linked project once credentials are available:
//   pnpm supabase:types
//
// If you add/alter tables, keep this file in sync with the migration by hand
// (or regenerate) — do not let it drift.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      sellers: {
        Row: {
          id: string;
          email: string;
          company_name: string;
          cnpj: string;
          phone: string;
          message: string;
          status: Database['public']['Enums']['seller_status'];
          approved_at: string | null;
          approved_by: string | null;
          rejected_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          company_name: string;
          cnpj: string;
          phone: string;
          message?: string;
          status?: Database['public']['Enums']['seller_status'];
          approved_at?: string | null;
          approved_by?: string | null;
          rejected_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_name?: string;
          cnpj?: string;
          phone?: string;
          message?: string;
          status?: Database['public']['Enums']['seller_status'];
          approved_at?: string | null;
          approved_by?: string | null;
          rejected_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bling_oauth_tokens: {
        Row: {
          id: number;
          access_token: string;
          refresh_token: string;
          token_type: string;
          expires_at: string;
          scope: string | null;
          raw: Json;
          updated_at: string;
        };
        Insert: {
          id?: number;
          access_token: string;
          refresh_token: string;
          token_type?: string;
          expires_at: string;
          scope?: string | null;
          raw?: Json;
          updated_at?: string;
        };
        Update: {
          id?: number;
          access_token?: string;
          refresh_token?: string;
          token_type?: string;
          expires_at?: string;
          scope?: string | null;
          raw?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      bling_products: {
        Row: {
          id: number;
          sku: string | null;
          name: string;
          description: string;
          image_url: string | null;
          price_cents: number | null;
          stock: number | null;
          unit: string | null;
          min_quantity: number;
          active: boolean;
          category: string | null;
          raw: Json;
          search_terms: string;
          synced_at: string;
        };
        Insert: {
          id: number;
          sku?: string | null;
          name: string;
          description?: string;
          image_url?: string | null;
          price_cents?: number | null;
          stock?: number | null;
          unit?: string | null;
          min_quantity?: number;
          active?: boolean;
          category?: string | null;
          raw?: Json;
          search_terms?: string;
          synced_at?: string;
        };
        Update: {
          id?: number;
          sku?: string | null;
          name?: string;
          description?: string;
          image_url?: string | null;
          price_cents?: number | null;
          stock?: number | null;
          unit?: string | null;
          min_quantity?: number;
          active?: boolean;
          category?: string | null;
          raw?: Json;
          search_terms?: string;
          synced_at?: string;
        };
        Relationships: [];
      };
      b2b_quote_requests: {
        Row: {
          id: string;
          seller_id: string;
          items: Json;
          notes: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          items: Json;
          notes?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          items?: Json;
          notes?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'b2b_quote_requests_seller_id_fkey';
            columns: ['seller_id'];
            isOneToOne: false;
            referencedRelation: 'sellers';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      seller_status: 'pending' | 'approved' | 'rejected' | 'suspended';
    };
    CompositeTypes: Record<string, never>;
  };
};

type DefaultSchema = Database['public'];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      seller_status: ['pending', 'approved', 'rejected', 'suspended'],
    },
  },
} as const;
