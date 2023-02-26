import { jest } from '@jest/globals';
import { act, cleanup, render, renderHook } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { useGetImages } from '../useGetImages';
import * as Helpers from '../helpers';
import { GameContainer } from '../GameContainer';

describe('Images are received via API and rendered into the DOM', () => {
  beforeEach(() => {
    fetchMock.resetMocks();

    const fakeDogsResponse: DOG_API_RESPONSE = {
      message: [
        'https://images.dog.ceo/breeds/mastiff-tibetan/n02108551_4927.jpg',
        'https://images.dog.ceo/breeds/schnauzer-giant/n02097130_572.jpg',
        'https://images.dog.ceo/breeds/sheepdog-english/n02105641_4997.jpg',
        'https://images.dog.ceo/breeds/kuvasz/n02104029_4679.jpg',
        'https://images.dog.ceo/breeds/papillon/n02086910_8342.jpg',
        'https://images.dog.ceo/breeds/springer-english/n02102040_5641.jpg',
        'https://images.dog.ceo/breeds/greyhound-italian/n02091032_8244.jpg',
        'https://images.dog.ceo/breeds/brabancon/n02112706_1764.jpg',
      ],
    };

    const fakeCatsResponse: CAT_API_RESPONSE = [
      { id: 'ik', url: 'https://cdn2.thecatapi.com/images/ik.jpg' },
      { id: '1p1', url: 'https://cdn2.thecatapi.com/images/1p1.jpg' },
      { id: '29g', url: 'https://cdn2.thecatapi.com/images/29g.jpg' },
      { id: '7r6', url: 'https://cdn2.thecatapi.com/images/7r6.jpg' },
      { id: 'a1b', url: 'https://cdn2.thecatapi.com/images/a1b.jpg' },
      { id: 'a7n', url: 'https://cdn2.thecatapi.com/images/a7n.jpg' },
      { id: 'b3k', url: 'https://cdn2.thecatapi.com/images/b3k.jpg' },
      { id: '8LxU2Gwmo', url: 'https://cdn2.thecatapi.com/images/8LxU2Gwmo.jpg' },
      { id: 'j3WPHuW7A', url: 'https://cdn2.thecatapi.com/images/j3WPHuW7A.jpg' },
      { id: 'RvfGGt00v', url: 'https://cdn2.thecatapi.com/images/RvfGGt00v.jpg' },
    ];

    const fakeFox1Response: FOX_API_RESPONSE = {
      image: 'https://randomfox.ca/images/35.jpg',
      link: 'https://randomfox.ca/?i=35',
    };

    const fakeFox2Response: FOX_API_RESPONSE = {
      image: 'https://randomfox.ca/images/52.jpg',
      link: 'https://randomfox.ca/?i=52',
    };

    fetchMock.mockResponseOnce(JSON.stringify(fakeDogsResponse));
    fetchMock.mockResponseOnce(JSON.stringify(fakeCatsResponse));
    fetchMock.mockResponseOnce(JSON.stringify(fakeFox1Response));
    fetchMock.mockResponseOnce(JSON.stringify(fakeFox2Response));

    jest
      .spyOn(Helpers, 'preloadImage')
      .mockImplementation(
        async (url: string, isFox: boolean) => await Promise.resolve({ url, isFox }),
      );
  });

  afterEach(cleanup);

  test('useGetImages hook returns animals images when API calls succeed', async () => {
    const { result } = await act(() => {
      return renderHook(() => useGetImages(-1));
    });

    // All 9 images are loaded
    expect(result.current.imagesOneRound).toHaveLength(9);

    // There is proper quantity for dogs, cats and foxes images
    expect(
      result.current.imagesOneRound.filter(({ url }) => url.startsWith('https://images.dog.ceo')),
    ).toHaveLength(4);
    expect(
      result.current.imagesOneRound.filter(({ url }) =>
        url.startsWith('https://cdn2.thecatapi.com'),
      ),
    ).toHaveLength(4);
    expect(
      result.current.imagesOneRound.filter(({ url }) => url.startsWith('https://randomfox.ca')),
    ).toHaveLength(1);

    // There is no error
    expect(result.current.error).toBe('');
  });

  test('Images are rendered in ImagesListComponent', async () => {
    const { getAllByAltText, getByTestId } = await act(() => {
      return render(<GameContainer />);
    });

    const imagesContainer = getByTestId('images_container');
    const images = getAllByAltText('Animal: dog, cat or fox');

    // Images container is rendered
    expect(imagesContainer).toBeInTheDocument();

    // All 9 images are rendered
    expect(images).toHaveLength(9);

    // There is proper quantity for dogs, cats and foxes images in the DOM
    expect(
      images.filter((image) => image.getAttribute('src')!.startsWith('https://images.dog.ceo')),
    ).toHaveLength(4);
    expect(
      images.filter((image) => image.getAttribute('src')!.startsWith('https://cdn2.thecatapi.com')),
    ).toHaveLength(4);
    expect(
      images.filter((image) => image.getAttribute('src')!.startsWith('https://randomfox.ca')),
    ).toHaveLength(1);
  });
});
