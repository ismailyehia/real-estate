import "dotenv/config";
import { db, usersTable, propertiesTable } from "../../lib/db/src/index";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const agentHash = await bcrypt.hash("agent123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  // Insert users using .ignore() for MySQL
  await db
    .insert(usersTable)
    .ignore()
    .values({ name: "Admin User", email: "admin@realestate.com", password: adminHash, role: "admin", phone: "+1-555-0001" });

  await db
    .insert(usersTable)
    .ignore()
    .values({ name: "Sarah Johnson", email: "sarah@realestate.com", password: agentHash, role: "agent", phone: "+1-555-0002", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150" });

  await db
    .insert(usersTable)
    .ignore()
    .values({ name: "Michael Chen", email: "michael@realestate.com", password: agentHash, role: "agent", phone: "+1-555-0003", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" });

  await db
    .insert(usersTable)
    .ignore()
    .values({ name: "John Doe", email: "user@realestate.com", password: userHash, role: "user", phone: "+1-555-0004" });

  // Retrieve IDs for relations
  const admin = await db.query.usersTable.findFirst({ where: eq(usersTable.email, "admin@realestate.com") });
  const agent1 = await db.query.usersTable.findFirst({ where: eq(usersTable.email, "sarah@realestate.com") });
  const agent2 = await db.query.usersTable.findFirst({ where: eq(usersTable.email, "michael@realestate.com") });

  console.log("Users created/verified", { admin: admin?.id, agent1: agent1?.id, agent2: agent2?.id });

  const agentId1 = agent1?.id ?? 2;
  const agentId2 = agent2?.id ?? 3;

  console.log("Clearing existing properties...");
  await db.delete(propertiesTable);

  const properties = [
    {
      title: "Cozy Downtown Apartment",
      description: "A comfortable and modern apartment located in the heart of downtown. Features an open-plan living area, updated kitchen, and easy access to public transport.",
      price: "320000", city: "New York", address: "123 Manhattan Ave, New York, NY 10001",
      type: "apartment" as const, status: "for_sale" as const, bedrooms: 2, bathrooms: 1, area: "75",
      images: ["/images/apartment.png", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
      isFeatured: true, agentId: agentId1, latitude: "40.7580", longitude: "-73.9855",
    },
    {
      title: "Spacious Family Villa",
      description: "A beautiful two-story villa perfect for families. Features a private backyard, three spacious bedrooms, and a modern kitchen. Located in a quiet neighborhood.",
      price: "750000", city: "Los Angeles", address: "456 Oak Lane, Los Angeles, CA 90001",
      type: "villa" as const, status: "for_sale" as const, bedrooms: 3, bathrooms: 2, area: "180",
      images: ["/images/normal_villa.png", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
      isFeatured: true, agentId: agentId2, latitude: "34.0522", longitude: "-118.2437",
    },
    {
      title: "Functional Studio in SoHo",
      description: "Efficiently designed studio in the vibrant SoHo neighborhood. ideal for students or young professionals. Close to cafes and galleries.",
      price: "2800", city: "New York", address: "789 Spring St, New York, NY 10012",
      type: "studio" as const, status: "for_rent" as const, bathrooms: 1, area: "40",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
      isFeatured: false, agentId: agentId1, latitude: "40.7243", longitude: "-74.0029",
    },
    {
      title: "Bright Bayview Apartment",
      description: "A sun-drenched apartment with views of the bay. Features modern amenities, a balcony, and is within walking distance to the waterfront.",
      price: "480000", city: "Miami", address: "321 Bayview Drive, Miami, FL 33132",
      type: "apartment" as const, status: "for_sale" as const, bedrooms: 2, bathrooms: 2, area: "90",
      images: ["/images/apartment.png", "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800"],
      isFeatured: true, agentId: agentId2, latitude: "25.7617", longitude: "-80.1918",
    },
    {
      title: "Suburban Family Home",
      description: "A well-maintained family home in a peaceful suburb. Features a large garage, updated bathrooms, and a cozy living room with a fireplace.",
      price: "620000", city: "Austin", address: "Ranch Road 12, Wimberley, TX 78676",
      type: "villa" as const, status: "for_sale" as const, bedrooms: 4, bathrooms: 3, area: "210",
      images: ["/images/normal_villa.png", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
      isFeatured: false, agentId: agentId1, latitude: "30.0583", longitude: "-98.0986",
    },
    {
      title: "Comfortable City Flat",
      description: "Well-located 2-bedroom flat with modern finishes. Great natural light and close to all city amenities.",
      price: "3200", city: "Chicago", address: "555 N Lake Shore Dr, Chicago, IL 60611",
      type: "apartment" as const, status: "for_rent" as const, bedrooms: 2, bathrooms: 1, area: "85",
      images: ["/images/apartment.png", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
      isFeatured: true, agentId: agentId2, latitude: "41.9200", longitude: "-87.6350",
    },
    {
      title: "Renewed Family Residence",
      description: "Updated home with a blend of classic charm and modern convenience. Spacious kitchen and a lovely backyard space.",
      price: "890000", city: "San Francisco", address: "222 Sanchez St, San Francisco, CA 94114",
      type: "villa" as const, status: "for_sale" as const, bedrooms: 3, bathrooms: 2, area: "160",
      images: ["/images/normal_villa.png", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
      isFeatured: false, agentId: agentId1, latitude: "37.7510", longitude: "-122.4306",
    },
    {
      title: "Modern Minimalist Studio",
      description: "Clean and minimalist studio apartment in a new building. Efficient use of space and high-quality appliances.",
      price: "1500", city: "Austin", address: "100 Congress Ave, Austin, TX 78701",
      type: "studio" as const, status: "for_rent" as const, bathrooms: 1, area: "38",
      images: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"],
      isFeatured: false, agentId: agentId2, latitude: "30.2672", longitude: "-97.7431",
    },
  ];

  for (const p of properties) {
    await db.insert(propertiesTable).values(p as any);
  }

  console.log("Database seeded successfully!");
  console.log("\nTest accounts:");
  console.log("  Admin: admin@realestate.com / admin123");
  console.log("  Agent: sarah@realestate.com / agent123");
  console.log("  User:  user@realestate.com / user123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
