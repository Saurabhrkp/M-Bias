const User = require('../models/User');
const Post = require('../models/Post');
const Photo = require('../models/Photo');
const sharp = require('sharp');
const { imageString } = require('./controlHelper');

// DB Config
const { bucket } = require('../models/database');
const { deleteParams } = require('./controlHelper');

exports.savePost = async (req, res, next) => {
  req.body.author = req.user.id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'author',
    select: '_id name avatar',
  });
  res.json(post);
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select('_id name email createdAt updatedAt');
  res.json(users);
};

exports.getAdminFeed = async (req, res) => {
  const { _id } = req.profile;
  const posts = await Post.find({ author: _id }).select(
    '_id title slug description '
  );
  res.json(posts);
};

exports.updatePost = async (req, res) => {
  req.body.publishedDate = new Date().toISOString();
  const encode_image = await sharp(req.file.path)
    .resize(200, 200)
    .webp()
    .toBuffer();
  req.body.avatar = imageString(encode_image);
  const updatedPost = await Post.findOneAndUpdate(
    { _id: req.post._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  await Post.populate(updatedPost, {
    path: 'author video image',
    select: '_id name avatar videoURL imageURL',
  });
  res.json(updatedPost);
};

exports.deletePost = async (req, res) => {
  const { _id } = req.post;
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.deleteVideo = async (req, res, next) => {
  const { _id, video } = req.post;
  if (video === null) {
    return next();
  }
  await Post.findOneAndUpdate(
    { _id },
    {
      $set: { video: null },
    }
  );
  await Video.findOneAndDelete({
    s3_key: video.s3_key,
  });
  const params = deleteParams(video);
  bucket.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      next();
    }
  });
};

exports.deleteImage = async (req, res, next) => {
  const { _id, image } = req.post;
  if (image === null) {
    return next();
  }
  await Post.findOneAndUpdate(
    { _id },
    {
      $set: { image: null },
    }
  );
  await Image.findOneAndDelete({
    s3_key: image.s3_key,
  });
  const params = deleteParams(image);
  bucket.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      next();
    }
  });
};
