export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          address: string; // primary key
          name: string | null;
          avatar_url: string | null;
          is_creator: boolean;
          bio: string | null;
          website: string | null;
          twitter: string | null;
          linkedin: string | null;
          specialties: string[] | null;
          experience_years: number | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          address: string;
          name?: string | null;
          avatar_url?: string | null;
          is_creator?: boolean;
          bio?: string | null;
          website?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
          specialties?: string[] | null;
          experience_years?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          address?: string;
          name?: string | null;
          avatar_url?: string | null;
          is_creator?: boolean;
          bio?: string | null;
          website?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
          specialties?: string[] | null;
          experience_years?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructor_id: string;
          thumbnail_url: string | null;
          price: number;
          duration: string;
          level: "Beginner" | "Intermediate" | "Advanced";
          category: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          instructor_id: string;
          thumbnail_url?: string | null;
          price?: number;
          duration?: string;
          level?: "Beginner" | "Intermediate" | "Advanced";
          category?: string;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          instructor_id?: string;
          thumbnail_url?: string | null;
          price?: number;
          duration?: string;
          level?: "Beginner" | "Intermediate" | "Advanced";
          category?: string;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          type: "video" | "text" | "image";
          content: any;
          duration: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          type: "video" | "text" | "image";
          content?: any;
          duration?: string;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          type?: "video" | "text" | "image";
          content?: any;
          duration?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          module_id: string;
          questions: any;
          passing_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          questions?: any;
          passing_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          questions?: any;
          passing_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          instructor_id: string;
          progress: number;
          completed_modules: string[];
          current_module: number;
          enrolled_at: string;
          last_accessed: string;
          certificate_minted: boolean;
          certificate_token_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          instructor_id: string;
          progress?: number;
          completed_modules?: string[];
          current_module?: number;
          enrolled_at?: string;
          last_accessed?: string;
          certificate_minted?: boolean;
          certificate_token_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          instructor_id?: string;
          progress?: number;
          completed_modules?: string[];
          current_module?: number;
          enrolled_at?: string;
          last_accessed?: string;
          certificate_minted?: boolean;
          certificate_token_id?: string | null;
        };
      };
      certificate_metadata: {
        Row: {
          id: string;
          course_id: string;
          instructor_id: string;
          title: string;
          issuer: string;
          description: string;
          image: string;
          attributes: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          instructor_id: string;
          title: string;
          issuer?: string;
          description: string;
          image: string;
          skills?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          instructor_id?: string;
          title?: string;
          issuer?: string;
          description?: string;
          image?: string;
          skills?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      nft_certificates: {
        Row: {
          id: string;
          course_id: string;
          instructor_id: string;
          user_id: string;
          token_id: string;
          contract_address: string;
          transaction_hash: string;
          metadata_uri: string;
          minted_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          instructor_id: string;
          user_id: string;
          token_id: string;
          contract_address: string;
          transaction_hash: string;
          metadata_uri: string;
          minted_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          instructor_id?: string;
          user_id?: string;
          token_id?: string;
          contract_address?: string;
          transaction_hash?: string;
          metadata_uri?: string;
          minted_at?: string;
        };
      };
      course_ratings: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          instructor_id: string;
          rating: number;
          review: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          instructor_id: string;
          rating: number;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          instructor_id?: string;
          rating?: number;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          from_user_id: string;
          type: "earning" | "withdrawal" | "deposit" | "fee";
          amount: number;
          currency: string;
          description: string;
          status: "completed" | "pending" | "failed";
          tx_hash: string | null;
          course_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          from_user_id?: string;
          type: "earning" | "withdrawal" | "deposit" | "fee";
          amount: number;
          currency?: string;
          description: string;
          status?: "completed" | "pending" | "failed";
          tx_hash?: string | null;
          course_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          from_user_id?: string;
          type?: "earning" | "withdrawal" | "deposit" | "fee";
          amount?: number;
          currency?: string;
          description?: string;
          status?: "completed" | "pending" | "failed";
          tx_hash?: string | null;
          course_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
