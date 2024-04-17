

const triggerTheme = (planetHexColor: string) => {
  // Change the ion primary color to the planet's
  // hex code to make the player feel more
  // as if hes on a different planet
  const htmlEl = document.querySelector('html');
  htmlEl?.style.setProperty('--ion-color-primary', planetHexColor ?? "#f7ae5b");
}

export default triggerTheme