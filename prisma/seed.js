const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin user...");
  
  try {
    // حذف المستخدم القديم إذا وجد
    await prisma.user.deleteMany();

    // إنشاء كلمة مرور مشفرة
    const hashedPassword = await bcrypt.hash("123456", 10);

    // إنشاء مستخدم المدير
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      }
    });

    console.log('Created admin user:', adminUser);

    // بدء عملية seed للصفحات
    console.log("Clearing existing pages data...");
    await prisma.input.deleteMany();
    await prisma.section.deleteMany();
    await prisma.page.deleteMany();

    console.log("Seeding pages...");
    // إضافة الصفحات
    for (const pageData of pages) {
      const page = await prisma.page.create({
        data: {
          title: pageData.title,
          slug: pageData.slug,
          sections: {
            create: pageData.sections.map(section => ({
              title: section.title,
              inputs: {
                create: section.inputs.map(input => ({
                  label: input.label,
                  type: input.type,
                  value: input.value || ""
                }))
              }
            }))
          }
        }
      });

      console.log('Seeded Page:', page);
    }

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// بيانات الصفحات
const pages = [
  {
    title: 'About Us',
    slug: 'about-us',
    sections: [
      {
        title: 'Introduction',
        inputs: [
          { label: 'content', type: 'editor', value: 'Our mission is to serve.' },
        ]
      }
    ]
  },
  {
    title: 'Contact',
    slug: 'contact',
    sections: [
      {
        title: 'Contact Information',
        inputs: [
          { label: 'content', type: 'editor', value: 'Contact us at...' },
        ]
      }
    ]
  }
];

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });