import themes from "../config/Themes";

const preloadImages = () => {
  let images = [];

  themes.forEach((theme) => {
    images.push(theme.imagePlainUrl);
    images.push(theme.locationDot);
  });

  images.forEach((image) => {
    const img = new Image();
    img.src = image;
  });
};

preloadImages();
