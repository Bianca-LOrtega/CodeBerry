var express = require("express");
var router = express.Router();
const path = require('path')

router.post("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../../public/pages/index.html"))
});

module.exports = router;