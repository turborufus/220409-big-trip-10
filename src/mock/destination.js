const DescriptionSentences = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. `,
  `Nunc fermentum tortor ac porta dapibus. `,
  `In rutrum ac purus sit amet tempus. `];

const ImagesCount = 5;

const generateDescription = () => {
  return DescriptionSentences
    .filter(() => Math.random() > 0.5)
    .slice(0, 3)
    .reduce((info, it) => {
      return info + it;
    });
};

const generateImages = () => {
  return new Array(ImagesCount)
    .fill(``)
    .map(() => {
      return `http://picsum.photos/300/150?r=${Math.random()}`;
    });
};

const generateDestination = (name) => {
  return {
    name,
    description: generateDescription(),
    imgURLs: generateImages()
  };
};

export {generateDestination};
