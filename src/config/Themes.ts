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
    image:
      "url(https://i.natgeofe.com/n/98751b6c-db3e-48d7-a70f-97070eb411bd/62009.jpg?w=1280&h=853)",
    imagePlainUrl:
      "https://i.natgeofe.com/n/98751b6c-db3e-48d7-a70f-97070eb411bd/62009.jpg?w=1280&h=853",
    locationDot: "./location-dot-blue.png",
    colour: "rgb(43, 207, 207)",
    completionColour: "white",
  },
  {
    name: "Default",
    image: "url(./map.jpg)",
    imagePlainUrl: "./map2.jpg",
    locationDot: "./location-dot-orange.png",
    colour: "rgb(255,165,0)",
    completionColour: "white",
  },
  {
    name: "Europe",
    image: "url(./london.jpg)",
    imagePlainUrl: "./london.jpg",
    locationDot: "./location-dot-green.png",
    colour: "rgb(192, 218, 116)",
    completionColour: "white",
  },
];

export default themes;
