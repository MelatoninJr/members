const express = require('express')
const router = express.Router()
const User = require('../schema/user')


router.get('/', async(req, res) => {
    console.log('hello')

})

router.patch('/:id', async (req, res) => {
    console.log('PATCH request received for user: ', req.params.id);
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ message: 'User not found' });

        if (user.membership === 'basic') {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { membership: 'club' }, { new: true });
            console.log('User updated: ', updatedUser);
            res.send({ message: 'User updated', user: updatedUser });
        } else if (user.membership === 'club') {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { membership: 'admin' }, { new: true });
            console.log('User updated: ', updatedUser);
            res.send({ message: 'User updated', user: updatedUser });
        } else {
            res.status(400).send({ message: 'User is already an admin' });
        }
    } catch (error) {
        console.error('Error updating user: ', error);
        res.status(500).send({ message: 'Error updating user' });
    }
});

  
  



module.exports = router;