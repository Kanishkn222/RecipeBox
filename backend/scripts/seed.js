import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// Resolve directory name and load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const recipes = [
  {
    title: "Mushroom Risotto",
    description: "Creamy Arborio rice cooked slow with earthy sautéed wild mushrooms, white wine, garlic, and freshly grated Parmesan cheese.",
    imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRDPItktBYHhdDN7FSQL9rFIR6gWakVn4-icvzjIi6fzo8BoqDCdbpi4wL7SGAP",
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
    imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT7HlX2x4my18u3Fzal4a06HB2dKH0I1XA_DAWjVwmVgpBxNVvmPdK95fDomabh",
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
    imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQaSVK4Q6NoDctDr1wVMEZqc1tORtIsouDY0tePWqcjf_RMoVl7pooJe605h9yj",
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
  // ── Additional Detailed Recipes ────────────────────────────────────────

  {
    title: "Creamy Garlic Butter Shrimp Scampi",
    description: "Succulent shrimp tossed in a rich, garlicky butter-wine sauce over al dente linguine — a restaurant-worthy dish ready in under 30 minutes.",
    prepTime: 10,
    cookTime: 18,
    servings: 4,
    difficulty: "Easy",
    tags: ["Seafood", "Pasta", "Quick", "Dinner", "Italian"],
    imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSvS-qUkodJbvblcOlW1W7qCeW4rgTmFQz7Dh3jRBQE6mn3zgPAOfyhpytgpiK4",
    ingredients: [
      { name: "large shrimp, peeled and deveined", quantity: 450, unit: "g" },
      { name: "linguine pasta", quantity: 340, unit: "g" },
      { name: "unsalted butter", quantity: 4, unit: "tbsp" },
      { name: "olive oil", quantity: 2, unit: "tbsp" },
      { name: "garlic cloves, minced", quantity: 6, unit: "cloves" },
      { name: "dry white wine", quantity: 120, unit: "ml" },
      { name: "heavy cream", quantity: 120, unit: "ml" },
      { name: "lemon juice, freshly squeezed", quantity: 2, unit: "tbsp" },
      { name: "lemon zest", quantity: 1, unit: "tsp" },
      { name: "red pepper flakes", quantity: 0.5, unit: "tsp" },
      { name: "fresh parsley, chopped", quantity: 3, unit: "tbsp" },
      { name: "parmesan cheese, grated", quantity: 60, unit: "g" },
    ],
    instructions: [
      "Cook linguine in a large pot of salted boiling water until al dente. Reserve 120ml pasta water before draining.",
      "Pat shrimp dry and season with salt, pepper, and red pepper flakes.",
      "Heat olive oil and 2 tbsp butter in a large skillet over medium-high heat. Sear shrimp 1–2 minutes per side until pink. Remove and set aside.",
      "In the same skillet, add remaining butter and garlic. Sauté for 1 minute until fragrant.",
      "Pour in white wine and simmer for 2–3 minutes until reduced by half.",
      "Stir in heavy cream, lemon juice, and lemon zest. Simmer 2–3 minutes until slightly thickened.",
      "Add drained linguine and toss to coat, adding reserved pasta water as needed.",
      "Return shrimp to the pan and toss for 1 minute over low heat.",
      "Remove from heat, stir in parmesan and parsley, and serve immediately.",
    ],
    nutritionalInfo: { calories: 580, protein: 38, carbohydrates: 55, fat: 22 },
  },
  {
    title: "Slow Cooker Pulled Pork Sandwiches",
    description: "Fall-apart tender pulled pork slow-cooked in a smoky, tangy BBQ sauce, piled high on brioche buns with crunchy coleslaw.",
    prepTime: 20,
    cookTime: 480,
    servings: 8,
    difficulty: "Easy",
    tags: ["Pork", "BBQ", "Slow Cooker", "ComfortFood", "American"],
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800",
    ingredients: [
      { name: "pork shoulder (bone-in)", quantity: 1.8, unit: "kg" },
      { name: "smoked paprika", quantity: 2, unit: "tsp" },
      { name: "garlic powder", quantity: 1, unit: "tsp" },
      { name: "onion powder", quantity: 1, unit: "tsp" },
      { name: "brown sugar", quantity: 2, unit: "tbsp" },
      { name: "cumin", quantity: 1, unit: "tsp" },
      { name: "cayenne pepper", quantity: 0.5, unit: "tsp" },
      { name: "BBQ sauce", quantity: 300, unit: "ml" },
      { name: "apple cider vinegar", quantity: 60, unit: "ml" },
      { name: "chicken broth", quantity: 120, unit: "ml" },
      { name: "brioche buns", quantity: 8, unit: "whole" },
      { name: "coleslaw mix", quantity: 300, unit: "g" },
      { name: "mayonnaise", quantity: 4, unit: "tbsp" },
    ],
    instructions: [
      "Combine smoked paprika, garlic powder, onion powder, brown sugar, cumin, cayenne, salt, and pepper into a dry rub.",
      "Pat pork shoulder dry and rub spice mixture all over, pressing it in firmly.",
      "Place pork in the slow cooker. Mix BBQ sauce, vinegar, and broth; pour around the pork.",
      "Cook on LOW for 8–10 hours, or HIGH for 5–6 hours, until fall-apart tender.",
      "Remove pork and shred with two forks, discarding large fat pieces.",
      "Skim fat from cooking juices; pour 240ml of juices back over shredded pork.",
      "Toss coleslaw mix with mayonnaise, a splash of vinegar, salt, and pepper.",
      "Toast brioche buns, pile pulled pork on, top with coleslaw, and serve.",
    ],
    nutritionalInfo: { calories: 650, protein: 45, carbohydrates: 48, fat: 28 },
  },
  {
    title: "Classic Homemade Beef Lasagna",
    description: "Layers of rich Bolognese meat sauce, creamy béchamel, and pasta sheets topped with bubbling golden mozzarella — the ultimate comfort bake.",
    prepTime: 40,
    cookTime: 75,
    servings: 8,
    difficulty: "Hard",
    tags: ["Italian", "Pasta", "Baked", "ComfortFood", "Dinner"],
    imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800",
    ingredients: [
      { name: "dry lasagna sheets", quantity: 12, unit: "sheets" },
      { name: "lean ground beef", quantity: 700, unit: "g" },
      { name: "Italian sausage, casings removed", quantity: 250, unit: "g" },
      { name: "yellow onion, finely diced", quantity: 1, unit: "large" },
      { name: "garlic cloves, minced", quantity: 4, unit: "cloves" },
      { name: "crushed tomatoes", quantity: 800, unit: "g" },
      { name: "tomato paste", quantity: 3, unit: "tbsp" },
      { name: "dried oregano", quantity: 1, unit: "tsp" },
      { name: "unsalted butter", quantity: 60, unit: "g" },
      { name: "all-purpose flour", quantity: 60, unit: "g" },
      { name: "whole milk", quantity: 950, unit: "ml" },
      { name: "nutmeg, freshly grated", quantity: 0.25, unit: "tsp" },
      { name: "mozzarella cheese, shredded", quantity: 400, unit: "g" },
      { name: "parmesan cheese, grated", quantity: 100, unit: "g" },
    ],
    instructions: [
      "Brown ground beef and sausage in a large pot over medium-high heat; drain excess fat.",
      "Add onion and garlic; cook 5 minutes. Stir in tomato paste, cook 1 minute.",
      "Add crushed tomatoes and oregano; simmer on low for 30 minutes.",
      "For béchamel: melt butter, whisk in flour for 1 minute, gradually add milk, stir until thick (8–10 min). Season with nutmeg.",
      "Preheat oven to 190°C (375°F). Cook and drain lasagna sheets.",
      "Layer meat sauce, lasagna sheets, béchamel, and mozzarella in a 23×33cm dish, repeating 3–4 times, finishing with béchamel and parmesan.",
      "Cover with foil and bake 45 minutes. Uncover and bake 15–20 minutes until golden.",
      "Rest 15 minutes before slicing and serving.",
    ],
    nutritionalInfo: { calories: 720, protein: 48, carbohydrates: 62, fat: 32 },
  },
  {
    title: "Crispy Chicken Parmesan with Marinara",
    description: "Golden, breadcrumb-crusted chicken breasts smothered in homemade marinara and melted mozzarella — an Italian-American classic done right.",
    prepTime: 25,
    cookTime: 30,
    servings: 4,
    difficulty: "Medium",
    tags: ["Chicken", "Italian", "Baked", "Dinner", "ComfortFood"],
    imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800",
    ingredients: [
      { name: "boneless, skinless chicken breasts", quantity: 4, unit: "pieces" },
      { name: "panko breadcrumbs", quantity: 150, unit: "g" },
      { name: "parmesan cheese, grated", quantity: 60, unit: "g" },
      { name: "all-purpose flour", quantity: 60, unit: "g" },
      { name: "eggs, beaten", quantity: 2, unit: "large" },
      { name: "garlic powder", quantity: 1, unit: "tsp" },
      { name: "dried Italian herbs", quantity: 1, unit: "tsp" },
      { name: "olive oil", quantity: 3, unit: "tbsp" },
      { name: "crushed tomatoes", quantity: 400, unit: "g" },
      { name: "fresh basil leaves", quantity: 8, unit: "leaves" },
      { name: "garlic cloves, minced", quantity: 3, unit: "cloves" },
      { name: "mozzarella cheese, sliced", quantity: 200, unit: "g" },
    ],
    instructions: [
      "Pound chicken breasts to an even 1.5cm thickness.",
      "Set up breading station: seasoned flour, beaten eggs, and panko mixed with parmesan, garlic powder, and Italian herbs.",
      "Dredge chicken in flour, dip in egg, then press firmly into panko mixture.",
      "Heat olive oil in an oven-safe skillet over medium-high; sear chicken 3–4 minutes per side until golden.",
      "For marinara: sauté garlic 1 minute, add crushed tomatoes, simmer 10 minutes, add torn basil.",
      "Preheat oven to 200°C (400°F). Spoon marinara over chicken in a baking dish; top with mozzarella.",
      "Bake 15–18 minutes until cheese is melted and bubbling. Serve over pasta or salad.",
    ],
    nutritionalInfo: { calories: 560, protein: 52, carbohydrates: 30, fat: 24 },
  },
  {
    title: "Sweet and Sour Chicken with Jasmine Rice",
    description: "Crispy battered chicken in a vibrant, tangy-sweet homemade sauce with pineapple chunks and bell peppers, served over fragrant jasmine rice.",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    tags: ["Chinese", "Chicken", "Takeout", "Dinner", "Asian"],
    imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800",
    ingredients: [
      { name: "boneless chicken thighs, cubed", quantity: 600, unit: "g" },
      { name: "cornstarch", quantity: 80, unit: "g" },
      { name: "eggs, beaten", quantity: 2, unit: "large" },
      { name: "vegetable oil, for frying", quantity: 500, unit: "ml" },
      { name: "red bell pepper, diced", quantity: 1, unit: "large" },
      { name: "green bell pepper, diced", quantity: 1, unit: "large" },
      { name: "pineapple chunks", quantity: 200, unit: "g" },
      { name: "rice vinegar", quantity: 60, unit: "ml" },
      { name: "ketchup", quantity: 60, unit: "ml" },
      { name: "soy sauce", quantity: 2, unit: "tbsp" },
      { name: "sugar", quantity: 50, unit: "g" },
      { name: "garlic cloves, minced", quantity: 2, unit: "cloves" },
      { name: "jasmine rice", quantity: 300, unit: "g" },
    ],
    instructions: [
      "Cook jasmine rice according to package directions; keep warm.",
      "Toss chicken in beaten egg, then coat thoroughly in cornstarch.",
      "Heat oil to 175°C; fry chicken in batches 4–5 minutes until golden and crispy. Drain on paper towels.",
      "Whisk vinegar, ketchup, soy sauce, sugar, and 1 tbsp cornstarch dissolved in 2 tbsp water for the sauce.",
      "Drain most oil from pan. Stir-fry bell peppers 2 minutes over high heat.",
      "Pour in sauce and cook, stirring, until glossy and thickened (about 2 minutes).",
      "Add pineapple and crispy chicken; toss to coat in the sauce.",
      "Serve over jasmine rice, garnished with sesame seeds and sliced scallions.",
    ],
    nutritionalInfo: { calories: 620, protein: 35, carbohydrates: 78, fat: 18 },
  },
  {
    title: "Lemon Garlic Grilled Salmon Fillets",
    description: "Juicy, flaky salmon fillets marinated in zesty lemon, garlic, and herb butter, grilled to perfection with beautiful charred edges.",
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "Easy",
    tags: ["Seafood", "Grilled", "Healthy", "Dinner", "LowCarb"],
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800",
    ingredients: [
      { name: "salmon fillets, skin-on", quantity: 4, unit: "pieces" },
      { name: "unsalted butter, melted", quantity: 3, unit: "tbsp" },
      { name: "garlic cloves, minced", quantity: 4, unit: "cloves" },
      { name: "lemon juice, freshly squeezed", quantity: 3, unit: "tbsp" },
      { name: "lemon zest", quantity: 1, unit: "tbsp" },
      { name: "fresh dill, chopped", quantity: 2, unit: "tbsp" },
      { name: "fresh parsley, chopped", quantity: 2, unit: "tbsp" },
      { name: "Dijon mustard", quantity: 1, unit: "tsp" },
      { name: "honey", quantity: 1, unit: "tsp" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
    ],
    instructions: [
      "Whisk together butter, garlic, lemon juice, zest, Dijon, honey, dill, and parsley.",
      "Pat salmon dry; spoon half the marinade over fillets and marinate 15–20 minutes.",
      "Preheat grill to medium-high (220°C) and oil the grates generously.",
      "Brush salmon with olive oil and season with salt and pepper.",
      "Place salmon skin-side down; grill 4–5 minutes without moving. Flip and grill 3–4 more minutes until it flakes easily at 63°C internal temp.",
      "During the last minute, brush remaining marinade over the flesh side.",
      "Serve with lemon slices and steamed asparagus or a light green salad.",
    ],
    nutritionalInfo: { calories: 380, protein: 42, carbohydrates: 4, fat: 21 },
  },
  {
    title: "Quinoa and Roasted Vegetable Salad",
    description: "Hearty, protein-packed quinoa tossed with caramelized roasted vegetables, toasted pine nuts, and a bright lemon-tahini dressing.",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    tags: ["Vegan", "Healthy", "Salad", "Vegetarian", "GlutenFree"],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    ingredients: [
      { name: "quinoa, rinsed", quantity: 200, unit: "g" },
      { name: "vegetable broth", quantity: 400, unit: "ml" },
      { name: "zucchini, diced", quantity: 1, unit: "large" },
      { name: "red bell pepper, diced", quantity: 1, unit: "large" },
      { name: "red onion, wedged", quantity: 1, unit: "medium" },
      { name: "cherry tomatoes", quantity: 200, unit: "g" },
      { name: "chickpeas, drained and rinsed", quantity: 400, unit: "g" },
      { name: "olive oil", quantity: 3, unit: "tbsp" },
      { name: "tahini", quantity: 3, unit: "tbsp" },
      { name: "lemon juice", quantity: 3, unit: "tbsp" },
      { name: "maple syrup", quantity: 1, unit: "tsp" },
      { name: "garlic clove, minced", quantity: 1, unit: "clove" },
      { name: "pine nuts, toasted", quantity: 40, unit: "g" },
      { name: "fresh parsley, chopped", quantity: 3, unit: "tbsp" },
    ],
    instructions: [
      "Preheat oven to 220°C (425°F). Toss zucchini, bell pepper, onion, tomatoes, and chickpeas with 2 tbsp olive oil; season and spread on a baking sheet.",
      "Roast 25–30 minutes, tossing halfway, until caramelized at the edges.",
      "Cook quinoa in vegetable broth: bring to a boil, reduce heat, cover, and cook 15 minutes. Steam 5 minutes off heat; fluff with a fork.",
      "Whisk tahini, lemon juice, remaining oil, maple syrup, garlic, and 2–3 tbsp warm water into a smooth dressing. Season with salt.",
      "Combine warm quinoa and roasted vegetables in a large bowl. Pour dressing over and toss.",
      "Top with toasted pine nuts and fresh parsley. Serve warm or at room temperature.",
    ],
    nutritionalInfo: { calories: 420, protein: 18, carbohydrates: 52, fat: 16 },
  },
  {
    title: "Thai Red Curry with Tofu and Vegetables",
    description: "A deeply aromatic, coconut-based Thai red curry loaded with silky tofu, vibrant vegetables, and fragrant Thai basil — rich, creamy, and utterly satisfying.",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    tags: ["Thai", "Vegan", "Curry", "Dinner", "Asian"],
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
    ingredients: [
      { name: "firm tofu, pressed and cubed", quantity: 400, unit: "g" },
      { name: "coconut milk, full-fat", quantity: 400, unit: "ml" },
      { name: "Thai red curry paste", quantity: 3, unit: "tbsp" },
      { name: "vegetable broth", quantity: 240, unit: "ml" },
      { name: "soy sauce", quantity: 2, unit: "tbsp" },
      { name: "brown sugar", quantity: 1, unit: "tbsp" },
      { name: "lime juice, freshly squeezed", quantity: 2, unit: "tbsp" },
      { name: "coconut oil", quantity: 2, unit: "tbsp" },
      { name: "red bell pepper, sliced", quantity: 1, unit: "large" },
      { name: "broccoli florets", quantity: 200, unit: "g" },
      { name: "baby spinach", quantity: 80, unit: "g" },
      { name: "snap peas", quantity: 100, unit: "g" },
      { name: "fresh Thai basil", quantity: 20, unit: "g" },
      { name: "jasmine rice, for serving", quantity: 300, unit: "g" },
    ],
    instructions: [
      "Press tofu; cube into 2cm pieces. Pan-fry in 1 tbsp coconut oil until golden on all sides. Set aside.",
      "Cook jasmine rice according to package directions.",
      "Heat remaining oil in a wok over medium heat. Add curry paste; fry 1–2 minutes until very fragrant.",
      "Pour in coconut milk and vegetable broth; stir to combine. Add soy sauce and sugar; bring to a gentle simmer.",
      "Add broccoli and bell pepper; cook 5 minutes until just tender-crisp.",
      "Add snap peas, baby spinach, and tofu; stir gently and cook 2–3 more minutes.",
      "Remove from heat; stir in lime juice and adjust seasoning.",
      "Serve over jasmine rice, garnished with fresh Thai basil and sliced red chili.",
    ],
    nutritionalInfo: { calories: 470, protein: 22, carbohydrates: 48, fat: 24 },
  },
  {
    title: "Mediterranean Grilled Chicken Skewers",
    description: "Juicy marinated chicken pieces threaded onto skewers with colourful vegetables, grilled to charred perfection and served with creamy tzatziki.",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    tags: ["Mediterranean", "Chicken", "Grilled", "Healthy", "GlutenFree"],
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
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
      { name: "fresh dill", quantity: 1, unit: "tbsp" },
    ],
    instructions: [
      "Whisk olive oil, lemon juice, garlic, oregano, cumin, smoked paprika, cinnamon, salt, and pepper into a marinade.",
      "Add chicken cubes, toss to coat, cover, and refrigerate at least 1 hour (overnight preferred).",
      "If using wooden skewers, soak in water 30 minutes.",
      "Make tzatziki: combine Greek yogurt, grated cucumber, dill, 1 tbsp lemon juice, and 1 minced garlic clove. Season and refrigerate.",
      "Thread chicken alternately with onion, bell pepper, zucchini, and cherry tomatoes onto skewers.",
      "Preheat grill to medium-high (200°C). Grill skewers 12–15 minutes, turning every 3–4 minutes, until cooked through (74°C internal temp).",
      "Rest 5 minutes; serve with tzatziki, warm pita, and a simple Greek salad.",
    ],
    nutritionalInfo: { calories: 420, protein: 44, carbohydrates: 12, fat: 22 },
  },
  {
    title: "Garlic Butter Baked Cod with Asparagus",
    description: "Tender, flaky cod fillets baked in a herby garlic butter sauce alongside crisp asparagus spears — a light, nutritious, one-pan dinner in 30 minutes.",
    prepTime: 10,
    cookTime: 18,
    servings: 4,
    difficulty: "Easy",
    tags: ["Seafood", "Healthy", "Baked", "LowCarb", "Dinner"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS2aeg7RqfYVl_HzFIPrwFGEw5-L3CSfec2jS_cdlALHXbjlOYRuR2Gw0TvFRh",
    ingredients: [
      { name: "cod fillets", quantity: 4, unit: "pieces" },
      { name: "fresh asparagus, trimmed", quantity: 400, unit: "g" },
      { name: "unsalted butter", quantity: 4, unit: "tbsp" },
      { name: "garlic cloves, minced", quantity: 5, unit: "cloves" },
      { name: "lemon juice", quantity: 2, unit: "tbsp" },
      { name: "lemon zest", quantity: 1, unit: "tsp" },
      { name: "fresh thyme leaves", quantity: 1, unit: "tsp" },
      { name: "fresh parsley, chopped", quantity: 2, unit: "tbsp" },
      { name: "white wine", quantity: 60, unit: "ml" },
      { name: "capers, drained", quantity: 2, unit: "tbsp" },
      { name: "red pepper flakes", quantity: 0.25, unit: "tsp" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
    ],
    instructions: [
      "Preheat oven to 200°C (400°F). Lightly grease a large baking dish.",
      "Arrange asparagus in a single layer; drizzle with olive oil and season.",
      "Place cod fillets on top; season with salt, pepper, and red pepper flakes.",
      "Melt butter in a small saucepan; add garlic and cook 1 minute. Remove from heat; stir in lemon juice, zest, white wine, and thyme.",
      "Pour garlic butter sauce over cod and asparagus; scatter capers around the dish.",
      "Bake uncovered 15–18 minutes, until cod flakes easily and reaches 63°C internal temp.",
      "Spoon pan juices over the fish, garnish with parsley, and serve with crusty bread.",
    ],
    nutritionalInfo: { calories: 310, protein: 38, carbohydrates: 6, fat: 15 },
  },
];

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipebox');
    console.log('Connected to MongoDB for seeding...');
    await User.deleteMany({});
    await Recipe.deleteMany({});

    console.log('Seeding demo users...');
    const userAlice = await User.create({
      username: 'alice_cooks',
      email: 'alice@example.com',
      password: 'password123',
      bio: 'Passionate home chef & pasta lover 🍝',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    });

    const userBob = await User.create({
      username: 'bob_bakes',
      email: 'bob@example.com',
      password: 'password123',
      bio: 'Sourdough enthusiast & pastry wizard 🥐',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const userCharlie = await User.create({
      username: 'charlie_chef',
      email: 'charlie@example.com',
      password: 'password123',
      bio: 'Culinary explorer & spice master 🌶️',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    });

    // Set up follow graph
    userAlice.following = [userBob._id, userCharlie._id];
    userBob.followers = [userAlice._id];
    userCharlie.followers = [userAlice._id];

    userBob.following = [userAlice._id];
    userAlice.followers.push(userBob._id);

    await userAlice.save();
    await userBob.save();

    console.log('Users seeded: alice_cooks, bob_bakes, charlie_chef');

    const authors = [userAlice._id, userBob._id, userCharlie._id];
    const recipesWithAuthors = recipes.map((recipe, index) => ({
      ...recipe,
      author: authors[index % authors.length],
    }));

    await Recipe.insertMany(recipesWithAuthors);
    console.log(`Database seeded successfully with ${recipes.length} recipes!`);
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

runSeed();

