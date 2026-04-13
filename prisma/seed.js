const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bgfroum.com';
  const username = 'Admin';
  const rawPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      username,
      password: hashedPassword,
      role: Role.admin
    },
    create: {
      email,
      username,
      password: hashedPassword,
      role: Role.admin
    }
  });

  console.log(`Admin user ensured: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
