interface GameType {
  id: number;
  name: string;
  color: string;
  imgSrc: string;
  services: string[];
  href: string;
}

export const games: GameType[] = [
  {
    id: 1,
    name: "Valorant",
    color: "from-red-600 to-orange-500",
    imgSrc: "/valorant.jpg",
    services: ["Rank Boosting", "Placement Matches", "Net Wins"],
    href: "valorant",
  },
  {
    id: 2,
    name: "Arena Breakout: Infinite",
    color: "from-blue-600 to-cyan-500",
    imgSrc: "/arena-breakout.png",
    services: [
      "Koens Farming",
      "Account Leveling",
      "Raid Boost",
      "Titanium Case",
    ],
    href: "arena-breakout",
  },
  {
    id: 3,
    name: "Teamfight Tactics",
    color: "from-purple-600 to-[#00FF00]",
    imgSrc: "/tft.png",
    services: ["Rank Boosting", "Placement Matches"],
    href: "tft",
  },
  {
    id: 4,
    name: "League of Legends",
    color: "from-yellow-600 to-orange-500",
    imgSrc: "/lol.png",
    services: ["Rank Boosting", "Placement Matches"],
    href: "lol",
  },
  {
    id: 5,
    name: "Delta Force",
    color: "from-red-700 to-orange-600",
    imgSrc: "/delta-force.png",
    services: [
      "Tekniq Alloy Farming",
      "Account Leveling",
      "Hazard Operation",
      "Season Mission",
      "Rank Boosting",
    ],
    href: "delta-force",
  },
];

export const gameServers = [
  {
    id: 1,
    name: "AP",
    price: 1,
  },
  {
    id: 2,
    name: "EU",
    price: 1.1,
  },
  {
    id: 3,
    name: "KR",
    price: 1.1,
  },
  {
    id: 4,
    name: "NA",
    price: 1.5,
  },
  {
    id: 5,
    name: "LATAM",
    price: 1.5,
  },
  {
    id: 6,
    name: "BR",
    price: 1.5,
  },
];
