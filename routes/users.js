const express = require("express");
const Users = require("../schemas/user");
const jwt = require("jsonwebtoken")
const router = express.Router();

// 회원가입 api
router.post("/signin", async (req, res) => {
    const { nickname, password } = req.body;

    const alreadyExist = await Users.findOne({nickname})
    
    if (alreadyExist) {
        res.json({result: "fail"})
    } else {
        await Users.create({
            nickname,
            password, 
        });
        res.json({result: "success" });
    }
           
});
//로그인 api
router.post("/auth", async (req,res) => {
    const {nickname, password} = req.body; 

    const user = await Users.findOne({nickname, password}).exec();
    if (!user) {
        res.status(400).send({
            errorMessage: '이메일 또는 패스워드가 잘못되었습니다.'
        });
        return;
    }

    const token = jwt.sign({userId: user.userId}, "iwantobeapple");
    res.send({
        token,
    });
})

module.exports = router;