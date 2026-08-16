import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary SDK with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});

/**
 * Uploads a file buffer directly to Cloudinary using a stream.
 * Triggers automatic format optimization (f_auto) and quality compression (q_auto).
 * 
 * @param {Buffer} fileBuffer - The memory buffer of the file
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinaryStream = (fileBuffer, folder = 'recipebox', title = '') => {
  // Check if Cloudinary credentials are not configured or are set to default placeholder text
  const isMock = 
    !process.env.CLOUDINARY_CLOUD_NAME || 
    process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
    !process.env.CLOUDINARY_API_KEY || 
    process.env.CLOUDINARY_API_KEY === 'your_api_key' ||
    !process.env.CLOUDINARY_API_SECRET || 
    process.env.CLOUDINARY_API_SECRET === 'your_api_secret';

  if (isMock) {
    console.log(`[Cloudinary] Fallback triggered. Recipe title: "${title}"`);
    const cleanTitle = (title || '').toLowerCase();
    
    // Default high-quality general food table photo
    let url = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'; 
    
    if (cleanTitle.includes('pasta') || cleanTitle.includes('spaghetti') || cleanTitle.includes('fettuccine') || cleanTitle.includes('carbonara') || cleanTitle.includes('lasagna') || cleanTitle.includes('scampi') || cleanTitle.includes('linguine')) {
      url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800';
    } else if (cleanTitle.includes('pizza') || cleanTitle.includes('flatbread') || cleanTitle.includes('margherita')) {
      url = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800';
    } else if (cleanTitle.includes('burger') || cleanTitle.includes('sandwich') || cleanTitle.includes('slider') || cleanTitle.includes('pork')) {
      url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800';
    } else if (cleanTitle.includes('salad') || cleanTitle.includes('buddha bowl') || cleanTitle.includes('caprese') || cleanTitle.includes('greek')) {
      url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800';
    } else if (cleanTitle.includes('cake') || cleanTitle.includes('cookie') || cleanTitle.includes('dessert') || cleanTitle.includes('pancake') || cleanTitle.includes('sweet') || cleanTitle.includes('lava') || cleanTitle.includes('pie')) {
      url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800';
    } else if (cleanTitle.includes('chicken') || cleanTitle.includes('poultry') || cleanTitle.includes('turkey') || cleanTitle.includes('tikka')) {
      url = 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800';
    } else if (cleanTitle.includes('soup') || cleanTitle.includes('stew') || cleanTitle.includes('chowder') || cleanTitle.includes('lentil') || cleanTitle.includes('onion')) {
      url = 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800';
    } else if (cleanTitle.includes('salmon') || cleanTitle.includes('fish') || cleanTitle.includes('shrimp') || cleanTitle.includes('seafood') || cleanTitle.includes('tuna') || cleanTitle.includes('teriyaki')) {
      url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800';
    } else if (cleanTitle.includes('taco') || cleanTitle.includes('fajita') || cleanTitle.includes('burrito') || cleanTitle.includes('mexican')) {
      url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800';
    } else if (cleanTitle.includes('bread') || cleanTitle.includes('sourdough') || cleanTitle.includes('toast') || cleanTitle.includes('baking') || cleanTitle.includes('loaf') || cleanTitle.includes('croissant') || cleanTitle.includes('boule')) {
      url = 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800';
    } else if (cleanTitle.includes('smoothie') || cleanTitle.includes('drink') || cleanTitle.includes('beverage') || cleanTitle.includes('juice') || cleanTitle.includes('shake')) {
      url = 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800';
    }

    return Promise.resolve({
      url,
      publicId: 'recipebox/placeholder_fallback'
    });
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { fetch_format: 'auto', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Write the buffer to the write stream and close it
    stream.end(fileBuffer);
  });
};

export default cloudinary;
