export interface Theme {
  name: string;
  image: string;
  colour: string;
  completionColour: string;
  locationDot: string;
  imagePlainUrl: string;
}

const themes: Theme[] = [
  {
    name: "America",
    image: "url(/united-states.jpg)",
    imagePlainUrl: "/united-states.jpg",
    locationDot: "/location-dot-blue.png",
    colour: "rgb(43, 207, 207)",
    completionColour: "white",
  },
  {
    name: "NightCity",
    image: "url(/night-city.jpg)",
    imagePlainUrl: "/night-city.jpg",
    locationDot: "/location-dot-orange.png",
    colour: "rgb(255,165,0)",
    completionColour: "white",
  },
  {
    name: "Europe",
    image: "url(/london.jpg)",
    imagePlainUrl: "/london.jpg",
    locationDot: "/location-dot-green.png",
    colour: "rgb(192, 218, 116)",
    completionColour: "white",
  },
];

export default themes;
