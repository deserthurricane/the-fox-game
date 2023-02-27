import { jest } from '@jest/globals';
import { act, cleanup, render, renderHook } from '@testing-library/react';
import axios, { AxiosResponse } from 'axios';

import { useGetImages } from '../useGetImages';
import * as Helpers from '../helpers';
import { GameContainer } from '../GameContainer';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Images are received via API and rendered into the DOM', () => {
  let jsdomAlert: typeof window.alert;

  beforeEach(() => {
    jsdomAlert = window.alert; // remember the jsdom alert
    window.alert = () => {}; // provide an empty implementation for window.alert

    const fakeDogsResponse: Pick<AxiosResponse<DOG_API_RESPONSE>, 'data'> = {
      data: {
        message: [
          'https://images.dog.ceo/breeds/mastiff-tibetan/n02108551_4927.jpg',
          'https://images.dog.ceo/breeds/schnauzer-giant/n02097130_572.jpg',
          'https://images.dog.ceo/breeds/sheepdog-english/n02105641_4997.jpg',
          'https://images.dog.ceo/breeds/kuvasz/n02104029_4679.jpg',
          'https://images.dog.ceo/breeds/papillon/n02086910_8342.jpg',
          'https://images.dog.ceo/breeds/springer-english/n02102040_5641.jpg',
          'https://images.dog.ceo/breeds/greyhound-italian/n02091032_8244.jpg',
          'https://images.dog.ceo/breeds/brabancon/n02112706_1764.jpg',
          'https://images.dog.ceo/breeds/setter-irish/n02100877_2686.jpg',
          'https://images.dog.ceo/breeds/pug/n02110958_12080.jpg',
          'https://images.dog.ceo/breeds/cockapoo/Guri1.jpg',
          'https://images.dog.ceo/breeds/terrier-irish/n02093991_4506.jpg',
          'https://images.dog.ceo/breeds/dachshund/dog-495122_640.jpg',
          'https://images.dog.ceo/breeds/schnauzer-giant/n02097130_1254.jpg',
          'https://images.dog.ceo/breeds/pitbull/IMG_20190826_121528_876.jpg',
          'https://images.dog.ceo/breeds/lhasa/n02098413_5594.jpg',
        ],
      },
    };

    const fakeCats1Response: Pick<AxiosResponse<CAT_API_RESPONSE>, 'data'> = {
      data: [
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
      ],
    };

    const fakeCats2Response: Pick<AxiosResponse<CAT_API_RESPONSE>, 'data'> = {
      data: [
        { id: '26j', url: 'https://cdn2.thecatapi.com/images/26j.jpg' },
        { id: '9av', url: 'https://cdn2.thecatapi.com/images/9av.jpg' },
        { id: 'at8', url: 'https://cdn2.thecatapi.com/images/at8.jpg' },
        { id: 'btr', url: 'https://cdn2.thecatapi.com/images/btr.jpg' },
        { id: 'dqp', url: 'https://cdn2.thecatapi.com/images/dqp.jpg' },
        { id: 'e7h', url: 'https://cdn2.thecatapi.com/images/e7h.jpg' },
        { id: 'eb9', url: 'https://cdn2.thecatapi.com/images/eb9.jpg' },
        { id: 'efk', url: 'https://cdn2.thecatapi.com/images/efk.jpg' },
        {
          id: 'MTgxOTExNg',
          url: 'https://cdn2.thecatapi.com/images/MTgxOTExNg.jpg',
        },
        {
          id: 'LSaDk6OjY',
          url: 'https://cdn2.thecatapi.com/images/LSaDk6OjY.jpg',
        },
      ],
    };

    const fakeFox1Response: Pick<AxiosResponse<FOX_API_RESPONSE>, 'data'> = {
      data: {
        image: 'https://randomfox.ca/images/35.jpg',
        link: 'https://randomfox.ca/?i=35',
      },
    };

    const fakeFox2Response: Pick<AxiosResponse<FOX_API_RESPONSE>, 'data'> = {
      data: {
        image: 'https://randomfox.ca/images/52.jpg',
        link: 'https://randomfox.ca/?i=52',
      },
    };

    const fakeFox3Response: Pick<AxiosResponse<FOX_API_RESPONSE>, 'data'> = {
      data: {
        image: 'https://randomfox.ca/images/68.jpg',
        link: 'https://randomfox.ca/?i=68',
      },
    };

    const fakeFox4Response: Pick<AxiosResponse<FOX_API_RESPONSE>, 'data'> = {
      data: {
        image: 'https://randomfox.ca/images/34.jpg',
        link: 'https://randomfox.ca/?i=34',
      },
    };

    const fakeFox5Response: Pick<AxiosResponse<FOX_API_RESPONSE>, 'data'> = {
      data: {
        image: 'https://randomfox.ca/images/90.jpg',
        link: 'https://randomfox.ca/?i=90',
      },
    };

    mockedAxios.get
      .mockResolvedValueOnce(fakeFox1Response)
      .mockResolvedValueOnce(fakeFox2Response)
      .mockResolvedValueOnce(fakeFox3Response)
      .mockResolvedValueOnce(fakeFox4Response)
      .mockResolvedValueOnce(fakeFox5Response)
      .mockResolvedValueOnce(fakeCats1Response)
      .mockResolvedValueOnce(fakeCats2Response)
      .mockResolvedValueOnce(fakeDogsResponse);

    jest
      .spyOn(Helpers, 'preloadImage')
      .mockImplementation(async (url: string) => await Promise.resolve(true));
  });

  afterEach(() => {
    cleanup();
    window.alert = jsdomAlert; // restore the jsdom alert
  });

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
