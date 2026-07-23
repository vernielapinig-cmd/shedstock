export type ItemStatus = "Available" | "In Use" | "Under Repair" | "Missing";
export type HistoryAction = "Added" | "Updated" | "Status changed" | "Removed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          created_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          name: string;
          category: string;
          quantity: number;
          location: string;
          status: ItemStatus;
          notes: string | null;
          added_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          quantity?: number;
          location: string;
          status?: ItemStatus;
          notes?: string | null;
          added_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          quantity?: number;
          location?: string;
          status?: ItemStatus;
          notes?: string | null;
          added_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      history: {
        Row: {
          id: string;
          item_id: string | null;
          item_name: string;
          action: HistoryAction;
          details: string | null;
          by_user: string | null;
          by_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id?: string | null;
          item_name: string;
          action: HistoryAction;
          details?: string | null;
          by_user?: string | null;
          by_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string | null;
          item_name?: string;
          action?: HistoryAction;
          details?: string | null;
          by_user?: string | null;
          by_name?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Item = Database["public"]["Tables"]["items"]["Row"];
export type HistoryEntry = Database["public"]["Tables"]["history"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];