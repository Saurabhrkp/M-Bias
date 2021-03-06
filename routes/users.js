const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  catchErrors,
  upload,
  saveFile,
  checkAndChangeProfile,
} = require('../controllers/controlHelper');

/**
 * AUTH ROUTES: /api
 */

// Register
router
  .route('/signup')
  .get(userController.get_signup)
  .post(userController.validateSignup, catchErrors(userController.signup));

// Verify Email
router.get('/verify', userController.set_verified);

// Login
router
  .route('/signin')
  .get(userController.get_signin)
  .post(userController.signin);

// Logout
router.get('/signout', userController.signout);

router.param('username', userController.getUserByUsername);

router
  .route('/:username')
  .get(userController.checkAuth, userController.getAuthUser)
  .put(
    userController.checkAuth,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    catchErrors(saveFile),
    catchErrors(checkAndChangeProfile),
    catchErrors(userController.updateUser)
  )
  .delete(
    userController.checkAuth,
    catchErrors(checkAndChangeProfile),
    catchErrors(userController.deleteUser)
  );

module.exports = router;
