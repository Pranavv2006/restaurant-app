import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const chineseMenu = [
  {
    name: "Kung Pao Chicken",
    description: "Spicy stir-fried chicken with peanuts.",
    imageUrl:
      "https://theyummybowl.com/wp-content/uploads/kung-pao-chicken-n-1-of-1.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Sweet and Sour Pork",
    description: "Pork in tangy sweet sauce.",
    imageUrl:
      "https://simplehomeedit.com/wp-content/uploads/2024/09/Sweet-and-Sour-Pork-1.webp",
    category: "Non-Vegetarian",
  },
  {
    name: "Spring Rolls",
    description: "Crispy rolls with veggie filling.",
    imageUrl:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2013/12/spring-rolls.jpg",
    category: "Vegetarian",
  },
  {
    name: "Fried Rice",
    description: "Rice stir-fried with veggies and egg.",
    imageUrl:
      "https://cicili.tv/wp-content/uploads/2024/08/Chicken-Fried-Rice-Small-2-1200x900.jpg",
    category: "Vegetarian", // This can be Vegetarian, or it can be Non-Vegetarian based on the addition of chicken, pork, etc. but for this example, we'll keep it Vegetarian.
  },
  {
    name: "Chow Mein",
    description: "Stir-fried noodles with vegetables.",
    imageUrl:
      "https://vegecravings.com/wp-content/uploads/2019/04/Vegetarian-Chowmein-Recipe-Step-By-Step-Instructions.jpg.webp",
    category: "Vegetarian",
  },
  {
    name: "Mapo Tofu",
    description: "Spicy tofu with minced meat.",
    imageUrl:
      "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2F2023-05-mapo-tofu%2Fmapo-tofu-017",
    category: "Non-Vegetarian",
  },
  {
    name: "Dumplings",
    description: "Steamed or fried filled dough.",
    imageUrl:
      "https://static01.nyt.com/images/2025/01/29/multimedia/27Dumpling-week-chocolate-cwvl/27Dumpling-week-chocolate-cwvl-jumbo.jpg",
    category: "Non-Vegetarian", // Dumplings can be both, but for this example, we will consider it non-vegetarian.
  },
  {
    name: "Hot and Sour Soup",
    description: "Spicy and tangy soup.",
    imageUrl:
      "https://littlespoonfarm.com/wp-content/uploads/2021/10/Hot-and-sour-soup-recipe.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Szechuan Chicken",
    description: "Spicy chicken with Szechuan pepper.",
    imageUrl:
      "https://www.chilipeppermadness.com/wp-content/uploads/2024/03/Szechuan-Chicken-Recipe-SQ.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Egg Drop Soup",
    description: "Silky soup with egg ribbons.",
    imageUrl:
      "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-09-egg-drop-soup%2Fegg-drop-soup-3561",
    category: "Vegetarian",
  },
];

function getRandomPrice() {
  return Number((Math.random() * 400 + 100).toFixed(2));
}

async function main() {
  const chineseRestaurants = await prisma.restaurant.findMany({
    where: { cuisine: { equals: "Chinese", mode: "insensitive" } },
  });

  for (const restaurant of chineseRestaurants) {
    // Check how many menu items already exist
    const existingCount = await prisma.menu.count({
      where: { restaurantId: restaurant.id },
    });
    const toCreate = Math.max(0, 10 - existingCount);
    if (toCreate === 0) continue;

    const menuItems = [];
    for (let i = 0; i < toCreate; i++) {
      const item = chineseMenu[i % chineseMenu.length];
      menuItems.push({
        name: item.name,
        description: item.description,
        price: getRandomPrice(),
        imageUrl: item.imageUrl,
        category: item.category, // Changed from "Chinese" to item.category
        restaurantId: restaurant.id,
      });
    }
    await prisma.menu.createMany({ data: menuItems });
    console.log(
      `Seeded ${toCreate} Chinese menu items for restaurant: ${restaurant.name}`
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
