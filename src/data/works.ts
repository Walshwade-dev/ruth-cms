export interface ImageStyle {
  /** Tailwind aspect-ratio class for the photograph's natural frame. */
  aspect: string;
  /** CSS object-position focal point, used whenever the frame crops the photo. */
  objectPosition: string;
}

export interface PracticalWork {
  id: string;
  slug: string;
  title: string;
  category: string;
  /** Facts directly observable in the photograph (labels, dishes, actions). */
  confirmedDetails: string[];
  /** Internal-only notes. Never rendered publicly. */
  suggestedContext: string[];
  status: "Published" | "Pending Confirmation";
  /**
   * Public editorial copy. Describes only what is visible in the photograph;
   * must not introduce techniques, results or claims. Owner should review.
   */
  summary?: string;
  /** Call-to-action label used on cards linking to the detail page. */
  ctaLabel?: string;
  featuredImage: string | null;
  featuredImageAlt: string;
  imageStyle?: ImageStyle;
}

export const works: PracticalWork[] = [
  {
    id: "pw-1",
    slug: "vegetable-preparation",
    title: "Vegetable Preparation",
    category: "",
    confirmedDetails: ["Sliced tomatoes and cucumbers on a plate."],
    suggestedContext: ["Vegetable prep", "Starter dish presentation"],
    status: "Pending Confirmation",
    featuredImage: "/images/portfolio/vegetable-preparation.jpg",
    featuredImageAlt: "Sliced tomatoes and cucumbers arranged on a plate",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center" }
  },
  {
    id: "pw-2",
    slug: "poultry-preparation",
    title: "Poultry Preparation",
    category: "Main Meals",
    confirmedDetails: ["Ruth in uniform deboning and portioning raw chicken on a board."],
    suggestedContext: ["Main meal preparation", "Butchery skills"],
    status: "Published",
    summary:
      "A working moment at the station: Ruth, in full chef's whites, portioning raw chicken on a wooden board.",
    ctaLabel: "Step into the kitchen",
    featuredImage: "/images/portfolio/poultry-preparation.jpg",
    featuredImageAlt: "Ruth deboning and portioning raw chicken",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 40%" }
  },
  {
    id: "pw-3",
    slug: "meat-and-savory-pies",
    title: "Meat & Savory Pies",
    category: "Pastry",
    confirmedDetails: ["Two presented pastries with physical labels reading 'MEAT PIE' and 'SAVORY PIE'."],
    suggestedContext: ["Pastry assessment"],
    status: "Published",
    summary:
      "Two golden pastries plated side by side, labelled Meat Pie and Savory Pie and set out for presentation.",
    ctaLabel: "See the pastry",
    featuredImage: "/images/portfolio/meat-and-savory-pies.jpg",
    featuredImageAlt: "Presented meat and savory pies with labels",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 72%" }
  },
  {
    id: "pw-4",
    slug: "citrus-preparation",
    title: "Citrus Preparation",
    category: "",
    confirmedDetails: ["Ruth in uniform slicing citrus fruit."],
    suggestedContext: ["Dessert or garnish preparation"],
    status: "Pending Confirmation",
    featuredImage: "/images/portfolio/citrus-preparation.jpg",
    featuredImageAlt: "Ruth slicing citrus fruit on a board",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 30%" }
  },
  {
    id: "pw-5",
    slug: "sauce-preparation",
    title: "Sauce Preparation",
    category: "",
    confirmedDetails: ["Ruth stirring a dark mixture in a pot."],
    suggestedContext: ["Dessert or sauce preparation"],
    status: "Pending Confirmation",
    featuredImage: "/images/portfolio/sauce-preparation.jpg",
    featuredImageAlt: "Ruth stirring a dark mixture in a metal pot",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 30%" }
  },
  {
    id: "pw-6",
    slug: "herbed-chicken",
    title: "Herbed Chicken & Sides",
    category: "Main Meals",
    confirmedDetails: ["Three dishes with physical labels: 'Cheese Sauce', 'Herbed Chicken With Green Herb Sauce', and 'Red Cabbage With Apple'."],
    suggestedContext: ["Main meal practical assessment"],
    status: "Published",
    summary:
      "A main course in three parts: herbed chicken with green herb sauce, red cabbage with apple, and a cheese sauce, each plated and labelled.",
    ctaLabel: "Explore the main course",
    featuredImage: "/images/portfolio/herbed-chicken.jpg",
    featuredImageAlt: "Dishes labeled Cheese Sauce, Herbed Chicken, and Red Cabbage",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 45%" }
  },
  {
    id: "pw-7",
    slug: "minestrone-and-avocado",
    title: "Minestrone Soup & Avocado Salad",
    category: "Starter Meals",
    confirmedDetails: ["Dishes with labels 'Avocado Pear / Vinaigrette Dressing' and 'Minestrone Soup', alongside an assessment document."],
    suggestedContext: ["Starter meal assessment"],
    status: "Published",
    summary:
      "A starter pairing: minestrone soup finished with fresh herbs, served alongside avocado pear on lettuce with a vinaigrette dressing.",
    ctaLabel: "Explore the starters",
    featuredImage: "/images/portfolio/minestrone-and-avocado.jpg",
    featuredImageAlt: "Minestrone soup and Avocado Pear salad with labels",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 45%" }
  },
  {
    id: "pw-8",
    slug: "yellow-rice-dish",
    title: "Yellow Rice Dish",
    category: "",
    confirmedDetails: ["Yellow tinted rice dish garnished with green herbs and nuts."],
    suggestedContext: ["Pilau or Biryani style preparation", "Main meal accompaniment"],
    status: "Pending Confirmation",
    featuredImage: "/images/portfolio/yellow-rice-dish.jpg",
    featuredImageAlt: "Yellow rice dish garnished with herbs and nuts",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center" }
  },
  {
    id: "pw-9",
    slug: "pea-veloute",
    title: "Pea Velouté & Bread Rolls",
    category: "Starter Meals",
    confirmedDetails: ["Dishes with labels 'Croutons', 'Bread Rolls', and 'Pea Velouté'."],
    suggestedContext: ["Starter meal and baking assessment"],
    status: "Published",
    summary:
      "A bright green pea velouté topped with fine strips of carrot, served with golden croutons and a glazed bread roll.",
    ctaLabel: "See the full spread",
    featuredImage: "/images/portfolio/pea-veloute.jpg",
    featuredImageAlt: "Bowls of Pea Veloute, croutons, and a bread roll with labels",
    imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 60%" }
  }
];

/** The only works that may appear anywhere in the public UI. */
export const getPublishedWorks = () => works.filter((w) => w.status === "Published");

export const getPublishedWork = (slug: string) =>
  getPublishedWorks().find((w) => w.slug === slug);

export const getCategories = () => {
  const cats = new Set(getPublishedWorks().filter((w) => w.category !== "").map((w) => w.category));
  return Array.from(cats).sort();
};
