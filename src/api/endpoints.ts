export const GET_DOGS = (count: number) => `https://dog.ceo/api/breeds/image/random/${count}`;
export const GET_CATS = (count: number) =>
  `https://api.thecatapi.com/v1/images/search?limit=${count}`; // Bug: CATS api always returns 10 images despite the limit param
export const GET_FOX = () => 'https://randomfox.ca/floof/';
