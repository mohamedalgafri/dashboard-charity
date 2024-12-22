import slugify from 'slugify';

export function createSlug(text: string): string {
  return slugify(text, {
    replacement: '-',    // استبدال المسافات بـ -
    lower: true,        // تحويل إلى أحرف صغيرة
    strict: true,       // إزالة الأحرف الخاصة
    locale: 'ar',       // دعم اللغة العربية
    trim: true         // إزالة المسافات من البداية والنهاية
  });
}