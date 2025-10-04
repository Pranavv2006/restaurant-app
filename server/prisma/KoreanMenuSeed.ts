import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const koreanMenu = [
  {
    name: "Braised Lotus Root",
    description: "Tender lotus root braised in savory Korean sauce.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2007/01/1.-Braised-Lotus-Root.jpg",
    category: "Vegetarian",
  },
  {
    name: "Crispy Korean Zucchini Pancakes",
    description: "Golden crispy pancakes made with fresh zucchini.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2025/07/2.-Korean-Zucchini-Pancakes.jpg",
    category: "Vegetarian",
  },
  {
    name: "Korean BBQ Short Ribs",
    description: "Marinated beef short ribs grilled to perfection.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2013/03/2.-LA-Galbi-Korean-BBQ-Short-Ribs.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Korean Squid Soup",
    description: "Spicy and hearty soup with tender squid.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2025/06/1.-Korean-Squid-Soup.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Korean Watermelon Punch",
    description: "Refreshing summer drink with watermelon and herbs.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2016/07/1.Korean-Watermelon-Punch.jpg",
    category: "Vegetarian",
  },
  {
    name: "Cucumber Kimchi",
    description: "Fermented cucumber with spicy Korean seasonings.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2017/06/1.-Cucumber-Kimchi.jpg",
    category: "Vegetarian",
  },
  {
    name: "Tteokbokki",
    description: "Chewy rice cakes in sweet and spicy sauce.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2017/11/1.-Tteokbokki.jpg",
    category: "Vegetarian",
  },
  {
    name: "Bulgogi",
    description: "Marinated Korean BBQ beef with vegetables.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2018/12/0.-Bulgogi-Korean-BBQ-Beef.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Bibimbap",
    description: "Mixed rice bowl with vegetables, meat and egg.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2013/07/3.Korean-mixed-rice-Bibimbap.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Kimchi Jjigae",
    description: "Spicy kimchi stew with pork and tofu.",
    imageUrl:
      "https://mykoreankitchen.com/wp-content/uploads/2017/03/1.-Kimchi-Jjigae.jpg",
    category: "Non-Vegetarian",
  },
];

function getRandomPrice() {
  return Number((Math.random() * 400 + 100).toFixed(2));
}

async function main() {
  const koreanRestaurants = await prisma.restaurant.findMany({
    where: { cuisine: { equals: "Korean", mode: "insensitive" } },
  });

  for (const restaurant of koreanRestaurants) {
    // Check how many menu items already exist
    const existingCount = await prisma.menu.count({
      where: { restaurantId: restaurant.id },
    });
    const toCreate = Math.max(0, 10 - existingCount);
    if (toCreate === 0) continue;

    const menuItems = [];
    for (let i = 0; i < toCreate; i++) {
      const item = koreanMenu[i % koreanMenu.length];
      menuItems.push({
        name: item.name,
        description: item.description,
        price: getRandomPrice(),
        imageUrl: item.imageUrl,
        category: item.category,
        restaurantId: restaurant.id,
      });
    }
    await prisma.menu.createMany({ data: menuItems });
    console.log(
      `Seeded ${toCreate} Korean menu items for restaurant: ${restaurant.name}`
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
