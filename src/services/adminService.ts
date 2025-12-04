import { supabase } from '../lib/supabaseClient';

// ============= PLACE MANAGEMENT =============

export interface PlaceInsertData {
    name_th: string;
    description?: string;
    address?: string;
    opening_hours?: string;
    phone?: string;
    subdistrict_id: number;
    latitude?: number;
    longitude?: number;
    image_url?: string;
    highlight_tags?: string[];
}

/**
 * Insert a new place into the database
 */
export async function insertPlace(placeData: PlaceInsertData): Promise<number> {
    try {
        const { data, error } = await supabase
            .from('places')
            .insert([placeData])
            .select('place_id')
            .single();

        if (error) throw error;
        return data.place_id;
    } catch (error) {
        console.error('Error inserting place:', error);
        throw new Error('Failed to insert place');
    }
}

/**
 * Update an existing place
 */
export async function updatePlace(
    placeId: number,
    placeData: Partial<PlaceInsertData>
): Promise<void> {
    try {
        const { error } = await supabase
            .from('places')
            .update(placeData)
            .eq('place_id', placeId);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating place:', error);
        throw new Error('Failed to update place');
    }
}

/**
 * Delete a place and its category relationships
 */
export async function deletePlace(placeId: number): Promise<void> {
    try {
        // Delete place-category relationships first
        await supabase.from('placecategories').delete().eq('place_id', placeId);

        // Then delete the place
        const { error } = await supabase.from('places').delete().eq('place_id', placeId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting place:', error);
        throw new Error('Failed to delete place');
    }
}

// ============= PLACE-CATEGORY RELATIONSHIPS =============

/**
 * Add a category to a place
 */
export async function addPlaceCategory(
    placeId: number,
    categoryId: number,
    isPrimary: boolean = false
): Promise<void> {
    try {
        const { error } = await supabase
            .from('placecategories')
            .insert([{ place_id: placeId, category_id: categoryId, is_primary: isPrimary }]);

        if (error) throw error;
    } catch (error) {
        console.error('Error adding place category:', error);
        throw new Error('Failed to add category to place');
    }
}

/**
 * Remove all categories from a place and add new ones
 */
export async function updatePlaceCategories(
    placeId: number,
    categoryIds: number[],
    primaryCategoryId: number
): Promise<void> {
    try {
        // Delete existing relationships
        await supabase.from('placecategories').delete().eq('place_id', placeId);

        // Insert new relationships
        const relationships = categoryIds.map((categoryId) => ({
            place_id: placeId,
            category_id: categoryId,
            is_primary: categoryId === primaryCategoryId,
        }));

        const { error } = await supabase.from('placecategories').insert(relationships);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating place categories:', error);
        throw new Error('Failed to update place categories');
    }
}

// ============= CATEGORY MANAGEMENT =============

export interface CategoryInsertData {
    name_th: string;
    icon_name?: string;
    color_code?: string;
    parent_id?: number;
}

/**
 * Insert a new category
 */
export async function insertCategory(categoryData: CategoryInsertData): Promise<number> {
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert([categoryData])
            .select('category_id')
            .single();

        if (error) throw error;
        return data.category_id;
    } catch (error) {
        console.error('Error inserting category:', error);
        throw new Error('Failed to insert category');
    }
}

/**
 * Update an existing category
 */
export async function updateCategory(
    categoryId: number,
    categoryData: Partial<CategoryInsertData>
): Promise<void> {
    try {
        const { error } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('category_id', categoryId);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating category:', error);
        throw new Error('Failed to update category');
    }
}

// ============= DISTRICT MANAGEMENT =============

export interface DistrictInsertData {
    name_th: string;
    name_en?: string;
}

/**
 * Insert a new district
 */
export async function insertDistrict(districtData: DistrictInsertData): Promise<number> {
    try {
        const { data, error } = await supabase
            .from('districts')
            .insert([districtData])
            .select('district_id')
            .single();

        if (error) throw error;
        return data.district_id;
    } catch (error) {
        console.error('Error inserting district:', error);
        throw new Error('Failed to insert district');
    }
}

// ============= SUBDISTRICT MANAGEMENT =============

export interface SubdistrictInsertData {
    name_th: string;
    district_id: number;
}

/**
 * Insert a new subdistrict
 */
export async function insertSubdistrict(
    subdistrictData: SubdistrictInsertData
): Promise<number> {
    try {
        const { data, error } = await supabase
            .from('subdistricts')
            .insert([subdistrictData])
            .select('subdistrict_id')
            .single();

        if (error) throw error;
        return data.subdistrict_id;
    } catch (error) {
        console.error('Error inserting subdistrict:', error);
        throw new Error('Failed to insert subdistrict');
    }
}
