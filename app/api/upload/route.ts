// app/api/upload/route.ts
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // تعيين timeout أطول وإضافة خيارات إضافية
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pages/${folder}`,
          resource_type: "auto",
          timeout: 60000, // زيادة التايم اوت إلى 60 ثانية
          chunk_size: 6000000, // تحديد حجم القطع
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
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error: any) {
    console.error("خطأ في رفع الملف:", error);
    return NextResponse.json(
      { 
        error: error.message || "فشل في رفع الملف",
        details: error 
      },
      { status: 500 }
    );
  }
}