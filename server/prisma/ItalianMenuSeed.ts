import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const italianMenu = [
  {
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes and basil with olive oil.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/caprese-salad_625x350_51506417724.jpg",
    category: "Vegetarian",
  },
  {
    name: "Panzanella",
    description: "Traditional Tuscan bread salad with tomatoes and herbs.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/panzenella_600x300_71506417795.jpg",
    category: "Vegetarian",
  },
  {
    name: "Bruschetta",
    description: "Grilled bread topped with fresh tomatoes and garlic.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/bruschetta_625x350_71506417841.jpg",
    category: "Vegetarian",
  },
  {
    name: "Focaccia Bread",
    description: "Italian flatbread with herbs and olive oil.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/frocaccia_600x300_41506417893.jpg",
    category: "Vegetarian",
  },
  {
    name: "Pasta Carbonara",
    description: "Creamy pasta with eggs, cheese, and pancetta.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/pasta-carbonara_625x350_61506417950.jpg",
    category: "Non-Vegetarian",
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella and fresh basil.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/margherita-pizza_600x300_51506418004.jpg",
    category: "Vegetarian",
  },
  {
    name: "Mushroom Risotto",
    description: "Creamy Arborio rice with wild mushrooms and parmesan.",
    imageUrl: "https://i.ndtvimg.com/i/2017-09/risotto_625x350_81506418041.jpg",
    category: "Vegetarian",
  },
  {
    name: "Pasta Con Pomodoro E Basilico",
    description: "Simple pasta with fresh tomatoes and basil.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/pasta-con-pomodoro-e-basilico_625x350_51506418092.jpg",
    category: "Vegetarian",
  },
  {
    name: "Tiramisu",
    description:
      "Classic Italian 'pick-me-up' dessert with coffee and mascarpone.",
    imageUrl:
      "https://i.ndtvimg.com/i/2017-09/tiramisu-the-pick-me-up-cake_625x350_81506418133.jpg",
    category: "Vegetarian",
  },
  {
    name: "Lasagna",
    description: "Layered pasta with meat sauce, cheese and bechamel.",
    imageUrl: "https://i.ndtvimg.com/i/2017-10/lasagna_620x350_81508846322.jpg",
    category: "Non-Vegetarian",
  },
];

function getRandomPrice() {
  return Number((Math.random() * 400 + 100).toFixed(2));
}

async function main() {
  const italianRestaurants = await prisma.restaurant.findMany({
    where: { cuisine: { equals: "Italian", mode: "insensitive" } },
  });

  for (const restaurant of italianRestaurants) {
    // Check how many menu items already exist
    const existingCount = await prisma.menu.count({
      where: { restaurantId: restaurant.id },
    });
    const toCreate = Math.max(0, 10 - existingCount);
    if (toCreate === 0) continue;

    const menuItems = [];
    for (let i = 0; i < toCreate; i++) {
      const item = italianMenu[i % italianMenu.length];
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
      `Seeded ${toCreate} Italian menu items for restaurant: ${restaurant.name}`
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
