import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Recipe from './models/Recipe.js';

// Resolve directory name and load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const recipes = [
  {
    title: "Mushroom Risotto",
    description: "Creamy Arborio rice cooked slow with earthy sautéed wild mushrooms, white wine, garlic, and freshly grated Parmesan cheese.",
    imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "Medium",
    tags: ["Italian", "Risotto", "Vegetarian", "Dinner", "ComfortFood"],
    ingredients: [
      { name: "Arborio rice", quantity: 300, unit: "g" },
      { name: "mixed wild mushrooms (cremini, shiitake), sliced", quantity: 400, unit: "g" },
      { name: "vegetable broth, warm", quantity: 1000, unit: "ml" },
      { name: "dry white wine", quantity: 150, unit: "ml" },
      { name: "shallots, finely diced", quantity: 2, unit: "pieces" },
      { name: "garlic cloves, minced", quantity: 3, unit: "cloves" },
      { name: "unsalted butter", quantity: 50, unit: "g" },
      { name: "olive oil", quantity: 2, unit: "tbsp" },
      { name: "parmesan cheese, freshly grated", quantity: 80, unit: "g" },
      { name: "fresh thyme leaves", quantity: 1, unit: "tbsp" },
      { name: "fresh parsley, chopped", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Heat olive oil and 1 tbsp butter in a skillet over medium-high heat. Add sliced mushrooms and thyme; cook 6–8 minutes until golden brown. Season with salt and pepper, then transfer half to a plate for topping.",
      "In a large Dutch oven or deep pan, melt 2 tbsp butter over medium heat. Add chopped shallots and cook 3 minutes until translucent. Add minced garlic and cook 1 minute.",
      "Add Arborio rice and toast for 2 minutes, stirring constantly until edges are translucent.",
      "Pour in white wine and stir until completely absorbed by the rice.",
      "Begin adding warm vegetable broth one ladle at a time, stirring frequently and waiting until liquid is mostly absorbed before adding the next ladle (about 18–20 minutes).",
      "Stir in the cooked mushrooms, remaining butter, and freshly grated Parmesan cheese. Remove from heat, cover, and let rest for 2 minutes.",
      "Garnish with reserved golden mushrooms and chopped parsley before serving warm."
    ],
    nutritionalInfo: { calories: 450, protein: 12, carbohydrates: 62, fat: 16 }
  },
  {
    title: "Sheet Pan Shakshuka",
    description: "Poached eggs nestled in a spiced tomato, bell pepper, and onion sauce baked directly on a sheet pan with crumbled feta and fresh cilantro.",
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    tags: ["MiddleEastern", "Breakfast", "Eggs", "Vegetarian", "Healthy"],
    ingredients: [
      { name: "large eggs", quantity: 6, unit: "pieces" },
      { name: "crushed tomatoes", quantity: 800, unit: "g" },
      { name: "red bell pepper, diced", quantity: 1, unit: "large" },
      { name: "yellow bell pepper, diced", quantity: 1, unit: "large" },
      { name: "yellow onion, diced", quantity: 1, unit: "medium" },
      { name: "garlic cloves, minced", quantity: 4, unit: "cloves" },
      { name: "ground cumin", quantity: 1.5, unit: "tsp" },
      { name: "smoked paprika", quantity: 1.5, unit: "tsp" },
      { name: "ground coriander", quantity: 1, unit: "tsp" },
      { name: "red pepper flakes", quantity: 0.5, unit: "tsp" },
      { name: "olive oil", quantity: 3, unit: "tbsp" },
      { name: "feta cheese, crumbled", quantity: 100, unit: "g" },
      { name: "fresh cilantro, chopped", quantity: 3, unit: "tbsp" }
    ],
    instructions: [
      "Preheat oven to 200°C (400°F).",
      "Heat olive oil in a skillet over medium heat. Sauté onion and bell peppers for 7–8 minutes until softened. Add garlic, cumin, smoked paprika, coriander, and red pepper flakes; cook for 1 minute.",
      "Stir in crushed tomatoes, season with salt and pepper, and simmer for 5 minutes until thickened.",
      "Pour the sauce onto a rimmed baking sheet, spreading it evenly.",
      "Use the back of a spoon to create 6 small wells in the sauce. Gently crack an egg into each well.",
      "Bake in the oven for 12–15 minutes until egg whites are set and yolks remain runny.",
      "Sprinkle crumbled feta and fresh cilantro on top. Serve hot with warm pita bread or crusty sourdough."
    ],
    nutritionalInfo: { calories: 310, protein: 16, carbohydrates: 22, fat: 18 }
  },
  {
    title: "Jollof Rice with Smoky Peppers",
    description: "Vibrant West African long-grain rice cooked in a rich, roasted bell pepper and habanero tomato blend with aromatic spices.",
    imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    prepTime: 20,
    cookTime: 45,
    servings: 6,
    difficulty: "Medium",
    tags: ["African", "Rice", "Spicy", "Vegan", "Dinner"],
    ingredients: [
      { name: "parboiled long-grain rice, rinsed", quantity: 400, unit: "g" },
      { name: "red bell peppers, roasted and blended", quantity: 3, unit: "large" },
      { name: "plum tomatoes, blended", quantity: 500, unit: "g" },
      { name: "habanero pepper", quantity: 1, unit: "whole" },
      { name: "red onions, chopped", quantity: 2, unit: "large" },
      { name: "tomato paste", quantity: 3, unit: "tbsp" },
      { name: "vegetable broth", quantity: 500, unit: "ml" },
      { name: "vegetable oil", quantity: 80, unit: "ml" },
      { name: "dried thyme", quantity: 1.5, unit: "tsp" },
      { name: "curry powder", quantity: 1.5, unit: "tsp" },
      { name: "bay leaves", quantity: 3, unit: "pieces" },
      { name: "garlic cloves", quantity: 4, unit: "cloves" },
      { name: "fresh ginger, minced", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Blend roasted red bell peppers, plum tomatoes, habanero, 1 onion, garlic, and ginger until smooth.",
      "Heat vegetable oil in a heavy-bottomed pot over medium heat. Add remaining chopped onion and sauté for 5 minutes until caramelized.",
      "Add tomato paste and fry for 5 minutes, stirring constantly until deep red and fragrant.",
      "Pour in the blended pepper-tomato puree, thyme, curry powder, bay leaves, salt, and pepper. Simmer covered for 15–20 minutes until reduced.",
      "Add rinsed rice to the pot and stir to coat thoroughly in the sauce. Pour in broth and bring to a gentle boil.",
      "Cover tightly with foil and a lid. Reduce heat to low and steam cook for 25–30 minutes without opening.",
      "Remove from heat, fluff gently with a fork, discard bay leaves, and serve with fried plantains."
    ],
    nutritionalInfo: { calories: 380, protein: 8, carbohydrates: 68, fat: 10 }
  },
  {
    title: "Classic Cacio e Pepe",
    description: "An iconic Roman pasta made with just three core ingredients: al dente tonnarelli, freshly cracked black pepper, and sharp Pecorino Romano cheese.",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    tags: ["Italian", "Pasta", "Vegetarian", "Quick", "Dinner"],
    ingredients: [
      { name: "tonnarelli or spaghetti pasta", quantity: 400, unit: "g" },
      { name: "Pecorino Romano cheese, finely grated", quantity: 200, unit: "g" },
      { name: "whole black peppercorns, coarsely crushed", quantity: 2, unit: "tbsp" },
      { name: "kosher salt", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Toast coarsely crushed black peppercorns in a large dry skillet over medium heat for 1–2 minutes until aromatic.",
      "Bring a pot of water to a boil with moderate salt. Cook pasta until 2 minutes shy of al dente.",
      "Ladle 240ml of starchy pasta water into the skillet with the toasted pepper.",
      "Transfer pasta directly into the skillet using tongs and toss continuously over low heat to absorb liquid.",
      "Place grated Pecorino Romano in a bowl and add a splash of warm pasta water, whisking into a smooth paste.",
      "Remove skillet from heat completely. Stir in cheese paste rapidly, tossing pasta to create a silky, glossy emulsion.",
      "Serve immediately in warmed bowls topped with extra crushed black pepper and grated Pecorino."
    ],
    nutritionalInfo: { calories: 510, protein: 22, carbohydrates: 68, fat: 16 }
  },
  {
    title: "Chana Masala",
    description: "A flavorful North Indian chickpea curry simmered with onion, ginger, garlic, tomatoes, and aromatic warming spices.",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    tags: ["Indian", "Vegan", "Curry", "Vegetarian", "Healthy"],
    ingredients: [
      { name: "chickpeas, drained and rinsed", quantity: 800, unit: "g" },
      { name: "yellow onion, finely diced", quantity: 2, unit: "medium" },
      { name: "tomatoes, finely chopped", quantity: 400, unit: "g" },
      { name: "ginger-garlic paste", quantity: 2, unit: "tbsp" },
      { name: "cumin seeds", quantity: 1, unit: "tsp" },
      { name: "ground turmeric", quantity: 0.5, unit: "tsp" },
      { name: "garam masala", quantity: 1.5, unit: "tsp" },
      { name: "ground coriander", quantity: 1.5, unit: "tsp" },
      { name: "amchur (dry mango powder) or lemon juice", quantity: 1, unit: "tsp" },
      { name: "Kashmiri chili powder", quantity: 1, unit: "tsp" },
      { name: "vegetable oil", quantity: 2, unit: "tbsp" },
      { name: "fresh cilantro, chopped", quantity: 3, unit: "tbsp" }
    ],
    instructions: [
      "Heat oil in a large saucepan over medium heat. Add cumin seeds and let them sizzle for 30 seconds.",
      "Add diced onions and cook for 8–10 minutes until deep golden brown.",
      "Stir in ginger-garlic paste and cook for 1 minute until raw aroma dissipates.",
      "Add coriander, turmeric, chili powder, and half the garam masala; cook for 30 seconds.",
      "Add chopped tomatoes and cook for 6–8 minutes until soft and oil starts separating from the sauce.",
      "Stir in chickpeas, 250ml water, and salt. Mash a few chickpeas with the back of a spoon to thicken the gravy.",
      "Simmer uncovered for 15 minutes to let flavors meld.",
      "Stir in amchur powder and remaining garam masala. Garnish with fresh cilantro and serve with warm naan or basmati rice."
    ],
    nutritionalInfo: { calories: 360, protein: 15, carbohydrates: 54, fat: 10 }
  },
  {
    title: "Loaded Black Bean Tacos",
    description: "Crispy corn tortillas stuffed with seasoned black beans, sweet corn, fresh avocado, pickled red onions, and lime crema.",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    tags: ["Mexican", "Tacos", "Vegetarian", "Quick", "Healthy"],
    ingredients: [
      { name: "small corn tortillas", quantity: 8, unit: "pieces" },
      { name: "black beans, rinsed and drained", quantity: 400, unit: "g" },
      { name: "sweet corn kernels", quantity: 150, unit: "g" },
      { name: "ground cumin", quantity: 1, unit: "tsp" },
      { name: "chili powder", quantity: 1, unit: "tsp" },
      { name: "garlic powder", quantity: 0.5, unit: "tsp" },
      { name: "avocado, sliced", quantity: 2, unit: "whole" },
      { name: "pickled red onions", quantity: 60, unit: "g" },
      { name: "sour cream or lime crema", quantity: 80, unit: "g" },
      { name: "fresh cilantro, chopped", quantity: 3, unit: "tbsp" },
      { name: "lime wedges", quantity: 1, unit: "whole" },
      { name: "olive oil", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Heat olive oil in a skillet over medium heat. Add black beans, sweet corn, cumin, chili powder, garlic powder, salt, and 2 tbsp water.",
      "Cook for 5–7 minutes, lightly mashing half the beans with a fork until warm and fragrant.",
      "Warm corn tortillas in a dry skillet for 30 seconds per side until pliable.",
      "Fill each tortilla with seasoned black bean and corn mixture.",
      "Top with sliced avocado, pickled red onions, lime crema, and fresh cilantro.",
      "Serve immediately with fresh lime wedges on the side."
    ],
    nutritionalInfo: { calories: 390, protein: 12, carbohydrates: 58, fat: 14 }
  },
  {
    title: "Miso Butter Salmon",
    description: "Pan-seared salmon fillets glazed with a rich, savory-sweet blend of white miso, butter, mirin, and soy sauce.",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    prepTime: 10,
    cookTime: 12,
    servings: 4,
    difficulty: "Easy",
    tags: ["Japanese", "Seafood", "Salmon", "Healthy", "Dinner"],
    ingredients: [
      { name: "salmon fillets, skin-on", quantity: 4, unit: "pieces" },
      { name: "white miso paste", quantity: 2, unit: "tbsp" },
      { name: "unsalted butter, softened", quantity: 2, unit: "tbsp" },
      { name: "mirin", quantity: 1, unit: "tbsp" },
      { name: "soy sauce", quantity: 1, unit: "tbsp" },
      { name: "honey or brown sugar", quantity: 1, unit: "tsp" },
      { name: "sesame oil", quantity: 1, unit: "tsp" },
      { name: "vegetable oil", quantity: 1, unit: "tbsp" },
      { name: "scallions, thinly sliced", quantity: 2, unit: "stalks" },
      { name: "toasted sesame seeds", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Whisk together white miso paste, softened butter, mirin, soy sauce, honey, and sesame oil until smooth.",
      "Pat salmon fillets completely dry with paper towels; season lightly with salt and pepper.",
      "Heat vegetable oil in a skillet over medium-high heat. Place salmon fillets skin-side down and cook for 4–5 minutes until skin is crispy.",
      "Flip salmon and cook for another 3 minutes.",
      "Lower heat, spoon miso butter glaze evenly over each salmon fillet, and let it melt into the pan.",
      "Baste salmon with the bubbling miso butter for 1–2 minutes until cooked through and glossy.",
      "Transfer salmon to plates, spoon remaining pan sauce over top, and garnish with sliced scallions and toasted sesame seeds."
    ],
    nutritionalInfo: { calories: 410, protein: 36, carbohydrates: 6, fat: 26 }
  },
  {
    title: "Classic French Onion Soup",
    description: "Deeply caramelized yellow onions simmered in a rich beef broth and sherry, topped with toasted baguette slices and melted Gruyère cheese.",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
    prepTime: 20,
    cookTime: 60,
    servings: 4,
    difficulty: "Medium",
    tags: ["French", "Soup", "ComfortFood", "Dinner", "Cheese"],
    ingredients: [
      { name: "yellow onions, thinly sliced", quantity: 1200, unit: "g" },
      { name: "unsalted butter", quantity: 40, unit: "g" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
      { name: "dry sherry or white wine", quantity: 120, unit: "ml" },
      { name: "beef broth", quantity: 1200, unit: "ml" },
      { name: "fresh thyme sprigs", quantity: 4, unit: "pieces" },
      { name: "bay leaf", quantity: 1, unit: "piece" },
      { name: "French baguette slices", quantity: 8, unit: "slices" },
      { name: "Gruyère cheese, grated", quantity: 200, unit: "g" },
      { name: "garlic clove, halved", quantity: 1, unit: "clove" }
    ],
    instructions: [
      "Melt butter with olive oil in a heavy Dutch oven over medium-low heat. Add sliced onions and 0.5 tsp salt.",
      "Cook low and slow for 40–50 minutes, stirring occasionally, until onions are deeply golden brown and caramelized.",
      "Pour in sherry to deglaze the pot, scraping up all browned bits from the bottom. Simmer for 3 minutes.",
      "Add beef broth, thyme sprigs, and bay leaf. Bring to a boil, then reduce heat and simmer covered for 20 minutes. Discard thyme and bay leaf.",
      "Toast baguette slices in an oven or toaster until crisp. Rub each slice with halved garlic clove.",
      "Preheat oven broiler. Ladle hot soup into oven-safe bowls. Top each bowl with toasted baguette slices and cover generously with grated Gruyère.",
      "Broil for 3–4 minutes until cheese is golden, bubbly, and melted over the rim. Serve hot."
    ],
    nutritionalInfo: { calories: 480, protein: 24, carbohydrates: 38, fat: 26 }
  },
  {
    title: "Mediterranean Grilled Chicken Skewers",
    description: "Juicy marinated chicken pieces threaded onto skewers with colourful vegetables, grilled to charred perfection and served with creamy tzatziki.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    tags: ["Mediterranean", "Chicken", "Grilled", "Healthy", "GlutenFree"],
    ingredients: [
      { name: "boneless chicken thighs, cubed", quantity: 700, unit: "g" },
      { name: "olive oil", quantity: 4, unit: "tbsp" },
      { name: "lemon juice", quantity: 3, unit: "tbsp" },
      { name: "garlic cloves, minced", quantity: 4, unit: "cloves" },
      { name: "dried oregano", quantity: 2, unit: "tsp" },
      { name: "ground cumin", quantity: 1, unit: "tsp" },
      { name: "smoked paprika", quantity: 1, unit: "tsp" },
      { name: "ground cinnamon", quantity: 0.25, unit: "tsp" },
      { name: "red onion, cut into chunks", quantity: 1, unit: "large" },
      { name: "red bell pepper, cut into chunks", quantity: 1, unit: "large" },
      { name: "zucchini, sliced into rounds", quantity: 1, unit: "medium" },
      { name: "cherry tomatoes", quantity: 16, unit: "whole" },
      { name: "Greek yogurt", quantity: 200, unit: "g" },
      { name: "cucumber, grated and squeezed dry", quantity: 0.5, unit: "whole" },
      { name: "fresh dill", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Whisk olive oil, lemon juice, garlic, oregano, cumin, smoked paprika, cinnamon, salt, and pepper into a marinade.",
      "Add chicken cubes, toss to coat, cover, and refrigerate at least 1 hour (overnight preferred).",
      "If using wooden skewers, soak in water 30 minutes.",
      "Make tzatziki: combine Greek yogurt, grated cucumber, dill, 1 tbsp lemon juice, and 1 minced garlic clove. Season and refrigerate.",
      "Thread chicken alternately with onion, bell pepper, zucchini, and cherry tomatoes onto skewers.",
      "Preheat grill to medium-high (200°C). Grill skewers 12–15 minutes, turning every 3–4 minutes, until cooked through (74°C internal temp).",
      "Rest 5 minutes; serve with tzatziki, warm pita, and a simple Greek salad."
    ],
    nutritionalInfo: { calories: 420, protein: 44, carbohydrates: 12, fat: 22 }
  }
];

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipebox');
    console.log('Connected to MongoDB for seeding...');
    await Recipe.deleteMany({});
    await Recipe.insertMany(recipes);
    console.log("Database seeded successfully with all recipe titles!");
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

runSeed();

