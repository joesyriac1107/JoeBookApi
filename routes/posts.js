const router = require('express').Router()
const Post = require('../modals/Posts')
const User = require('../modals/user')

// create a post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).json(err)
  }
})
// update a post
router.put('/:id', async (req, res) => {
  //I believe post id validation must be done
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json('Post has been successfully updated')
    } else {
      return res.status(403).json('You can modify only your posts')
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

// delete a post
router.delete('/:id', async (req, res) => {
  //I believe post id validation must be done
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      const deletedPost = await post.deleteOne()
      res.status(200).json('Post has been successfully deleted ')
    } else {
      return res.status(403).json('You can delete only your posts')
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

// like a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      })
      res.status(200).json('The post has been liked')
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      })

      res.status(200).json('The post has been disliked')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})
// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (err) {
    return res.status(500).json(err)
  }
})

// get timeline posts
router.get('/:id/timeline', async (req, res) => {
  let postArray = []
  try {
    const currentUser = await User.findById(req.params.id)
    const userPosts = await Post.find({ userId: currentUser._id })
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId })
      })
    )

    res.status(200).json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
