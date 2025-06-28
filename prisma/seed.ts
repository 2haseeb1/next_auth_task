// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // CONFIRM: This must be 'bcryptjs' as per your package.json

const prisma = new PrismaClient();

async function main() {
  console.log("--- Starting Database Seeding ---");

  // --- 1. Create Users ---
  const hashedPasswordAlice = await bcrypt.hash("alice123", 10);
  const hashedPasswordBob = await bcrypt.hash("bob456", 10);

  const userAlice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      userName: "Alice Smith",
      email: "alice@example.com",
      password: hashedPasswordAlice,
      roles: ["admin", "user"],
      bio: "Experienced full-stack developer with a focus on web applications.",
    },
  });

  const userBob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      userName: "Bob Johnson",
      email: "bob@example.com",
      password: hashedPasswordBob,
      roles: ["user"],
      bio: "Product manager, passionate about user experience and data-driven decisions.",
    },
  });

  console.log(
    `Created users: ${userAlice.userName} (ID: ${userAlice.id}), ${userBob.userName} (ID: ${userBob.id})`
  );

  // --- 2. Create Ideas ---
  // CONFIRM: Idea model must have @@unique([title]) in schema.prisma and you've run migrate/generate
  const ideaCRM = await prisma.idea.upsert({
    where: { title: "New CRM System" }, // Correct for Idea as long as @@unique([title]) is in schema
    update: {},
    create: {
      title: "New CRM System",
      description:
        "Develop a comprehensive CRM to manage customer interactions and sales pipelines.",
      status: "Prioritized",
      tags: ["CRM", "Sales", "Internal Tool"],
      priority: "High",
      userId: userAlice.id,
    },
  });

  const ideaMobileApp = await prisma.idea.upsert({
    where: { title: "Mobile App for Task Management" },
    update: {},
    create: {
      title: "Mobile App for Task Management",
      description:
        "An intuitive mobile application for managing personal and team tasks on the go.",
      status: "Draft",
      tags: ["Mobile", "Productivity", "MVP"],
      priority: "Medium",
      userId: userBob.id,
    },
  });

  const ideaWebsiteRedesign = await prisma.idea.upsert({
    where: { title: "Company Website Redesign" },
    update: {},
    create: {
      title: "Company Website Redesign",
      description:
        "Modernize the corporate website with a fresh UI, improved performance, and SEO optimization.",
      status: "Archived",
      tags: ["Website", "Marketing", "UI/UX"],
      priority: "High",
      userId: userAlice.id,
    },
  });

  console.log(
    `Created ideas: "${ideaCRM.title}", "${ideaMobileApp.title}", "${ideaWebsiteRedesign.title}"`
  );

  // --- 3. Create Projects ---
  // CONFIRM: Project model should have @@unique([name]) in schema.prisma for this upsert where clause to be correct
  const projectEcommerce = await prisma.project.upsert({
    where: { name: "E-commerce Platform Relaunch" },
    update: {},
    create: {
      name: "E-commerce Platform Relaunch",
      description:
        "Relaunch the existing e-commerce platform with new features and improved user experience.",
      status: "InProgress",
      ownerId: userAlice.id,
      assignedToUserIds: [userAlice.id, userBob.id],
      startDate: new Date("2025-07-01T00:00:00Z"),
      endDate: new Date("2025-12-31T00:00:00Z"),
      budget: 150000.0,
      ideaId: ideaCRM.id, // Converted from ideaCRM
    },
  });

  const projectInternalWiki = await prisma.project.upsert({
    where: { name: "Internal Wiki Development" },
    update: {},
    create: {
      name: "Internal Wiki Development",
      description:
        "Build a comprehensive knowledge base for internal company documentation and processes.",
      status: "Planning",
      ownerId: userBob.id,
      assignedToUserIds: [userBob.id],
      startDate: new Date("2025-08-01T00:00:00Z"),
      endDate: new Date("2025-11-30T00:00:00Z"),
      budget: 50000.0,
    },
  });

  console.log(
    `Created projects: "${projectEcommerce.name}", "${projectInternalWiki.name}"`
  );

  // --- 4. Create Tasks ---
  // CONFIRM: Task model must have @@unique([projectId, title]) in schema.prisma
  const taskAuth = await prisma.task.upsert({
    where: {
      projectId_title: {
        // <-- THIS IS THE CORRECT SYNTAX for composite unique key
        title: "Implement user authentication",
        projectId: projectEcommerce.id,
      },
    },
    update: {}, // Empty update object is fine for seeding if no specific update logic
    create: {
      projectId: projectEcommerce.id,
      title: "Implement user authentication",
      description:
        "Set up user login, registration, and session management for the new platform.",
      status: "InProgress",
      dueDate: new Date("2025-07-15T00:00:00Z"),
      assignedToId: userAlice.id,
    },
  });

  const taskProductPages = await prisma.task.upsert({
    where: {
      projectId_title: {
        // <-- THIS IS THE CORRECT SYNTAX
        title: "Design product display pages",
        projectId: projectEcommerce.id,
      },
    },
    update: {},
    create: {
      projectId: projectEcommerce.id,
      title: "Design product display pages",
      description:
        "Create responsive and appealing layouts for product detail pages.",
      status: "Todo",
      dueDate: new Date("2025-07-20T00:00:00Z"),
      assignedToId: userAlice.id,
    },
  });

  const taskPaymentGateway = await prisma.task.upsert({
    where: {
      projectId_title: {
        // <-- THIS IS THE CORRECT SYNTAX
        title: "Develop payment gateway integration",
        projectId: projectEcommerce.id,
      },
    },
    update: {},
    create: {
      projectId: projectEcommerce.id,
      title: "Develop payment gateway integration",
      description:
        "Integrate with Stripe for secure payment processing on the e-commerce platform.",
      status: "Blocked",
      dueDate: new Date("2025-08-01T00:00:00Z"),
      assignedToId: userBob.id,
    },
  });

  const taskWikiSetup = await prisma.task.upsert({
    where: {
      projectId_title: {
        // <-- THIS IS THE CORRECT SYNTAX
        title: "Set up basic wiki structure",
        projectId: projectInternalWiki.id,
      },
    },
    update: {},
    create: {
      projectId: projectInternalWiki.id,
      title: "Set up basic wiki structure",
      description:
        "Define main categories and initial page templates for the internal wiki.",
      status: "Todo",
      dueDate: new Date("2025-08-10T00:00:00Z"),
      assignedToId: userBob.id,
    },
  });

  console.log(
    `Created tasks: "${taskAuth.title}", "${taskProductPages.title}", "${taskPaymentGateway.title}", "${taskWikiSetup.title}"`
  );

  console.log("--- Database Seeding Finished ---");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
