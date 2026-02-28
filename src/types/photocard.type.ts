export interface Card {
  id: number;
  name: string;
  era: string;
  type: string;
  image_url: string;
  members: string[];
  isCollected: boolean;
  release_date: string;
  sort_order: number;
  store: string;
}

export interface SupabaseCardResponse {
  id: number;
  name: string;
  type: string;
  era: string;
  image_url: string;
  release_date: string;
  sort_order: number;
  photocard_members: {
    member_name: string;
  }[];
  user_collection: {
    user_id: string;
  }[];
  store?: string;
}
