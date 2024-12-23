"use server"

import { SettingSchema } from "@/schemas" 
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getCurrentUser } from "@/lib/session";
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache";

export const settings = async (values:z.infer<typeof SettingSchema>)=>{
    
    const user = await currentUser();
    if(!user){
        return {error:"Unauthorized"}
    }

    const dbUser  = await getUserById(user.id as string);
    if(!dbUser){
        return {error:"Unauthorized"}
    }

    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }
    
    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);

        if(existingUser && existingUser.id !== user.id){
            return {error:"Email already in use!"}
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )

        return { success: "Verification email sent!" }
    }


    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(values.password,dbUser.password);

        if(!passwordsMatch){
            return {error:"Incorrect password!"};
        }

        const hashedPassword = await bcrypt.hash(
            values.newPassword,10
        )
        values.password = hashedPassword;
        values.newPassword = undefined;
    }


    await db.user.update({
        where:{id:dbUser.id},
        data:{
            ...values
        }
    })


    return {success: "Settings Updated!"}
}


export async function updateSiteSettings(data) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "غير مصرح" };
    }

    const settings = await db.settings.findFirst();
    
    if (settings) {
      await db.settings.update({
        where: { id: settings.id },
        data: {
          siteName: data.siteName,
          logoImage: data.logoImage,
          logoText: data.logoText,
        },
      });
    } else {
      await db.settings.create({
        data: {
          siteName: data.siteName,
          logoImage: data.logoImage,
          logoText: data.logoText,
        },
      });
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ في تحديث الإعدادات" };
  }
}

export async function updateSocialLinks(data) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "غير مصرح" };
    }

    const settings = await db.settings.findFirst();
    
    if (settings) {
    
        const updatedLinks = [...settings.socialLinks, ...data];
        
        await db.settings.update({
          where: { id: settings.id },
          data: {
            socialLinks: updatedLinks,
          },
        });
      }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ في تحديث روابط التواصل" };
  }
}