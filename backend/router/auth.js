const express = require('express');
const router = express.Router();
const User = require('../module/User');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const fetchUser = require('../middleware/fetchUser')
const JWT_SECRET = 'Ahmadrazagoodboy';

//Router-1: create user using: POST /api/auth/createuser . No login required
router.post('/createuser', [
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
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id:user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken });
      
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server");
    }
    
})

//Router-2: Authenticate a user using: POST /api/auth/login . login required
router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password','Password connot be blank').exists()
], async (req,res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ result: result.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json("Please try to login with correct crendentials");
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ error: "Please try to Login with correct Credentiols" });
        }
        const data = {
            user: {
                id:user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken });
      
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server");
    }
    
})


//Route:3 Authenticate a user using POST "/api/auth/getuser". No Login required

router.post('/getuser', fetchUser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

module.exports = router;