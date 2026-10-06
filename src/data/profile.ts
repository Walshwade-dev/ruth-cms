export interface SocialLink {
  platform: string;
  url: string | null;
}

export interface ProfileData {
  name: string;
  title: string;
  institution: string;
  programme: string;
  level: string;
  careerDirection: string[];
  /** Approved public statement of intent (already used on the homepage). */
  statement: string;
  bio: string | null;
  image: string | null;
  imageStyle?: {
    aspect: string;
    objectPosition: string;
  };
  contact: {
    email: string | null;
    phone: string | null;
    socials: SocialLink[];
  };
}

export const profileData: ProfileData = {
  name: "Ruth Shiru",
  title: "Food & Beverage Practitioner in Training",
  institution: "Mathioya Technical Institute",
  programme: "Food and Beverages Certification Short Course",
  level: "Level 4",
  careerDirection: [
    "Food entrepreneurship",
    "Catering",
    "Continued advancement in food-related education and professional practice"
  ],
  statement:
    "Dedicated to the craft of culinary preparation and the foundations of food entrepreneurship. Currently advancing skills in catering and professional hospitality.",
  bio: null, // Awaiting owner-supplied biography; section is hidden while null
  image: "/images/profile/ruth-shiru.jpg",
  imageStyle: { aspect: "aspect-[3/4]", objectPosition: "center 30%" },
  contact: {
    email: null,
    phone: null,
    socials: [
      { platform: "LinkedIn", url: null },
      { platform: "Instagram", url: null }
    ]
  }
};
