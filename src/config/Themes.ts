export interface Theme {
  name: string;
  image: string;
  colour: string;
  completionColour: string;
  locationDot: string;
}

const themes: Theme[] = [
  {
    name: "America",
    image:
      "url(https://i.natgeofe.com/n/98751b6c-db3e-48d7-a70f-97070eb411bd/62009.jpg?w=1280&h=853)",
    locationDot: "./location-dot-blue.png",
    colour: "#2bcfcf",
    completionColour: "white",
  },
  {
    name: "Default",
    image: "url(./map.jpg)",
    locationDot: "./location-dot-orange.png",
    colour: "orange",
    completionColour: "white",
  },
];

export default themes;
