/**
 * Centralized Configuration System for the Luxury Birthday Experience
 * 
 * Customize all celebrant details, messages, photographs, and celebration settings here.
 * Any component in the app reads from this single source of truth.
 */

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  location?: string;
  year?: string;
  alt: string;
}

export interface BirthdayConfig {
  // Celebrant Identity
  celebrantName: string;
  nickname?: string;
  age?: number | null; // e.g. 28, or null if preferred
  celebrationDate: string; // e.g. "November 10"

  // Cinematic Intro Screen
  intro: {
    kicker: string;
    preTitle: string;
    subtitle: string;
    enterButtonText: string;
    skipButtonText: string;
  };

  // Grand Hero Section
  hero: {
    tagline: string;
    mainTitle: string;
    subtitle: string;
    scrollHint: string;
  };

  // 3D Surprise Gift Box
  surprise: {
    sectionHeadline: string;
    subheadline: string;
    boxPrompt: string;
    giftTag: string;
    revealedTitle: string;
    revealedMessage: string;
    revealedSignoff: string;
  };

  // Personalized Editorial Letter
  letter: {
    eyebrow: string;
    title: string;
    dateText: string;
    paragraphs: string[];
    signatureTitle: string;
    signatureName: string;
  };

  // Photo Gallery
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    photos: GalleryPhoto[];
  };

  // Make a Wish Candle Ceremony
  wish: {
    eyebrow: string;
    title: string;
    instruction: string;
    blowButtonText: string;
    blownButtonText: string;
    fulfilledMessage: string;
    wishQuote: string;
  };

  // Final Cinematic Ending
  ending: {
    headline: string;
    subheadline: string;
    signoff: string;
    copyright: string;
  };

  // Audio Configuration
  audio: {
    ambientSoundtrack: boolean;
    soundEffects: boolean;
  };
}

export const defaultBirthdayConfig: BirthdayConfig = {
  celebrantName: "Sophia",
  nickname: "Sophie",
  age: 28,
  celebrationDate: "November 10",

  intro: {
    kicker: "AN EXCLUSIVE CELEBRATION",
    preTitle: "A SPECIAL DAY. A SPECIAL SOUL.",
    subtitle: "Something truly beautiful has been crafted in your honor.",
    enterButtonText: "ENTER YOUR CELEBRATION",
    skipButtonText: "Skip Intro",
  },

  hero: {
    tagline: "EDITION ROYALE · 2026",
    mainTitle: "HAPPY BIRTHDAY",
    subtitle: "Today, the world celebrates someone truly extraordinary.",
    scrollHint: "EXPLORE THE CELEBRATION",
  },

  surprise: {
    sectionHeadline: "A MOMENT OF WONDER",
    subheadline: "There's Something Special Waiting For You...",
    boxPrompt: "Touch the golden gift to unlock your surprise",
    giftTag: "FOR THE CELEBRANT",
    revealedTitle: "A Royal Birthday Surprise",
    revealedMessage:
      "May your life always be filled with boundless happiness, radiant health, unforgettable adventures, and love that knows no measure. You illuminate every room you enter, bringing grace and laughter wherever you go.",
    revealedSignoff: "With all my admiration and deepest love.",
  },

  letter: {
    eyebrow: "MEMORANDUM OF AFFECTION",
    title: "A MESSAGE FROM THE HEART",
    dateText: "Celebrating your timeless journey",
    paragraphs: [
      "Some people make ordinary moments extraordinary simply by being in them.",
      "Some people bring warmth and reassurance simply by being their authentic selves. You are that rare, luminous presence in a world that often rushes past the things that truly matter.",
      "Today is not merely a milestone on the calendar; it is a celebration of your kindness, your resilience, your radiant spirit, and every dream you have fearlessly pursued.",
      "May this new chapter bring you countless reasons to smile, triumphs that exceed your wildest imaginations, and peaceful moments that stay etched in your memory forever.",
      "You deserve every magnificent and beautiful gift that life has to offer.",
    ],
    signatureTitle: "EVER YOURS IN CELEBRATION",
    signatureName: "With All My Heart",
  },

  gallery: {
    eyebrow: "ARCHIVE OF LIGHT",
    title: "CHERISHED MEMORIES",
    subtitle: "A curated collection of unforgettable moments, laughter, and timeless grace.",
    photos: [
      {
        id: "photo-user-card",
        url: "/assets/aistudio/images__1__add37047.jpg",
        title: "The Golden Tribute",
        caption: "A joyful celebration surrounded by golden balloons and heartfelt wishes.",
        location: "Private Salon",
        year: "2026",
        alt: "Luxury birthday balloons and greeting card",
      },
      {
        id: "photo-champagne",
        url: "/src/assets/images/gallery_champagne_toast_1794337676919.jpg",
        title: "A Toast to Splendor",
        caption: "Crystal flutes raised high under the warm glow of candlelight.",
        location: "Grand Dining Room",
        year: "2026",
        alt: "Luxury birthday champagne toast with crystal flutes",
      },
      {
        id: "photo-portrait",
        url: "/src/assets/images/gallery_birthday_portrait_1794337677569.jpg",
        title: "Radiant Joy",
        caption: "A brilliant smile illuminated by golden sparklers and evening glamour.",
        location: "The Gala",
        year: "2026",
        alt: "Joyful birthday celebrant holding golden sparklers",
      },
      {
        id: "photo-table",
        url: "/src/assets/images/gallery_luxury_table_setting_1794337678877.jpg",
        title: "Evening of Elegance",
        caption: "Orchids, candelabras, and golden accents prepared for an unforgettable dinner.",
        location: "The Vault Room",
        year: "2026",
        alt: "Exquisite luxury birthday table setting with golden candelabras",
      },
      {
        id: "photo-moments",
        url: "/src/assets/images/gallery_celebration_moments_1794337679227.jpg",
        title: "Twilight Skyline",
        caption: "Heartfelt laughter and toasts overlooking city lights at dusk.",
        location: "Rooftop Terrace",
        year: "2026",
        alt: "Celebration moments with friends on a rooftop terrace",
      },
    ],
  },

  wish: {
    eyebrow: "THE CEREMONY",
    title: "MAKE A WISH.",
    instruction: "Close your eyes, hold your deepest aspiration close to your heart, and blow out the candles.",
    blowButtonText: "BLOW THE CANDLES",
    blownButtonText: "WISH SENT TO THE STARS",
    fulfilledMessage: "May every wish you make today find its way into reality.",
    wishQuote: "The stars align for those who dare to dream with pure intention.",
  },

  ending: {
    headline: "THE WORLD IS A LITTLE MORE BEAUTIFUL WITH YOU IN IT.",
    subheadline: "Happy Birthday. Here's to another extraordinary chapter.",
    signoff: "L'ANNIVERSAIRE ROYALE",
    copyright: "Designed with enduring reverence and love.",
  },

  audio: {
    ambientSoundtrack: true,
    soundEffects: true,
  },
};

