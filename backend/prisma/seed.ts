import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DUMMY_BARBER_EMAIL = "demo.barber@trimly.com";
const DUMMY_BARBER_PASSWORD = "DemoBarber123";
const DUMMY_CUSTOMER_EMAIL = "demo.customer@trimly.com";
const DUMMY_CUSTOMER_PASSWORD = "DemoCustomer123";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Check if dummy barber already exists
  let barber = await prisma.user.findUnique({
    where: { email: DUMMY_BARBER_EMAIL },
  });

  if (barber) {
    console.log("✅ Dummy barber already exists, using existing barber...");
  } else {
    // Hash password for dummy barber
    const passwordHash = await bcrypt.hash(DUMMY_BARBER_PASSWORD, 10);

    // Create dummy barber
    barber = await prisma.user.create({
      data: {
        email: DUMMY_BARBER_EMAIL,
        passwordHash,
        name: "Demo Barber",
        phone: "+1234567890",
        role: "barber",
      },
    });

    console.log(`✅ Created dummy barber: ${barber.name} (${barber.email})`);
  }

  // Check if dummy customer already exists
  let customer = await prisma.user.findUnique({
    where: { email: DUMMY_CUSTOMER_EMAIL },
  });

  if (customer) {
    console.log("✅ Dummy customer already exists, using existing customer...");
  } else {
    // Hash password for dummy customer
    const passwordHash = await bcrypt.hash(DUMMY_CUSTOMER_PASSWORD, 10);

    // Create dummy customer
    customer = await prisma.user.create({
      data: {
        email: DUMMY_CUSTOMER_EMAIL,
        passwordHash,
        name: "Demo Customer",
        phone: "+1234567891",
        role: "customer",
      },
    });

    console.log(`✅ Created dummy customer: ${customer.name} (${customer.email})`);
  }

  // Create services (skip if they already exist)
  const services = [
    {
      serviceId: "haircut-classic",
      name: "Classic Haircut",
      price: 25.0,
      duration: 30,
    },
    {
      serviceId: "haircut-fade",
      name: "Fade Haircut",
      price: 30.0,
      duration: 45,
    },
    {
      serviceId: "beard-trim",
      name: "Beard Trim",
      price: 15.0,
      duration: 20,
    },
    {
      serviceId: "haircut-beard-combo",
      name: "Haircut + Beard Trim",
      price: 35.0,
      duration: 50,
    },
    {
      serviceId: "hot-towel-shave",
      name: "Hot Towel Shave",
      price: 40.0,
      duration: 30,
    },
  ];

  let createdServicesCount = 0;
  for (const service of services) {
    try {
      const created = await prisma.service.create({
        data: service,
      });
      createdServicesCount++;
      console.log(`✅ Created service: ${created.name} ($${created.price})`);
    } catch (error: any) {
      // Skip if service already exists (unique constraint)
      if (error.code === "P2002") {
        console.log(`⏭️  Service already exists: ${service.name}`);
      } else {
        throw error;
      }
    }
  }

  if (createdServicesCount > 0) {
    console.log(`✅ Created ${createdServicesCount} new services`);
  }

  // Create schedules for the next 4 weeks
  const schedules = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day

  // Find the next Monday (or use today if it's Monday)
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysUntilMonday = currentDay === 0 ? 1 : currentDay === 1 ? 0 : 8 - currentDay;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);

  // Generate schedules for Monday-Friday for the next 4 weeks
  for (let week = 0; week < 4; week++) {
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      // Monday = 0, Tuesday = 1, ..., Friday = 4
      const date = new Date(nextMonday);
      date.setDate(nextMonday.getDate() + week * 7 + dayOffset);

      schedules.push({
        barberId: barber.id,
        date: date,
        startTime: "09:00",
        endTime: "17:00",
        isActive: true,
      });
    }
  }

  // Also add some Saturday schedules (first 2 weeks only)
  const daysUntilSaturday = currentDay === 6 ? 0 : (6 - currentDay + 7) % 7;
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);

  for (let week = 0; week < 2; week++) {
    const date = new Date(nextSaturday);
    date.setDate(nextSaturday.getDate() + week * 7);

    schedules.push({
      barberId: barber.id,
      date: date,
      startTime: "10:00",
      endTime: "15:00",
      isActive: true,
    });
  }

  // Create schedules (skip duplicates)
  let createdSchedulesCount = 0;
  for (const schedule of schedules) {
    try {
      await prisma.barberSchedule.create({
        data: schedule,
      });
      createdSchedulesCount++;
    } catch (error: any) {
      // Skip if schedule already exists (unique constraint)
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  console.log(`✅ Created ${createdSchedulesCount} schedule entries for the barber`);

  console.log("\n🎉 Database seeding completed successfully!");
  console.log(`\n📝 Dummy barber credentials:`);
  console.log(`   Email: ${DUMMY_BARBER_EMAIL}`);
  console.log(`   Password: ${DUMMY_BARBER_PASSWORD}`);
  console.log(`\n📝 Dummy customer credentials:`);
  console.log(`   Email: ${DUMMY_CUSTOMER_EMAIL}`);
  console.log(`   Password: ${DUMMY_CUSTOMER_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

