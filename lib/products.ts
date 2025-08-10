export interface Template {
  name: string;
  description: string;
  price: string;
  templateImages: string[];
  exampleImages: string[];
  features: string[];
}

export interface ProductType {
  title: string;
  description: string;
  basePrice: number;
  templates: Record<string, Template>;
}

export const productData: Record<string, ProductType> = {
  calendar: {
    title: "Calendar",
    description:
      "12-month personalized calendars with your face swapped onto hilarious scenes",
    basePrice: 24.99,
    templates: {
      swimsuit: {
        name: "Swimsuit Calendar",
        description:
          "Beach body ready! Put your face on stunning swimsuit models throughout the year.",
        price: "$24.99",
        templateImages: [
          "/template-images/swimsuit/1S.png",
          "/template-images/swimsuit/2S.png",
          "/template-images/swimsuit/3S.png",
          "/template-images/swimsuit/4S.png",
          "/template-images/swimsuit/5S.png",
          "/template-images/swimsuit/6S.png",
          "/template-images/swimsuit/7S.png",
          "/template-images/swimsuit/8S.png",
          "/template-images/swimsuit/9S.png",
          "/template-images/swimsuit/10S.png",
          "/template-images/swimsuit/11S.png",
          "/template-images/swimsuit/12S.png",
        ],
        exampleImages: [
          "/template-examples/swimsuit/swapped_1S.png",
          "/template-examples/swimsuit/swapped_6S.png",
          "/template-examples/swimsuit/swapped_9S.png",
          "/template-examples/swimsuit/swapped_10S.png",
        ],
        features: [
          "12 months",
          "High-quality print",
          "Spiral bound",
          "8.5x11 inches",
          "Premium glossy finish",
        ],
      },
      superhero: {
        name: "Superhero Calendar",
        description:
          "Become the hero you were meant to be with iconic superhero poses throughout the year.",
        price: "$29.99",
        templateImages: [
          "/template-images/superhero/1superman.png",
          "/template-images/superhero/2ironman.png",
          "/template-images/superhero/3captainamerica.png",
          "/template-images/superhero/4thor.png",
          "/template-images/superhero/5doctorstrange.png",
          "/template-images/superhero/6aquaman.png",
          "/template-images/superhero/7hulk.png",
          "/template-images/superhero/8spiderman.png",
          "/template-images/superhero/9wolverine.png",
          "/template-images/superhero/10greenlantern.png",
          "/template-images/superhero/11blackpanther.png",
          "/template-images/superhero/12batman.png",
        ],
        exampleImages: [
          "/template-examples/superhero/swapped_1superman.png",
          "/template-examples/superhero/swapped_2ironman.png",
          "/template-examples/superhero/swapped_3captainamerica.png",
          "/template-examples/superhero/swapped_12batman.png",
          "/template-examples/superhero/swapped_5doctorstrange.png",
        ],
        features: [
          "12 months",
          "Action-packed scenes",
          "Comic book style",
          "8.5x11 inches",
          "Superhero themes",
        ],
      },
      memes: {
        name: "Meme Calendar",
        description:
          "Internet famous! Your face on the world's funniest memes throughout the year.",
        price: "$22.99",
        templateImages: [
          "/template-images/meme/1fourseasonsorlando.png",
          "/template-images/meme/2sendittomerachel.png",
          "/template-images/meme/3sideyechloe.png",
          "/template-images/meme/4hideYoKids.png",
          "/template-images/meme/5youKnowIHadtodoittoem.png",
          "/template-images/meme/6gavin.png",
          "/template-images/meme/7caniborrow.png",
          "/template-images/meme/8photogenicGuy.png",
          "/template-images/meme/9holdingfart.png",
          "/template-images/meme/10ermagerd.png",
          "/template-images/meme/11deeznuts.png",
          "/template-images/meme/12screamingliberal.png",
        ],
        exampleImages: [
          "/template-examples/memes/swapped_1fourseasonsorlando.png",
          "/template-examples/memes/swapped_4hideYoKids.png",
          "/template-examples/memes/swapped_5youKnowIHadtodoittoem.png",
          "/template-examples/memes/swapped_7caniborrow.png",
          "/template-examples/memes/swapped_9holdingfart.png",
        ],
        features: [
          "12 months",
          "Viral meme templates",
          "Internet comedy gold",
          "8.5x11 inches",
          "Trending memes",
        ],
      },
      junkies: {
        name: "Adrenaline Junkies Calendar",
        description:
          "Extreme sports and death-defying stunts - safely from your calendar.",
        price: "$26.99",
        templateImages: [
          "/template-images/junkies/1Sharks.png",
          "/template-images/junkies/2Skydive.png",
          "/template-images/junkies/3Skiier.png",
          "/template-images/junkies/4Bulls.png",
          "/template-images/junkies/5Parachute.png",
          "/template-images/junkies/6RockClimbing.png",
          "/template-images/junkies/7Skateboard.png",
          "/template-images/junkies/8Building.png",
          "/template-images/junkies/9Spelunking.png",
          "/template-images/junkies/10rollercoaster.png",
          "/template-images/junkies/11airsoft.png",
          "/template-images/junkies/12CliffJumping.png",
        ],
        exampleImages: [
          "/template-examples/junkies/swapped_1Sharks.png",
          "/template-examples/junkies/swapped_5Parachute.png",
          "/template-examples/junkies/swapped_6RockClimbing.png",
          "/template-examples/junkies/swapped_12CliffJumping.png",
        ],
        features: [
          "12 months",
          "Extreme sports",
          "Adventure scenes",
          "8.5x11 inches",
          "Adrenaline rush guaranteed",
        ],
      },
      hunk: {
        name: "Firefighter Hunk Calendar",
        description:
          "Smoldering hot! Become the firefighter hunk of your dreams.",
        price: "$27.99",
        templateImages: [
          "/template-images/firefighter/1F.png",
          "/template-images/firefighter/2F.png",
          "/template-images/firefighter/3F.png",
          "/template-images/firefighter/4F.png",
          "/template-images/firefighter/5F.png",
          "/template-images/firefighter/6F.png",
          "/template-images/firefighter/7F.png",
          "/template-images/firefighter/8F.png",
          "/template-images/firefighter/9F.png",
          "/template-images/firefighter/10F.png",
          "/template-images/firefighter/11F.png",
          "/template-images/firefighter/12F.png",
        ],
        exampleImages: [
          "/template-examples/hunk/swapped_6F.png",
          "/template-examples/hunk/swapped_8F.png",
          "/template-examples/hunk/swapped_10F.png",
          "/template-examples/hunk/swapped_11F.png",
          "/template-examples/hunk/swapped_12F.png",
        ],
        features: [
          "12 months",
          "Heroic firefighter poses",
          "Steamy calendar",
          "8.5x11 inches",
          "Hot and heroic",
        ],
      },
      holiday: {
        name: "Holiday Calendar",
        description:
          "Celebrate every season with festive holiday-themed face swaps.",
        price: "$25.99",
        templateImages: [
          "/template-images/holiday/1January.png",
          "/template-images/holiday/2February.png",
          "/template-images/holiday/3March.jpg",
          "/template-images/holiday/4April.png",
          "/template-images/holiday/5May.png",
          "/template-images/holiday/6June.png",
          "/template-images/holiday/7July.png",
          "/template-images/holiday/8August.png",
          "/template-images/holiday/9September.png",
          "/template-images/holiday/10October.png",
          "/template-images/holiday/11November.png",
          "/template-images/holiday/12December.png",
        ],
        exampleImages: [
          "/template-examples/holiday/swapped_1January.png",
          "/template-examples/holiday/swapped_4April.png",
          "/template-examples/holiday/swapped_5May.png",
        ],
        features: [
          "12 months",
          "Seasonal celebrations",
          "Holiday themes",
          "8.5x11 inches",
          "Year-round festivities",
        ],
      },
      babies: {
        name: "Baby Calendar",
        description:
          "Adorably hilarious! Your face on cute baby bodies throughout the year.",
        price: "$23.99",
        templateImages: [
          "/template-images/baby/1JanuaryBaby.png",
          "/template-images/baby/2FebBaby.png",
          "/template-images/baby/3MarchBaby.png",
          "/template-images/baby/4AprilBaby.png",
          "/template-images/baby/5MayBaby.png",
          "/template-images/baby/6JuneBaby.png",
          "/template-images/baby/7JulyBaby.png",
          "/template-images/baby/8AugustBaby.png",
          "/template-images/baby/9SeptemberBaby.png",
          "/template-images/baby/10OctoberBaby.png",
          "/template-images/baby/11NovemberBaby.png",
          "/template-images/baby/12DecemberBaby.png",
        ],
        exampleImages: [
          "/template-examples/babies/swapped_6JuneBaby.png",
          "/template-examples/babies/swapped_7JulyBaby.png",
          "/template-examples/babies/swapped_11NovemberBaby.png",
        ],
        features: [
          "12 months",
          "Adorable baby scenes",
          "Cute and funny",
          "8.5x11 inches",
          "Guaranteed aww factor",
        ],
      },
    },
  },
  shirt: {
    title: "T-Shirt",
    description: "Hilarious face-swapped t-shirts for maximum comedy impact",
    basePrice: 19.99,
    templates: {},
  },
};

export const CALENDAR_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


