import { supabase } from '../lib/supabaseClient';
import {
    DbDistrict,
    DbCategory,
    District,
    Category,
    Place,
    Subdistrict,
} from '../types';

// Helper function to parse highlight tags
function parseHighlightTags(tags: string | string[] | null): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        // If not JSON, split by comma
        return tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
}

// Get all districts with counts
export async function getDistricts(): Promise<District[]> {
    try {
        const { data: districts, error: districtError } = await supabase
            .from('districts')
            .select('*');

        if (districtError) throw districtError;

        // Get counts for each district
        const districtsWithCounts = await Promise.all(
            (districts || []).map(async (district: DbDistrict) => {
                // Count subdistricts
                const { count: subdistrictCount } = await supabase
                    .from('subdistricts')
                    .select('*', { count: 'exact', head: true })
                    .eq('district_id', district.district_id);

                // Count places in this district
                const { data: subdistricts } = await supabase
                    .from('subdistricts')
                    .select('subdistrict_id')
                    .eq('district_id', district.district_id);

                const subdistrictIds = (subdistricts || []).map((s) => s.subdistrict_id);

                let placeCount = 0;
                if (subdistrictIds.length > 0) {
                    const { count } = await supabase
                        .from('places')
                        .select('*', { count: 'exact', head: true })
                        .in('subdistrict_id', subdistrictIds);
                    placeCount = count || 0;
                }

                return {
                    id: district.district_id,
                    name: district.name_th,
                    nameEn: district.name_en,
                    subdistrictCount: subdistrictCount || 0,
                    placeCount,
                };
            })
        );

        return districtsWithCounts;
    } catch (error) {
        console.error('Error fetching districts:', error);
        return [];
    }
}

