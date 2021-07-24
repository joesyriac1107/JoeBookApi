const router = require('express').Router()
const Post = require('../modals/Posts')

//create a post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).json(err)
  }
})
//update a post
router.put('/:id', async (req, res) => {
  if (req.body.id == req.params.id) {
    try {
      const user = await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      })
      res.status(200).json('Post has been successfully updated')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res
      .status(403)
      .json(
        "This post can't be modified because the modified post identifier is different"
      )
  }
})

//delete a post
router.delete('/:id', async (req, res) => {
  if (req.body.id == req.params.id) {
    try {
      const post = await Post.findByIdAndDelete(req.params.id)
      res.status(200).json('Post has been successfully deleted ')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res
      .status(403)
      .json(
        "This post can't be modified because the modified post identifier is different"
      )
  }
})

//like a post

// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//get timeline post
module.exports = router