/**
 * Formats an age number into an English ordinal (e.g. 21 -> "21st", 28 -> "28th")
 */
export function formatAgeOrdinal(age?: number | null): string {
  if (!age || age <= 0) return "";
  const remainder10 = age % 10;
  const remainder100 = age % 100;

  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${age}th`;
  }

  switch (remainder10) {
    case 1:
      return `${age}st`;
    case 2:
      return `${age}nd`;
    case 3:
      return `${age}rd`;
    default:
      return `${age}th`;
  }
}

/**
 * Sanitizes and validates a customized config object, ensuring required fields are populated
 */
export function sanitizeBirthdayConfig(custom?: Partial<BirthdayConfig>): BirthdayConfig {
  if (!custom) return { ...defaultBirthdayConfig };

  return {
    ...defaultBirthdayConfig,
    ...custom,
    celebrantName: custom.celebrantName?.trim() || defaultBirthdayConfig.celebrantName,
    age: custom.age !== undefined ? custom.age : defaultBirthdayConfig.age,
    celebrationDate: custom.celebrationDate?.trim() || defaultBirthdayConfig.celebrationDate,
    intro: {
      ...defaultBirthdayConfig.intro,
      ...custom.intro,
    },
    hero: {
      ...defaultBirthdayConfig.hero,
      ...custom.hero,
    },
    surprise: {
      ...defaultBirthdayConfig.surprise,
      ...custom.surprise,
    },
    letter: {
      ...defaultBirthdayConfig.letter,
      ...custom.letter,
      paragraphs:
        custom.letter?.paragraphs && custom.letter.paragraphs.length > 0
          ? custom.letter.paragraphs
          : defaultBirthdayConfig.letter.paragraphs,
    },
    gallery: {
      ...defaultBirthdayConfig.gallery,
      ...custom.gallery,
      photos:
        custom.gallery?.photos && custom.gallery.photos.length > 0
          ? custom.gallery.photos
          : defaultBirthdayConfig.gallery.photos,
    },
    wish: {
      ...defaultBirthdayConfig.wish,
      ...custom.wish,
    },
    ending: {
      ...defaultBirthdayConfig.ending,
      ...custom.ending,
    },
    audio: {
      ...defaultBirthdayConfig.audio,
      ...custom.audio,
    },
  };
}
