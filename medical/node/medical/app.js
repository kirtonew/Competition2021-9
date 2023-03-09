//加载express框架
var express = require("express");
//路径模块
var path = require("path");
//文件处理模块
const fs = require("fs");
//按行读取文件
var readLine = require("readline");
//formidable模块，解析表单，支持get post请求参数，文件上传
const formidable = require("formidable");
//创建同步的进程
const execSync = require('child_process').execSync;
//创建异步的进程
const exec = require("child_process").exec;
//创建服务器应用程序
var app = express()

//静态资源访问服务功能
app.use(express.static(path.join(__dirname, "public")));
app.use(
    "/node_modules/",
    express.static(path.join(__dirname, "./node_modules/"))
);
app.use('/CSS/', express.static(path.join(__dirname, './CSS/')));

//读取负数据库文件
app.get("/read", (req, res) => {
    var category = req.query.category;
    var fileName = req.query.name;

    switch (category) {
        //CT
        case "xgfy":
            fs.readFile('../medical/public/ndbData/xgfy/' + fileName + '.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        case "rxa":
            fs.readFile('../medical/public/ndbData/rxa/' + fileName + '.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        case "fy":
            fs.readFile('../medical/public/ndbData/fy/' + fileName + '.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        case "eye":
            fs.readFile('../medical/public/ndbData/eye/' + fileName + '.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        case "nj":
            fs.readFile('../medical/public/ndbData/nj/' + fileName + '.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
            //病历
        case "xzb":
            fs.readFile('../medical/public/ndbData/xzb/xzb-NDBData_unzip.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        case "tnb":
            fs.readFile('../medical/public/ndbData/tnb/tnb-NDBData_unzip.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        case "gk":
            fs.readFile('../medical/public/ndbData/gk/gk-NDBData_unzip.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        case "xxg":
            fs.readFile('../medical/public/ndbData/xxg/xxg-NDBData_unzip.txt', 'utf-8', (err, data) => {
                if (err) throw err;
                res.send(data);
            });
            break;
        default:
            res.send("结果出错了，请重新尝试。");
    }
})

//用户上传疾病文本
app.post("/text", (req, res) => {
    //创建 formidable表单解析对象
    const form = new formidable.IncomingForm();
    //解析客户端传来的FormData对象
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        // 构建数据
        var arr = [];
        for (let i in fields) {
            arr.push(fields[i]);
        };
        //写入文件../medical/public/texts/
        fs.writeFile('../medical/public/texts/' + fields.category + '.csv', arr.toString(), err => {
            if (err) throw err;
        });
        res.send(arr);
    });
});

//调用python文本处理代码
app.get("/KNN", (req, res) => {
    var fileName = req.query.name;
    let stdout = execSync('python3 public/ndb/all/KNN.py ' + fileName, { encodeing: 'utf-8' })
    res.send(fileName + '预测结果为：' + stdout);
});
app.get("/Kmeans", (req, res) => {
    var fileName = req.query.name;
    let stdout = execSync('python3 public/ndb/all/K-means.py ' + fileName, { encodeing: 'utf-8' })
    res.send(fileName + '预测结果为：' + stdout);
});

//用户上传CT影像
app.post("/upload", (req, res) => {
    const form = new formidable.IncomingForm();
    //保留上传文件的后缀名字
    form.keepExtensions = true;
    //图像文件上传位置
    form.uploadDir = path.join(__dirname, "public", "uploads");
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        //为上传的文件重命名：其中files.attrName.path可以获取文件的上传路径
        var newPath = form.uploadDir + "/" + files.attrName.name.split(".")[0] + "-NDBData_unzip" + ".png";
        fs.renameSync(files.attrName.path, newPath);
        res.send({
            path: newPath.split("public")[1],
            category: fields.category,
        });
    });
});

//调用python影像处理代码
app.get("/predict", (req, res) => {
    var file = req.query.path;
    var category = req.query.category;
    let stdout = execSync('python3 public/ndb/all/predict.py ' + file + ' ' + category, { encodeing: 'utf-8' })
    res.send(category + '预测结果为：' + stdout);
});


app.listen(3000, function() {
    console.log("服务启动成功");
});