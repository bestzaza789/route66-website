import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'place-images';

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @returns Promise with the public URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
    try {
        // Generate unique filename with timestamp
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    try {
        // Extract file path from URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([fileName]);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
}

/**
 * Check if storage bucket exists and is accessible
 */
export async function checkStorageBucket(): Promise<boolean> {
    try {
        const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
        return !error && data !== null;
    } catch (error) {
        console.error('Storage bucket check failed:', error);
        return false;
    }
}
