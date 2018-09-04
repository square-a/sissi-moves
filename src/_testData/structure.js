export default {
  fields: {
    title: {
      label: 'Title',
      placeholder: 'Your title',
      type: 'string',
    },
    path: {
      label: 'Path',
      placeholder: 'about-me',
      type: 'string',
    },
    image: {
      label: 'Image',
      type: 'image',
    },
  },
  global: {
    maxItems: 5,
    minItems: 1,
    fields: ['title', 'image'],
  },
  pages: {
    standard: {
      maxItems: 6,
      minItems: 1,
      fields: ['title', 'path'],
    },
    gallery: {
      maxItems: 10,
      minItems: 4,
      fields: ['title', 'path'],
      isProtected: true,
    },
  },
  sections: {
    standard: {
      fields: ['title'],
    },
    photo: {
      fields: ['image'],
      isProtected: true,
    },
  },
};
