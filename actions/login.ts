"use server"
import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    try {
        const validatedFields = LoginSchema.safeParse(values);
        
        if (!validatedFields.success) {
            return { error: "بيانات غير صحيحة!" }
        }

        const { email, password } = validatedFields.data;
        const existingUser = await getUserByEmail(email);
        
        if (!existingUser || !existingUser.email || !existingUser.password) {
            return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }
        }

        if (existingUser.role !== "ADMIN") {
            return { error: "غير مصرح لك بالدخول!" }
        }

        // التحقق من كلمة المرور
        const passwordsMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordsMatch) {
            return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }
        }

        // إذا كل شيء صحيح
        return { success: true, email, password };
        
    } catch (error) {
        return { error: "حدث خطأ في عملية تسجيل الدخول!" }
    }
};