const express = require('express');
const router = express.Router();
const User = require('../module/User');
const { body, validationResult } = require('express-validator');

// create user 
router.post('/', [
    body('name', 'Enter valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password','Password must be atleast 5 charecters').isLength({min:5})
], async (req,res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ result: result.array() });
    }
    try {
        let user = await User.findOne({ email:req.body.email })
        if (user) {
            return res.status(400).json("Sorry a user with this email already exixsts");
        }
       
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password:req.body.password
        })

        const data = {
            user: {
                id:user.id
            }
        }
        res.send(data)
        //res.send(req.body);
      
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server");
    }
    
})

module.exports = router;