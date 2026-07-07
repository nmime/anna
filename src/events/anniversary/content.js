import { sharedGallery } from '../shared/site.js';

// ============================================================
// КАК НАПОЛНИТЬ ЭТУ СТРАНИЦУ
//
// 1. Медиа месяца: положи файл в public/events/anniversary/media/
//    и добавь запись в массив media месяца:
//      { src: '/events/anniversary/media/файл.jpg', caption: 'Подпись' }
//    Для видео добавь video: true.
//    Первый элемент — обложка главы. Пустой media: [] — красивая заглушка.
// 2. Текст месяца: поменяй title и note на свои слова.
// 3. Пароль карточки и подсказка — поля password и hint ниже.
// ============================================================

export const anniversaryEvent = {
  id: 'anniversary',
  type: 'event',
  href: 'anniversary.html',
  theme: 'anniversary',
  priority: true,
  title: 'Наш первый год',
  cardTitle: 'Наш первый год',
  badge: '07.07.2026',
  date: '7 июля 2026',
  dateIso: '2026-07-07',
  cardImage: '/events/shared/media/us_together.jpg',
  cardDesc: 'Годовщина. Двенадцать месяцев, собранных в одну историю — нашу.',
  unlockAt: '2026-07-07T00:00:00',
  password: 'все|все цветы|ромашки|ромашка',
  hint: 'Однажды я спросил, какие цветы ты любишь больше всего. Помнишь, что ты мне ответила?',
  status: 'Нужен пароль',
  eyebrow: '07.07.2025 — 07.07.2026',
  verdict: {
    strike: 'Год мучений',
    truth: 'самый лучший год моей жизни'
  },
  lead: 'Каждая черточка на этом кольце — один наш день. Здесь нет ни одного случайного.',
  preloader: {
    icon: 'год',
    text: 'Собираю наш год по дням'
  },
  nav: [
    { label: 'Главы', href: '#chapters' },
    { label: 'Итоги', href: '#insights' },
    { label: 'Галерея', href: '#gallery' },
    { label: 'Письмо', href: '#envelope' },
    { label: 'Главная', href: '/' }
  ],
  ring: {
    center: '7.07',
    script: 'и это только начало'
  },
  chaptersIntro: {
    eyebrow: 'Наши главы',
    title: 'История, собранная по месяцам',
    intro: 'Каждый месяц — глава. С фотографиями, подписями и парой честных строк.'
  },
  months: [
    {
      num: '02',
      name: 'Февраль',
      year: 2026,
      title: 'Первое 14 февраля',
      note: 'Свечи, бокалы и чувство, что это только начало. Наш первый день всех влюбленных.',
      media: [
        { src: '/events/shared/media/valentines.jpg', caption: 'Свечи, бокалы и очень важный вечер', orientation: 'portrait' }
      ]
    },
    {
      num: '03',
      name: 'Март',
      year: 2026,
      title: 'Твой месяц',
      note: 'Восьмое марта, а через три дня — твои восемнадцать. Кожанки, весна и ощущение, что нам можно всё.',
      media: [
        { src: '/events/anniversary/media/m03-1.jpg', caption: 'Кожанки, ветер и твоя помада', orientation: 'portrait' }
      ]
    },
    {
      num: '04',
      name: 'Апрель',
      year: 2026,
      title: 'Легче',
      note: 'Весна научила нас говорить честнее и мириться быстрее. И даже прятаться от камеры ты стала красиво.',
      media: [
        { src: '/events/anniversary/media/m04-1.jpg', caption: 'Спряталась — но самые красивые глаза все равно видно', orientation: 'portrait' },
        { src: '/events/anniversary/media/m04-2.jpg', caption: 'Твой очкарик на ночной прогулке', orientation: 'portrait' }
      ]
    },
    {
      num: '05',
      name: 'Май',
      year: 2026,
      title: 'Ромашки',
      note: 'Месяц, когда весна была похожа на тебя: ромашки, солнце сквозь листья и дорога вдвоем.',
      media: [
        { src: '/events/anniversary/media/m05-1.jpg', caption: 'Ромашки тебе — просто так, без повода', orientation: 'portrait' },
        { src: '/events/anniversary/media/m05-2.jpg', caption: 'Небо, листва и мы', orientation: 'portrait' },
        { src: '/events/anniversary/media/m05-3.jpg', caption: 'Прячешься от камеры — зря', orientation: 'portrait' },
        { src: '/events/anniversary/media/m05-video.mp4', caption: 'Живая секунда нашего мая', video: true, orientation: 'portrait' }
      ]
    },
    {
      num: '06',
      name: 'Июнь',
      year: 2026,
      title: 'Накануне',
      note: 'Последний месяц первого года: неон, зеркала и ты в белом. До первой годовщины оставалось всего ничего.',
      media: [
        { src: '/events/anniversary/media/m06-1.jpg', caption: 'Миллион огней — и миллион нас в зеркалах', orientation: 'portrait' },
        { src: '/events/anniversary/media/m06-2.jpg', caption: 'Светящееся поле. Но светишься тут все равно ты', orientation: 'portrait' },
        { src: '/events/anniversary/media/m06-3.jpg', caption: 'Ты и акула. По красоте у акулы никаких шансов', orientation: 'portrait' }
      ]
    }
  ],
  nextChapter: {
    numeral: '07',
    title: 'Июль 2026 — следующая глава',
    text: 'Она начинается прямо сейчас, с нашей первой годовщины. Каждый новый день добавляет в нее строчку.'
  },
  insights: {
    eyebrow: 'Что этот год мне дал',
    title: 'Три вещи, которые я понял за 365 дней',
    intro: 'Не выводы из книг. Выводы из жизни рядом с тобой.',
    items: [
      {
        title: 'Дом — это человек',
        text: 'Не адрес и не стены. Спокойствие приходит не туда, где я нахожусь, а туда, где есть ты.'
      },
      {
        title: 'Любовь — это внимание',
        text: 'Не громкие слова раз в месяц, а маленькие «как ты?» каждый день. Этому меня научила ты.'
      },
      {
        title: 'Мы — команда',
        text: 'За год были и лучшие дни, и сложные. Но из каждого мы выходили вдвоем — и это главный итог.'
      }
    ]
  },
  gallery: sharedGallery,
  envelope: {
    eyebrow: 'Письмо',
    title: 'Письмо в наш второй год',
    date: '7 июля 2026',
    label: 'Нажми на конверт, чтобы прочитать письмо во второй год.',
    messageTitle: 'В наш второй год',
    text: 'Первый год мы учились быть вместе. Во втором я хочу большего: больше твоего смеха, больше наших мест, больше историй, которые потом лягут на это кольцо. Спасибо, что выбрала меня триста шестьдесят пять раз подряд.',
    final: 'Твой — вчера, сегодня и всегда.'
  },
  message: {
    title: 'С годовщиной, Анна',
    text: 'Один год — это только первое кольцо на дереве. Пусть их будет столько, что не хватит страницы. Я рядом — и никуда не тороплюсь, кроме как к тебе.'
  }
};
