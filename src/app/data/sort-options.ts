export const sortOptions = ["Views", "Likes", "Comments"] as const;

export type SortOption = (typeof sortOptions)[number];
