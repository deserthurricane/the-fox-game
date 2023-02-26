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
    const fakeResponse: DOG_API_RESPONSE = {
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

    fetchMock.mockResolvedValueOnce({ status: 200, json: jest.fn(() => Promise.resolve(fakeResponse)) })

    jest.spyOn(Helpers, 'preloadImage').mockImplementation((imageUrl: string, isFox: boolean) => Promise.resolve({ imageUrl, isFox }));

    const { result } = await act(() => {
      return renderHook(() => useGetImages(-1))
    })

    console.log(result);

    expect(result.current.imagesOneRound.length).toBeGreaterThan(0);
  })

  test('renders error when API call fails', async () => {})
})