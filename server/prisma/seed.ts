// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const restaurants = [
    {
      name: "Latitude - Blue Diamond, Pune",
      location:
        "Blue Diamond, 11 Koregaon Road, Koregaon Park, Pune, Maharashtra, India",
      latitude: 18.538199,
      longitude: 73.886309,
      phone: "+91 20 66025555",
      cuisine: "Italian",
      imageUrl:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/28/2a/e3/buffet-dinner-at-latitude.jpg?w=500&h=-1&s=1",
    },
  ];

  for (const r of restaurants) {
    await prisma.restaurant.create({
      data: {
        merchantId: 22,
        name: r.name,
        location: r.location,
        latitude: r.latitude,
        longitude: r.longitude,
        phone: r.phone,
        cuisine: r.cuisine,
        imageUrl: r.imageUrl,
      },
    });
  }

  console.log(`✅ Seeded ${restaurants.length} restaurants`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
