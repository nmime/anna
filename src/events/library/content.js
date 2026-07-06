import { letterEvent } from '../letter/content.js';
import { march8Event } from '../march8/content.js';
import { birthdayEvent } from '../birthday/content.js';
import { anniversaryEvent } from '../anniversary/content.js';

export const libraryEvent = {
  id: 'library',
  href: '/',
  theme: 'library',
  title: 'Анна',
  eyebrow: 'Личная библиотека',
  subtitle: 'Слова, даты и моменты. Сохраняю главное.',
  lead: 'Письмо, праздники и фотографии.',
  heroImage: '/events/library/media/hero.jpg',
  preloader: {
    icon: 'сердце',
    text: 'Расставляю страницы по местам'
  },
  quote: 'Некоторые люди становятся не главой, а всей книгой.',
  cards: [anniversaryEvent, letterEvent, march8Event, birthdayEvent]
};
