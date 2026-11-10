import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY, // Get your actor key from https://console.arcjet.com
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: process.env.NODE_ENV === 'development' ? 'DRY_RUN' : 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    }),
    slidingWindow({
      mode: 'LIVE',
      interval: '2s',
      max: 5,
    }),
  ],
});

export default aj;
