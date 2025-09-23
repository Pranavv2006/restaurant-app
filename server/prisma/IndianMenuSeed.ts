import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const indianMenu = [
  {
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry.",
    imageUrl:
      "https://t3.ftcdn.net/jpg/06/01/41/68/360_F_601416862_AfYdeefqT1kGqWTx1DZCsJZVzYIDFzPR.jpg",
  },
  {
    name: "Paneer Tikka",
    description: "Grilled cottage cheese cubes with spices.",
    imageUrl:
      "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg",
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in butter.",
    imageUrl:
      "https://img.taste.com.au/cjPf9_uA/taste/2025/03/dal-makhani-indian-butter-lentils-2-208408-1.jpg",
  },
  {
    name: "Biryani",
    description: "Aromatic rice with spices and meat/veggies.",
    imageUrl:
      "https://j6e2i8c9.delivery.rocketcdn.me/wp-content/uploads/2020/09/Chicken-Biryani-Recipe-01-1-500x500.jpg",
  },
  {
    name: "Rogan Josh",
    description: "Kashmiri-style lamb curry.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Rogan_Josh_Kashmiri.jpg/1200px-Rogan_Josh_Kashmiri.jpg",
  },
  {
    name: "Chole Bhature",
    description: "Spicy chickpeas with fried bread.",
    imageUrl:
      "https://madhurasrecipe.com/wp-content/uploads/2020/10/Chole-Bhature-Marathi-Recipe-585x366.jpg",
  },
  {
    name: "Aloo Gobi",
    description: "Potato and cauliflower stir fry.",
    imageUrl:
      "https://static01.nyt.com/images/2023/12/21/multimedia/ND-Aloo-Gobi-gkwc/ND-Aloo-Gobi-gkwc-mediumSquareAt3X.jpg",
  },
  {
    name: "Tandoori Chicken",
    description: "Char-grilled marinated chicken.",
    imageUrl:
      "https://static01.nyt.com/images/2024/05/16/multimedia/fs-tandoori-chicken-hmjq/fs-tandoori-chicken-hmjq-videoSixteenByNineJumbo1600.jpg",
  },
  {
    name: "Palak Paneer",
    description: "Spinach and cottage cheese curry.",
    imageUrl:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/06/palak-paneer-recipe.jpg",
  },
  {
    name: "Gulab Jamun",
    description: "Sweet milk-solid dessert balls.",
    imageUrl:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/11/gulab-jamun.webp",
  },
];

function getRandomPrice() {
  return Number((Math.random() * 400 + 100).toFixed(2));
}

async function main() {
  const indianRestaurants = await prisma.restaurant.findMany({
    where: { cuisine: { equals: "Indian", mode: "insensitive" } },
  });

  for (const restaurant of indianRestaurants) {
    // Check how many menu items already exist
    const existingCount = await prisma.menu.count({
      where: { restaurantId: restaurant.id },
    });
    const toCreate = Math.max(0, 10 - existingCount);
    if (toCreate === 0) continue;

    const menuItems = [];
    for (let i = 0; i < toCreate; i++) {
      const item = indianMenu[i % indianMenu.length];
      menuItems.push({
        name: item.name,
        description: item.description,
        price: getRandomPrice(),
        imageUrl: item.imageUrl,
        category: "Indian",
        restaurantId: restaurant.id,
      });
    }
    await prisma.menu.createMany({ data: menuItems });
    console.log(
      `Seeded ${toCreate} Indian menu items for restaurant: ${restaurant.name}`
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
