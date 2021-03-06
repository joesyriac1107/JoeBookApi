const User = require('../modals/user')
const router = require('express').Router()
const bcrypt = require('bcrypt')

//update user
router.put('/:id', async (req, res) => {
  let modifiedUserDetails = req.body
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
        modifiedUserDetails = { ...modifiedUserDetails, password }
      } catch (err) {
        return res.status(500).json(err)
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: modifiedUserDetails,
      })
      res.status(200).json('Account has been successfully updated')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You can modift only your account')
  }
})
//delete user

router.delete('/:id', async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json('Account has been successfully deleted ')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You can delete only your account')
  }
})

//get a user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, updatedAt, ...other } = user._doc
    res.status(200).json(other)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//get friends
router.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    const friends = await Promise.all(
      user.followings.map((followerId) => {
        return User.findById(followerId)
      })
    )
    let friendList = []
    friends.map((friend) => {
      const { _id, userName, profilePicture } = friend
      friendList.push({ _id, userName, profilePicture })
    })

    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err)
  }
})
//follow user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } })
        await currentUser.updateOne({ $push: { followings: req.params.id } })
        res.status(200).json('User has been followed')
      } else {
        res.status(403).json('You are already following the user.')
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    res.status(403).json('you cant follow yourself')
  }
})
//unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { followings: req.params.id } })
        res.status(200).json('User has been unfollowed')
      } else {
        res.status(403).json('You are already not following the user.')
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    res.status(403).json('you cant unfollow yourself')
  }
})
module.exports = router
