export interface LearningNode {
  id: string;
  name: string;
  description?: string;
}

// Learning Areas (Curriculum modules/categories of food)
export const learningAreas: LearningNode[] = [
  { id: "la-1", name: "Starter meals" },
  { id: "la-2", name: "Main meals" },
  { id: "la-3", name: "Desserts" },
  { id: "la-4", name: "Pastry" },
  { id: "la-5", name: "Special dishes" },
  { id: "la-6", name: "Baking" },
];

// Skills (Competencies and techniques)
export const coreSkills: LearningNode[] = [
  { id: "sk-1", name: "Food preparation" },
  { id: "sk-2", name: "Food presentation" },
  { id: "sk-3", name: "Cooking techniques" },
  { id: "sk-4", name: "Food safety" },
  { id: "sk-5", name: "Kitchen hygiene" },
  { id: "sk-6", name: "Menu planning" },
  { id: "sk-7", name: "Kitchen management" },
  { id: "sk-8", name: "Hospitality" },
];

/**
 * Editorial grouping of the confirmed learning areas and skills into a
 * readable "flow" for the Learning Journey page.
 *
 * IMPORTANT: this is a thematic map, not a chronology. It does not claim the
 * order in which topics were studied or any level of attainment. Stage copy
 * describes the discipline itself, not Ruth's results.
 */
export interface JourneyStage {
  id: string;
  label: string;
  title: string;
  description: string;
  skillIds?: string[];
  areaIds?: string[];
  /** Maps learning areas to published portfolio categories for evidence links. */
  portfolioCategories?: string[];
}

export const journeyStages: JourneyStage[] = [
  {
    id: "js-1",
    label: "Foundations",
    title: "Safe, clean, ready",
    description:
      "The habits every professional kitchen depends on: handling food safely and keeping the workspace hygienic.",
    skillIds: ["sk-4", "sk-5"],
  },
  {
    id: "js-2",
    label: "Technique",
    title: "Preparation & cooking",
    description:
      "Working with raw ingredients at the board and at the stove, the practical core of the craft.",
    skillIds: ["sk-1", "sk-3"],
  },
  {
    id: "js-3",
    label: "The Menu",
    title: "Course by course",
    description:
      "The curriculum moves across the full menu, from starters and mains to pastry, baking, desserts and special dishes.",
    areaIds: ["la-1", "la-2", "la-3", "la-4", "la-5", "la-6"],
    portfolioCategories: ["Starter Meals", "Main Meals", "Pastry"],
  },
  {
    id: "js-4",
    label: "Service",
    title: "Presentation & hospitality",
    description:
      "How food reaches the guest: plating, labelling and presenting each dish, and the hospitality around it.",
    skillIds: ["sk-2", "sk-8"],
  },
  {
    id: "js-5",
    label: "Management",
    title: "Planning the kitchen",
    description:
      "Looking beyond a single plate to menu planning and the running of a kitchen.",
    skillIds: ["sk-6", "sk-7"],
  },
];
