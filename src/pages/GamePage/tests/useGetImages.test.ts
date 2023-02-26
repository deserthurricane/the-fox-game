import { jest } from '@jest/globals';
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { useGetImages } from '../useGetImages';

import * as Helpers from '../helpers'; 

// require('react');
// const { render, screen } = require('@testing-library/react');
// const { renderHook } = require('@testing-library/react');
// const fetchMock = require('jest-fetch-mock');
// const { useGetImages } = require('../useGetImages');

describe('useGetImages', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('Returns dogs images when DOG API call succeeds', async () => {
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

    fetchMock.mockResolvedValueOnce({ status: 200, json: jest.fn(() => Promise.resolve(fakeDogsResponse)) });
    fetchMock.mockResolvedValueOnce({ status: 200, json: jest.fn(() => Promise.resolve(fakeCatsResponse)) });
    fetchMock.mockResolvedValueOnce({ status: 200, json: jest.fn(() => Promise.resolve(fakeFox1Response)) });
    fetchMock.mockResolvedValueOnce({ status: 200, json: jest.fn(() => Promise.resolve(fakeFox2Response)) });

    jest.spyOn(Helpers, 'preloadImage').mockImplementation((imageUrl: string, isFox: boolean) => Promise.resolve({ imageUrl, isFox }));

    const { result } = await act(() => {
      return renderHook(() => useGetImages(-1))
    })

    console.log(result);

    expect(result.current.imagesOneRound).toHaveLength(9);
  })

  test('renders error when API call fails', async () => {})
})