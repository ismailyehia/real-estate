import { db, usersTable, propertiesTable } from "@workspace/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const agentHash = await bcrypt.hash("agent123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  const [admin] = await db
    .insert(usersTable)
    .values({ name: "Admin User", email: "admin@realestate.com", password: adminHash, role: "admin", phone: "+1-555-0001" })
    .onConflictDoNothing()
    .returning();

  const [agent1] = await db
    .insert(usersTable)
    .values({ name: "Sarah Johnson", email: "sarah@realestate.com", password: agentHash, role: "agent", phone: "+1-555-0002", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150" })
    .onConflictDoNothing()
    .returning();

  const [agent2] = await db
    .insert(usersTable)
    .values({ name: "Michael Chen", email: "michael@realestate.com", password: agentHash, role: "agent", phone: "+1-555-0003", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" })
    .onConflictDoNothing()
    .returning();

  await db
    .insert(usersTable)
    .values({ name: "John Doe", email: "user@realestate.com", password: userHash, role: "user", phone: "+1-555-0004" })
    .onConflictDoNothing();

  console.log("Users created", { admin: admin?.id, agent1: agent1?.id, agent2: agent2?.id });

  if (!agent1 && !agent2) {
    console.log("Agents already exist, skipping property seed");
    process.exit(0);
  }

  const agentId1 = agent1?.id ?? 2;
  const agentId2 = agent2?.id ?? 3;

  const properties = [
    {
      title: "Modern Downtown Apartment",
      description: "Stunning luxury apartment in the heart of downtown with panoramic city views, high-end finishes, and smart home technology.",
      price: "450000", city: "New York", address: "123 Manhattan Ave, New York, NY 10001",
      type: "apartment" as const, status: "for_sale" as const, bedrooms: 2, bathrooms: 2, area: "95",
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
      isFeatured: true, agentId: agentId1, latitude: "40.7580", longitude: "-73.9855",
    },
    {
      title: "Beverly Hills Luxury Villa",
      description: "Exquisite Mediterranean villa in prestigious Beverly Hills. Features grand foyer, chef kitchen, cinema room, wine cellar, infinity pool.",
      price: "3500000", city: "Beverly Hills", address: "456 Sunset Blvd, Beverly Hills, CA 90210",
      type: "villa" as const, status: "for_sale" as const, bedrooms: 6, bathrooms: 7, area: "580",
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
      isFeatured: true, agentId: agentId2, latitude: "34.0736", longitude: "-118.4004",
    },
    {
      title: "Cozy Studio in SoHo",
      description: "Charming and efficiently designed studio in the vibrant SoHo neighborhood. Perfect for young professionals. Recently renovated.",
      price: "3500", city: "New York", address: "789 Spring St, New York, NY 10012",
      type: "studio" as const, status: "for_rent" as const, bathrooms: 1, area: "45",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
      isFeatured: false, agentId: agentId1, latitude: "40.7243", longitude: "-74.0029",
    },
    {
      title: "Seaside Miami Penthouse",
      description: "Breathtaking penthouse with 360-degree ocean views in South Beach. Features private rooftop pool, designer interiors, 3 terraces, and direct beach access.",
      price: "2800000", city: "Miami Beach", address: "321 Ocean Drive, Miami Beach, FL 33139",
      type: "apartment" as const, status: "for_sale" as const, bedrooms: 4, bathrooms: 4, area: "320",
      images: ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800", "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800"],
      isFeatured: true, agentId: agentId2, latitude: "25.7617", longitude: "-80.1918",
    },
    {
      title: "Texas Hill Country Land",
      description: "Beautiful 10-acre parcel in the Texas Hill Country with stunning views, mature oak trees, and a seasonal creek.",
      price: "185000", city: "Austin", address: "Ranch Road 12, Wimberley, TX 78676",
      type: "land" as const, status: "for_sale" as const, area: "40469",
      images: ["https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
      isFeatured: false, agentId: agentId1, latitude: "30.0583", longitude: "-98.0986",
    },
    {
      title: "Chicago Lakefront Apartment",
      description: "Sophisticated 3-bedroom apartment with stunning Lake Michigan views in Lincoln Park. Features gourmet kitchen, hardwood floors.",
      price: "5500", city: "Chicago", address: "555 N Lake Shore Dr, Chicago, IL 60611",
      type: "apartment" as const, status: "for_rent" as const, bedrooms: 3, bathrooms: 2, area: "140",
      images: ["https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
      isFeatured: true, agentId: agentId2, latitude: "41.9200", longitude: "-87.6350",
    },
    {
      title: "San Francisco Victorian Home",
      description: "Beautifully restored Victorian-era home in Noe Valley. Original architectural details paired with modern updates.",
      price: "1850000", city: "San Francisco", address: "222 Sanchez St, San Francisco, CA 94114",
      type: "villa" as const, status: "for_sale" as const, bedrooms: 4, bathrooms: 3, area: "220",
      images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
      isFeatured: false, agentId: agentId1, latitude: "37.7510", longitude: "-122.4306",
    },
    {
      title: "Downtown Austin Studio",
      description: "Modern studio loft in the heart of Austin with views of the Capitol building. Walking distance to entertainment, restaurants.",
      price: "1800", city: "Austin", address: "100 Congress Ave, Austin, TX 78701",
      type: "studio" as const, status: "for_rent" as const, bathrooms: 1, area: "42",
      images: ["https://images.unsplash.com/photo-1587316205103-f7587b0fa0bf?w=800", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"],
      isFeatured: false, agentId: agentId2, latitude: "30.2672", longitude: "-97.7431",
    },
  ];

  for (const p of properties) {
    await db.insert(propertiesTable).values(p as any).onConflictDoNothing();
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
