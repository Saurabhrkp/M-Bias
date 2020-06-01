const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  catchErrors,
  upload,
  saveFile,
} = require('../controllers/controlHelper');

/**
 * AUTH ROUTES: /api
 */

// Register
router
  .route('/signup')
  .get(userController.get_signup)
  .post(userController.validateSignup, catchErrors(userController.signup));

// Login
router.post('/signin', userController.signin);

// Logout
router.get('/signout', userController.signout);

router.param('username', userController.getUserByUsername);

router
  .route('/:username')
  .get(userController.getAuthUser)
  .put(
    userController.checkAuth,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    catchErrors(saveFile),
    catchErrors(userController.updateUser)
  )
  .delete(userController.checkAuth, catchErrors(userController.deleteUser));

router.get(
  '/profile/:username',
  userController.checkAuth,
  userController.getUserProfile
);

router.get(
  '/:username/savedPost',
  userController.checkAuth,
  catchErrors(userController.getUserSaved)
);

module.exports = router;
