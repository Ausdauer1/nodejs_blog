const express = require("express");
// const { rawListeners } = require("../schemas/article");
const Articles = require("../schemas/article");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")

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

    const [articles] = await Articles.find({ id: Number(detailId) })

    res.json({
        articles
    });
});

// 삭제하는 api
router.delete("/articles/:detailId/delete", async (req, res) => {
    const {detailId}  = req.params;
    const {password}  = req.body;

    const findArticle = await Articles.findOne({ id: Number(detailId) });
    if (findArticle.password == password) {
        await Articles.deleteOne({ id: Number(detailId) });
        res.json({ result: "success" });
    } else {
        res.json({ result: "fail" });
    }

    
});

// 수정하는 api
router.put("/articles/:detailId/update", async (req, res) => {
    const  {detailId}  = req.params;
    const { name, password, comment, title, date } = req.body;
    
    const existsarticle = await Articles.findOne({ id: Number(detailId) });
    
    if (existsarticle.password == password) {
        await Articles.updateOne({ id: Number(detailId) }, { $set: { name, comment, title, date }  });

        res.json({ result: "success" });
    } else {
        res.json({ result: "fail" });
    } 

  });

  // 글올리는 api
router.post("/articles", async (req, res) => {
    const { name, password, comment, title, date, } = req.body;

    await Articles.create({
        title,
        name,
        password,
        comment,
        date,
    });

    res.json({ result: "success" });
});


module.exports = router;