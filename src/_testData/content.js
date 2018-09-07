export default {
  global: {
    _items: ['abc123', 'def345'],
    image: 'abcde.png',
    title: 'Test Project Title',
  },
  pages: {
    'abc123': {
      _id: 'abc123',
      _items: ['345def', '123abc'],
      _type: 'standard',
      path: '',
      title: 'Welcome',
    },
    'def345': {
      _id: 'def345',
      _items: ['567ghi'],
      _type: 'gallery',
      path: 'photos',
      title: 'My Album',
      gallery: [
        {
          title: 'Photo No 1',
          image: 'example1.jpeg',
        },
        {
          title: 'Photo No 2',
          image: 'example2.jpeg',
        },
      ],
    },
  },
  sections: {
    '123abc': {
      _id: '123abc',
      _type: 'photo',
      image: 'bfbfbfb.png',
    },
    '345def': {
      _id: '345def',
      _type: 'standard',
      title: 'This is awesome',
    },
    '567ghi': {
      _id: '567ghi',
      _type: 'photo',
      image: 'bfbfbfb.png',
    },
  },
};
