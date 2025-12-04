// Database table types (matching Supabase schema)
export interface DbDistrict {
  district_id: number;
  name_th: string;
  name_en?: string;
}

export interface DbSubdistrict {
  subdistrict_id: number;
  name_th: string;
  district_id: number;
}

export interface DbCategory {
  category_id: number;
  name_th: string;
  icon_name?: string;
  color_code?: string;
  parent_id?: number;
}

export interface DbPlace {
  place_id: number;
  name_th: string;
  description?: string;
  address?: string;
  opening_hours?: string;
  phone?: string;
  subdistrict_id: number;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  highlight_tags?: string | string[]; // Can be JSON or TEXT
}

export interface DbPlaceCategory {
  place_id: number;
  category_id: number;
  is_primary: boolean;
}

// Display types (for component use with joined data)
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  parentId?: number;
}

export interface District {
  id: number;
  name: string;
  nameEn?: string;
  subdistrictCount: number;
  placeCount: number;
}

export interface Subdistrict {
  id: number;
  name: string;
  districtId: number;
  districtName?: string;
}

export interface Place {
  id: number;
  name: string;
  category: string; // Primary category name for display
  categoryId: number; // Primary category ID
  categories: Category[]; // All categories for this place
  district: string;
  districtId: number;
  subdistrict: string;
  subdistrictId: number;
  description: string;
  image: string;
  address: string;
  openingHours?: string;
  phone?: string;
  highlights: string[];
  latitude?: number;
  longitude?: number;
}