// Get all subdistricts, optionally filtered by district
export async function getSubdistricts(districtId?: number): Promise<Subdistrict[]> {
    try {
        let query = supabase.from('subdistricts').select('*, districts(name_th)');

        if (districtId) {
            query = query.eq('district_id', districtId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return (data || []).map((sub: any) => ({
            id: sub.subdistrict_id,
            name: sub.name_th,
            districtId: sub.district_id,
            districtName: sub.districts?.name_th,
        }));
    } catch (error) {
        console.error('Error fetching subdistricts:', error);
        return [];
    }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
    try {
        const { data, error } = await supabase.from('categories').select('*');

        if (error) throw error;

        return (data || []).map((cat: DbCategory) => ({
            id: cat.category_id,
            name: cat.name_th,
            icon: cat.icon_name || 'MapPin',
            color: cat.color_code || '#7da87b',
            parentId: cat.parent_id,
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Get all places with full details
export async function getPlaces(): Promise<Place[]> {
    try {
        // Fetch places and categories in parallel
        const [placesResponse, categoriesResponse] = await Promise.all([
            supabase
                .from('places')
                .select('*, subdistricts(name_th, district_id, districts(name_th))'),
            supabase.from('categories').select('*')
        ]);

        if (placesResponse.error) throw placesResponse.error;
        if (categoriesResponse.error) throw categoriesResponse.error;

        const places = placesResponse.data || [];
        const allCategories = categoriesResponse.data || [];

        // Create a map for faster category lookup
        const categoryMap = new Map(allCategories.map((c: any) => [c.category_id, c]));

        // Map places to the frontend structure
        const mappedPlaces = places.map((place: any) => {
            // Get category IDs from the new jsonb column, or fallback to empty array
            const categoryIds: number[] = place.category_ids || [];

            // Map IDs to full category objects
            const placeCategories = categoryIds.map((id: number) => {
                const cat = categoryMap.get(id);
                if (!cat) return null;
                return {
                    id: cat.category_id,
                    name: cat.name_th,
                    icon: cat.icon_name || 'MapPin',
                    color: cat.color_code || '#7da87b',
                    parentId: cat.parent_id,
                };
            }).filter(Boolean) as Category[];

            // Determine primary category (first one in the list)
            const primaryCategory = placeCategories.length > 0
                ? { id: placeCategories[0].id, name: placeCategories[0].name }
                : { id: 0, name: 'ไม่ระบุ' };

            return {
                id: place.place_id,
                name: place.name_th,
                category: primaryCategory.name,
                categoryId: primaryCategory.id,
                categories: placeCategories,
                district: place.subdistricts?.districts?.name_th || '',
                districtId: place.subdistricts?.district_id || 0,
                subdistrict: place.subdistricts?.name_th || '',
                subdistrictId: place.subdistrict_id,
                description: place.description || '',
                image: place.image_url || '',
                address: place.address || '',
                openingHours: place.opening_hours,
                phone: place.phone,
                highlights: parseHighlightTags(place.highlight_tags),
                latitude: place.latitude,
                longitude: place.longitude,
            };
        });

        return mappedPlaces;
    } catch (error) {
        console.error('Error fetching places:', error);
        return [];
    }
}

// Get a single place by ID
export async function getPlaceById(id: number): Promise<Place | null> {
    try {
        // Fetch place and all categories
        const [placeResponse, categoriesResponse] = await Promise.all([
            supabase
                .from('places')
                .select('*, subdistricts(name_th, district_id, districts(name_th))')
                .eq('place_id', id)
                .single(),
            supabase.from('categories').select('*')
        ]);

        if (placeResponse.error) throw placeResponse.error;
        if (categoriesResponse.error) throw categoriesResponse.error;

        const place = placeResponse.data;
        if (!place) return null;

        const allCategories = categoriesResponse.data || [];
        const categoryMap = new Map(allCategories.map((c: any) => [c.category_id, c]));

        // Get category IDs from the new jsonb column
        const categoryIds: number[] = place.category_ids || [];

        // Map IDs to full category objects
        const placeCategories = categoryIds.map((id: number) => {
            const cat = categoryMap.get(id);
            if (!cat) return null;
            return {
                id: cat.category_id,
                name: cat.name_th,
                icon: cat.icon_name || 'MapPin',
                color: cat.color_code || '#7da87b',
                parentId: cat.parent_id,
            };
        }).filter(Boolean) as Category[];

        const primaryCategory = placeCategories.length > 0
            ? { id: placeCategories[0].id, name: placeCategories[0].name }
            : { id: 0, name: 'ไม่ระบุ' };

        return {
            id: place.place_id,
            name: place.name_th,
            category: primaryCategory.name,
            categoryId: primaryCategory.id,
            categories: placeCategories,
            district: place.subdistricts?.districts?.name_th || '',
            districtId: place.subdistricts?.district_id || 0,
            subdistrict: place.subdistricts?.name_th || '',
            subdistrictId: place.subdistrict_id,
            description: place.description || '',
            image: place.image_url || '',
            address: place.address || '',
            openingHours: place.opening_hours,
            phone: place.phone,
            highlights: parseHighlightTags(place.highlight_tags),
            latitude: place.latitude,
            longitude: place.longitude,
        };
    } catch (error) {
        console.error('Error fetching place:', error);
        return null;
    }
}

// Get places filtered by category
export async function getPlacesByCategory(categoryId: number): Promise<Place[]> {
    try {
        // Use JSONB contains operator to find places with the category ID
        const { data: places, error } = await supabase
            .from('places')
            .select('place_id')
            .contains('category_ids', [categoryId]);

        if (error) throw error;

        const placeIds = (places || []).map((p) => p.place_id);

        if (placeIds.length === 0) return [];

        // Get full place details (reusing getPlaces logic would be inefficient for large datasets, 
        // but for now we'll filter the full list or we could refactor getPlaces to accept IDs)
        // A better approach for now:
        const allPlaces = await getPlaces();
        return allPlaces.filter((place) => placeIds.includes(place.id));
    } catch (error) {
        console.error('Error fetching places by category:', error);
        return [];
    }
}

// Get places filtered by district
export async function getPlacesByDistrict(districtId: number): Promise<Place[]> {
    try {
        const allPlaces = await getPlaces();
        return allPlaces.filter((place) => place.districtId === districtId);
    } catch (error) {
        console.error('Error fetching places by district:', error);
        return [];
    }
}

// Get places filtered by subdistrict
export async function getPlacesBySubdistrict(subdistrictId: number): Promise<Place[]> {
    try {
        const allPlaces = await getPlaces();
        return allPlaces.filter((place) => place.subdistrictId === subdistrictId);
    } catch (error) {
        console.error('Error fetching places by subdistrict:', error);
        return [];
    }
}
