import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const mexicanMenu = [
  {
    name: "Tacos",
    description: "Corn tortillas with assorted fillings.",
    imageUrl:
      "https://danosseasoning.com/wp-content/uploads/2022/03/Beef-Tacos-1024x767.jpg",
  },
  {
    name: "Burritos",
    description: "Flour tortilla wrapped with beans and meat.",
    imageUrl:
      "https://www.marthastewart.com/thmb/uSaztTRX13520w0w inW35pDZ0s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MS-312932-bean-burritos-hero-7421-0096cb35178e4650b4b65012e0e7b699.jpg",
  },
  {
    name: "Quesadilla",
    description: "Grilled tortilla with cheese.",
    imageUrl:
      "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_16:9/k%2FPhoto%2FRecipes%2F2025-02-quesadilla%2Fquesadilla-449",
  },
  {
    name: "Enchiladas",
    description: "Tortillas rolled around filling and sauce.",
    imageUrl:
      "https://i2.wp.com/easyrecipesfromhome.com/wp-content/uploads/2017/05/Cheesy-Chicken-Enchiladas-1.jpg",
  },
  {
    name: "Guacamole",
    description: "Avocado dip with lime and cilantro.",
    imageUrl:
      "https://www.foodandwine.com/thmb/PaNa5IByv6syP1U3s3mHuN_BK2c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/guacamole-for-a-crowd-FT-RECIPE0125-624c884187d44062ae4fb86794d0769c.jpeg",
  },
  {
    name: "Churros",
    description: "Fried dough pastry with sugar.",
    imageUrl:
      "https://sourdoughbrandon.com/wp-content/uploads/2025/03/sourdough-churros-in-cinnamon-sugar-with-chocolate-dipping-sauce.jpg",
  },
  {
    name: "Nachos",
    description: "Tortilla chips with cheese and toppings.",
    imageUrl:
      "https://www.tastyrewards.com/sites/default/files/2024-01/Ultimate%20Four%20Cheese%20Nachos.jpg",
  },
  {
    name: "Fajitas",
    description: "Grilled meat and veggies with tortillas.",
    imageUrl:
      "https://www.simplyrecipes.com/thmb/Igb2OthIr1Onu0tCPyNVMp8EmtI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2015__04__chicken-fajitas-horiz-a2-1800-8ca8b1b6a694468b8bccf5a1d8e07c6d.jpg",
  },
  {
    name: "Tamales",
    description: "Corn dough stuffed and steamed in husks.",
    imageUrl:
      "https://keviniscooking.com/wp-content/uploads/2023/08/Pork-Tamales-Rojos-sauce.jpg",
  },
  {
    name: "Elote",
    description: "Grilled Mexican street corn.",
    imageUrl:
      "https://www.allrecipes.com/thmb/7Scq5b4AfNe_KkZETRQ6xcuhQLg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/138974-mexican-corn-on-the-cob-elote-DDMFS-4x3-f03a9d2ba74e41b9902bcac5570799a2.jpg",
  },
];

function getRandomPrice() {
  return Number((Math.random() * 400 + 100).toFixed(2));
}

async function main() {
  const mexicanRestaurants = await prisma.restaurant.findMany({
    where: { cuisine: { equals: "Mexican", mode: "insensitive" } },
  });

  for (const restaurant of mexicanRestaurants) {
    // Check how many menu items already exist
    const existingCount = await prisma.menu.count({
      where: { restaurantId: restaurant.id },
    });
    const toCreate = Math.max(0, 10 - existingCount);
    if (toCreate === 0) continue;

    const menuItems = [];
    for (let i = 0; i < toCreate; i++) {
      const item = mexicanMenu[i % mexicanMenu.length];
      menuItems.push({
        name: item.name,
        description: item.description,
        price: getRandomPrice(),
        imageUrl: item.imageUrl,
        category: "Mexican",
        restaurantId: restaurant.id,
      });
    }
    await prisma.menu.createMany({ data: menuItems });
    console.log(
      `Seeded ${toCreate} Mexican menu items for restaurant: ${restaurant.name}`
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
