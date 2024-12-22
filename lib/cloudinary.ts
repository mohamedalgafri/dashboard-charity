import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(publicIdOrUrl: string) {
  try {
    // إذا كان المدخل URL، نقوم باستخراج public_id منه
    if (publicIdOrUrl.startsWith('http')) {
      // استخراج public_id من URL
      const urlParts = publicIdOrUrl.split('/');
      const extensionIndex = urlParts[urlParts.length - 1].lastIndexOf('.');
      const fileName = urlParts[urlParts.length - 1].substring(0, extensionIndex);
      const folderPath = urlParts.slice(urlParts.indexOf('pages')).join('/');
      publicIdOrUrl = folderPath.substring(0, folderPath.lastIndexOf('/')).concat('/' + fileName);
    }

    const result = await cloudinary.uploader.destroy(publicIdOrUrl);
    
    if (result.result === 'ok') {
      return { success: true };
    } else {
      throw new Error(`فشل في حذف الصورة: ${result.result}`);
    }
  } catch (error) {
    console.error('خطأ في حذف الصورة من Cloudinary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'فشل في حذف الصورة' 
    };
  }
}

// وظيفة مساعدة لحذف مجموعة من الصور
export async function deleteMultipleFromCloudinary(publicIdsOrUrls: string[]) {
  try {
    const results = await Promise.all(
      publicIdsOrUrls.map(id => deleteFromCloudinary(id))
    );
    
    return {
      success: results.every(result => result.success),
      errors: results
        .filter(result => !result.success)
        .map(result => result.error)
    };
  } catch (error) {
    console.error('خطأ في حذف الصور:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'فشل في حذف الصور'
    };
  }
}

export default cloudinary;
