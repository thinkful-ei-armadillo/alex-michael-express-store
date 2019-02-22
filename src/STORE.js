const uuid = require('uuid/v4');

const bookmarks = [
  {
    id: uuid(),
    title: 'Bookmark 1',
    url: 'https://bookmark1.com',
    description: 'This is Bookmark 1',
    rating: 1
  },
  {
    id: uuid(),
    title: 'Bookmark 2',
    url: 'https://bookmark2.com',
    description: 'This is Bookmark 2',
    rating: 2
  },
  {
    id: uuid(),
    title: 'Bookmark 3',
    url: 'https://bookmark3.com',
    description: 'This is Bookmark 3',
    rating: 3
  }
];

module.exports = bookmarks;