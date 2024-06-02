export const blogCategories = [
  "Lifestyle",
  "Technology",
  "Health and Fitness",
  "Food and Drink",
  "Fashion and Beauty",
  "Personal Finance",
  "Education",
  "Business and Entrepreneurship",
  "Arts and Crafts",
  "Entertainment",
  "Travel",
  "Gaming",
  "Other",
] as const;

export type BlogCategory = (typeof blogCategories)[number] | "All";
