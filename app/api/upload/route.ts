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
   if (!file) return NextResponse.json({ error: "لم يتم تحديد ملف" }, { status: 400 });

   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);

   const result = await new Promise((resolve, reject) => {
     const uploadStream = cloudinary.uploader.upload_stream(
       { 
         folder: "site-content",
         resource_type: "auto",
         timeout: 120000
       },
       (error, result) => {
         if (error) reject(error);
         else resolve(result);
       }
     );
     
     uploadStream.end(buffer);
   });

   return NextResponse.json(result);
 } catch (error) {
   console.error("خطأ في رفع الملف:", error);
   return NextResponse.json({ error: "فشل في رفع الملف" }, { status: 500 });
 }
}

export const config = {
 api: {
   bodyParser: {
     sizeLimit: '10mb'
   },
   responseLimit: false
 }
};