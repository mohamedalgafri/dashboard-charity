import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder")?.toString() || "default";

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم تحديد ملف" },
        { status: 400 }
      );
    }

    // تحويل الملف إلى Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // رفع الملف إلى Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pages/${folder}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,  // تغيير هذا من secure_url إلى url
      publicId: result.public_id
    });

  } catch (error) {
    console.error("خطأ في رفع الملف:", error);
    return NextResponse.json(
      { error: "فشل في رفع الملف" },
      { status: 500 }
    );
  }
}