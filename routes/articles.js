const express = require("express");
// const { rawListeners } = require("../schemas/article");
const Comments = require("../schemas/comment");
const Articles = require("../schemas/article");
const User = require("../schemas/user")
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")
const jwt = require('jsonwebtoken')


// 시작페이지?
router.get("/", (req, res) => {
    res.send("시작페이지");
});

// index.html에 줄 정보 -> 첫페이지 게시물 목록
router.get("/articles", async (req, res) => {
      
    const { item } = req.query;
    const articles = await Articles.find({ item });

    res.json({
        articles
    })
});


// 상세페이지 /goods/:goodsID(1234) -< 1234가 goodsID   // 아무값이나 입력받겠다.
router.get("/articles/:detailId", async (req, res) => {
    const {detailId}  = req.params;

    const articles = await Articles.findOne({ id: Number(detailId) })

    res.json({
        articles
    });
});
// 로그인한 사용자가 해당 글의 작성자인지 확인하고 수정하기 버튼 만들어주기+ 수정페이지에서 author확인하기
router.get("/articles/:detailId/check", authMiddleware ,async (req, res) => {
    const { user } = res.locals;
    const { detailId }  = req.params;

    const [articles] = await Articles.find({ id: Number(detailId) })

    if (articles.nickname === user.nickname) {
        res.json({
            result : "success"
        });
    } else {
        res.json({ 
            result : "fail"
        });
    }

});

// 삭제하는 api
router.delete("/articles/:detailId/delete", authMiddleware, async (req, res) => {
    const {detailId}  = req.params;
    const { user } = res.locals;

    const findArticle = await Articles.findOne({ id: Number(detailId) });
    if (findArticle.nickname === user.nickname) {
        await Articles.deleteOne({ id: Number(detailId) });
        res.json({ result: "success" });
    } 
    
});

// 수정하는 api
router.put("/articles/:detailId/update", authMiddleware, async (req, res) => {
    const  {detailId}  = req.params;
    const { user } = res.locals;
    const { comment, title, date } = req.body;
    
    const existsarticle = await Articles.findOne({ id: Number(detailId) });
    
    if (existsarticle.nickname === user.nickname) {
        await Articles.updateOne({ id: Number(detailId) }, { $set: { comment, title, date }  });

        res.json({ result: "success" });
    } 
  });

  // 글올리는 api
router.post("/articles", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { title, comment, date } = req.body;
    
    await Articles.create({
        nickname : user.nickname,
        title,
        comment,
        date,
    });

    res.json({ result: "success" });
});




// 코멘트 올리기
router.post("/articles/:detailId/comment", authMiddleware, async (req, res) => {
    const { detailId }  = req.params;
    const { user } = res.locals;
    const { comment } = req.body;
    
    console.log(comment)
    await Comments.create({
        nickname : user.nickname,
        comment,
        articleId : Number(detailId)
    });

    res.json({ result: "success" });
});

// 코멘트 보여주기
router.get("/articles/:detailId/comment", async (req,res) => {
    const { detailId }  = req.params;
    const existcomments = await Comments.find({ articleId: Number(detailId) })

    res.json({
        existcomments
    })
});

router.get("/articles/:detailId/commentb", authMiddleware, async (req,res) => {
    const { user } = res.locals;
    const { detailId }  = req.params;
    const existcomments = await Comments.find({ articleId: Number(detailId) })

    res.json({
        existcomments,
        nick : user.nickname
    })
});

// 댓글 삭제하기
router.delete("/articles/:detailId/:id2", authMiddleware, async (req,res) =>{
    const { user } = res.locals;
    const usernick = user.nickname
    const { id2 } = req.params;
    console.log(id2, usernick)
    const deletecomment = await Comments.findOne({ id2: Number(id2)})

    if (usernick === deletecomment.nickname ) {
        await Comments.deleteOne({ id2: Number(id2) });
        res.json({ result: "success" });
    }

});

// 댓글 수정하기 
router.put("/articles/:detailId/update/:id2", authMiddleware, async (req, res) => {
    const  { id2 }  = req.params;
    const { user } = res.locals;
    const { comment} = req.body;
    
    const existcomment = await Comments.findOne({ id2: Number(id2) });
    
    if (existcomment.nickname === user.nickname) {
        await Comments.updateOne({ id2: Number(id2) }, { $set: { comment }  });

        res.json({ result: "success" });
    } 
  });
  
module.exports = router;