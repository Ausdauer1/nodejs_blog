const express = require("express");
const { rawListeners } = require("../schemas/article");
const Articles = require("../schemas/article");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("시작페이지");
});

router.get("/articles", async (req, res) => {
    const { item } = req.query;

    const articles = await Articles.find({ item });

    res.json({
        articles
    })
});


// /goods/:goodsID(1234) -< 1234가 goodsID   // 아무값이나 입력받겠다.
router.get("/articles/:detailId", async (req, res) => {
    const {detailId}  = req.params;

    const [articles] = await Articles.find({ id: Number(detailId) })

    res.json({
        articles
    });
});


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