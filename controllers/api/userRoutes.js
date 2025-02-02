const router = require('express').Router();
const { User } = require('../../models');

router.post('/signup', async (req, res) => {
  try {
    console.log("signup attempt!")
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    console.log("User data: ")
    console.log(userData)
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Failed to create an account!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});


router.post('/login', async (req, res) => {
  try {
    console.log("login attempt!")
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log("User data: ")
    console.log(userData)
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;