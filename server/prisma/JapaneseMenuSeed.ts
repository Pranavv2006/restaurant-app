import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const japaneseMenu = [
  {
    name: "Sushi",
    description: "Vinegared rice with fish or veggies.",
    imageUrl:
      "https://japanesetaste.co.uk/cdn/shop/articles/how-to-make-makizushi-sushi-rolls-japanese-taste.jpg?v=1707914944&width=5760",
  },
  {
    name: "Ramen",
    description: "Noodle soup with meat and veggies.",
    imageUrl:
      "https://sudachirecipes.com/wp-content/uploads/2025/07/shoyu-ramen-new-thumb.png",
  },
  {
    name: "Shrimp Tempura",
    description: "Battered and fried shrimp.",
    imageUrl:
      "https://static01.nyt.com/images/2024/02/28/multimedia/ND-shrimp-tempura-fwlg/ND-shrimp-tempura-fwlg-mediumSquareAt3X.jpg",
  },
  {
    name: "Udon",
    description: "Thick wheat noodles in broth.",
    imageUrl:
      "https://chefjacooks.com/wp-content/uploads/2023/02/zaru-udon-square.jpg",
  },
  {
    name: "Yakitori",
    description: "Grilled chicken skewers.",
    imageUrl:
      "https://www.seriouseats.com/thmb/ZJbhj96NdEKnLj8TatxPZzm89BI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2016__06__20160606-yakitori-negima-13-61803f895fdc4c138f56e09dbc24648f.jpg",
  },
  {
    name: "Miso Soup",
    description: "Soup with miso, tofu, and seaweed.",
    imageUrl:
      "https://www.allrecipes.com/thmb/jUDQQWFnYQIndbrSBMUQqVEngkA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-RM-13107-miso-soup-ddmfs-3x4-66171fe67e0546f6abf488075339fb13.jpg",
  },
  {
    name: "Okonomiyaki",
    description: "Savory Japanese pancake.",
    imageUrl:
      "https://www.justonecookbook.com/wp-content/uploads/2024/02/Okonomiyaki-5888-I.jpg",
  },
  {
    name: "Sashimi",
    description: "Thinly sliced raw fish.",
    imageUrl:
      "https://sudachirecipes.com/wp-content/uploads/2023/04/salmonsashimi2-sq.jpg",
  },
  {
    name: "Onigiri",
    description: "Rice balls with filling.",
    imageUrl:
      "https://www.allrecipes.com/thmb/RFpigljvRaJmCKYloZ9t2p3i-VA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/140422-onigiri-japanese-rice-balls-ddmfs-Beauty-3x4-1-aa650c90910247d086e22c57b8402367.jpg",
  },
  {
    name: "Tonkatsu",
    description: "Breaded deep-fried pork cutlet.",
    imageUrl:
      "https://www.foodandwine.com/thmb/hicXzmGIIpkwyX3Q55IYiupQjMo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Katsu-Curry-Japanese-Curry-with-Tonkatsu-Nuggets-and-Fried-Egg-FT-RECIPE0922-2000-bd3fa359de3544448906652f53f53bb3.jpg",
  },
];

function getRandomPrice() {
  return Number((Math.random() * 400 + 100).toFixed(2));
}

async function main() {
  const japaneseRestaurants = await prisma.restaurant.findMany({
    where: { cuisine: { equals: "Japanese", mode: "insensitive" } },
  });

  for (const restaurant of japaneseRestaurants) {
    // Check how many menu items already exist
    const existingCount = await prisma.menu.count({
      where: { restaurantId: restaurant.id },
    });
    const toCreate = Math.max(0, 10 - existingCount);
    if (toCreate === 0) continue;

    const menuItems = [];
    for (let i = 0; i < toCreate; i++) {
      const item = japaneseMenu[i % japaneseMenu.length];
      menuItems.push({
        name: item.name,
        description: item.description,
        price: getRandomPrice(),
        imageUrl: item.imageUrl,
        category: "Japanese",
        restaurantId: restaurant.id,
      });
    }
    await prisma.menu.createMany({ data: menuItems });
    console.log(
      `Seeded ${toCreate} Japanese menu items for restaurant: ${restaurant.name}`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
