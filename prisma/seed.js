
const { PrismaClient } = require('@prisma/client');

const slugify = require('slugify');

const prisma = new PrismaClient();

const pages = [
  {
    title: 'About Us',
    slug: slugify('About Us', { lower: true }),
    sections: [
      {
        title: 'Introduction',
        inputs: [
          { label: 'Mission Statement', type: 'text', value: 'Our mission is to serve.' },
          { label: 'Company History', type: 'textarea', value: 'Founded in 2020.' }
        ]
      }
    ]
  },
  {
    title: 'Contact',
    slug: slugify('Contact', { lower: true }),
    sections: [
      {
        title: 'Contact Form',
        inputs: [
          { label: 'Name', type: 'text', value: '' },
          { label: 'Email', type: 'email', value: '' },
          { label: 'Message', type: 'textarea', value: '' }
        ]
      }
    ]
  }
];

async function main() {
  console.log("Clearing existing data...");

  // حذف البيانات بترتيب صحيح
  await prisma.input.deleteMany();
  await prisma.section.deleteMany();
  await prisma.page.deleteMany();

  console.log("Seeding new data...");

  // إضافة الصفحات الجديدة
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
                value: input.value || "" // إضافة value مع التحقق من وجودها
              }))
            }
          }))
        }
      }
    });

    console.log('Seeded Page:', page);
  }
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
