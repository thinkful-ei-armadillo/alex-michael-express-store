const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const STORE = require('../STORE');

const bookmarksRouter = express.Router();

function isURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(STORE)
    })
    .post((req, res) => {
        const {title, url, description, rating} = req.body;

        if(!title){
            logger.error('title is required')
            return res.status(400).send('title is required.')
        }
        if(!url){
            logger.error('url is required')
            return res.status(400).send('url is required.')
        }
        if(rating && isNaN(parseInt(rating))){
            logger.error('Invalid rating')
            return res.status(400).send('Invalid rating.')
        }
        if(!isURL(url)){
            logger.error('Invalid url')
            return res.status(400).send('Invalid url.')
        }

        const bookmark = {id: uuid(), title, url, description, rating};

        STORE.bookmarks.push(bookmark);
        logger.info(`Created bookmark with id ${bookmark.id}.`);
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${bookmark.id}`);
    });

bookmarksRouter
    .route('/bookmarks/:bookmarkId')
    .get((req, res) => {
        const {bookmarkId} = req.params;
        const bookmark = STORE.bookmarks.find(e => e.id == bookmarkId)

        if(!bookmark){
            logger.error(`Bookmark with id ${bookmarkId} not found.`)
            return res
                .status(404)
                .send('Bookmark not found.')
        }
        res.json(bookmark)
    })
    .delete((req, res) => {
        const {bookmarkId} = req.params;
        const bookmarkIdx = STORE.bookmarks.findIndex(e => e.id === bookmarkId);

        if(bookmarkIdx === -1){
            logger.error(`Bookmark with id ${bookmarkId} not found.`)
            return res
                .status(404)
                .send('Bookmark not found.')
        }
        STORE.bookmarks.splice(bookmarkIdx, 1);

        logger.info(`Bookmark with id ${bookmarkId} deleted.`);
        res
            .status(204)
            .end()
    });

module.exports = bookmarksRouter;