import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
   
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isLoginPage = nextUrl.pathname === "/auth/login";
    const isAdminRoute = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/dashboard");
    // إضافة التحقق من مسار Socket.IO
    const isSocketRoute = nextUrl.pathname.startsWith('/api/socket');

    // السماح بالوصول إلى Socket.IO
    if (isSocketRoute) {
        return;
    }

    // السماح بالوصول إلى routes الـ API
    if (isApiAuthRoute) {
        return;
    }

    // التعامل مع صفحة تسجيل الدخول
    if (isLoginPage) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }

    // التعامل مع مسارات الأدمن
    if (isAdminRoute) {
        if (!isLoggedIn) {
            return Response.redirect(new URL("/auth/login", nextUrl));
        }
        return;
    }

    // السماح بالوصول للصفحات العامة
    if (isPublicRoute) {
        return;
    }

    return;
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};