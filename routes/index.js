const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../controllers/controlHelper');

/**
 * POST ROUTES: /
 */
router.get('/', catchErrors(indexController.getPosts));

router.param('slug', indexController.getPostBySlug);

router.put(
  '/:slug/like',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/:slug/unlike',
  userController.checkAuth,
  catchErrors(indexController.toggleLike)
);

router.put(
  '/:slug/comment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.put(
  '/:slug/uncomment',
  userController.checkAuth,
  catchErrors(indexController.toggleComment)
);

router.put(
  '/:slug/save',
  userController.checkAuth,
  catchErrors(userController.toggleSavedPost)
);

router.put(
  '/:slug/remove',
  userController.checkAuth,
  catchErrors(userController.toggleSavedPost)
);

router.post(
  '/search',
  userController.checkAuth,
  catchErrors(indexController.searchPost),
  indexController.sendPost
);

router.route('/:slug').get(userController.checkAuth, indexController.sendPost);

module.exports = router;
