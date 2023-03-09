var params = "";

const app = new Vue({
    el: ".dept_thumb",
    data() {
        return {
            files: [],
            maxSize: 1920 * 1080,
            previewIMG: null,
            limit: 1,
            isPreview: false,
            type: 2, // 0 预览模式 1 列表模式 2 预览模式 + 上传按钮
        };
    },

    methods: {
        oversize(file) {
            console.log("oversize");
            console.log("filesize:" + file.size / 1024 + "KB");
        },

        afterRead(files) {
            console.log("after-read");
            console.log(this.files[0]);
        },

        beforeRemove(index, file) {
            console.log(index, file);
            return true;
        },

        preview(index, file) {
            this.previewIMG = file.url;
            this.isPreview = true;
        },

        exceed() {
            alert(`只能上传${this.limit}张图片`);
        },

        beforeRead(files) {
            console.log("before-read");
            for (let i = 0, len = files.length; i < len; i++) {
                const file = files[i];
                if (file.type != "image/jpeg" && file.type != "image/png") {
                    alert("只能上传jpg和png格式的图片");
                    return false;

                }
            };

            var formData = new FormData();
            //将用户选择的文件追加到formData表单对象中
            formData.append("attrName", files[0]);
            //获取疾病类型
            formData.append("category", $(".dept_thumb").attr("id"));
            $.ajax({
                url: "/upload",
                type: "post",
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                success: function(response) {
                    params = response;
                    // console.log(params);
                     //console.log(params.path);
                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });

            return true;
        },
        closePreview() {
            this.isPreview = false;
        },
    },
});

function getResultByCT() { //获取诊断结果
    var res = null;
    $.ajaxSettings.async = false; //关闭异步
    $.get("/predict", params, function(response) {
        res = response;
    });
    $.ajaxSettings.async = true; //开启异步
    return res;
}

$(".boxed-btn1").on("click", function() {
    var res = getResultByCT(); // 该结果首尾各有一个空格！！
    var delivery = null;
    //分割结果字符串 前者为预测结果 后者为预测准确率
    result = $.trim(res).split("&")[0]; //trim方法能过滤字符串首尾的空格
    acc = $.trim(res).split("&")[1];
    //获取疾病名称
    var category = params.category;
    //获取疾病图片名称
    var fileName = params.path.split("/")[2].split(".")[0]
    console.log(fileName)
        //根据诊断结果，给出患者合理的建议
    switch (result) { // trim方法能过滤字符串首尾的空格
        //新冠肺炎
        case "xgfy预测结果为：阳性":
            delivery = "您被确诊为新冠肺炎患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "xgfy预测结果为：阴性":
            delivery = "您没有被确诊为新冠肺炎患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;

            //乳腺癌
        case "rxa预测结果为：恶性":
            delivery = "您被确诊为乳腺癌患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "rxa预测结果为：恶性":
            delivery = "您没有被确诊为乳腺癌患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;

            //普通肺炎
        case "fy预测结果为：患病":
            delivery = "您被确诊为普通肺炎患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "fy预测结果为：正常":
            delivery = "您没有被确诊为普通肺炎患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;

            //疟疾
        case "nj预测结果为：感染":
            delivery = "您被确诊为疟疾患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "nj预测结果为：未感染":
            delivery = "您没有被确诊为疟疾患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;

            //糖网病
        case "eye预测结果为：正常":
            delivery = "您没有被确诊为糖网病患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;
        case "eye预测结果为：轻微":
            delivery = "您被确诊为轻微糖网病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "eye预测结果为：中度":
            delivery = "您被确诊为中度糖网病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "eye预测结果为：严重":
            delivery = "您被确诊为严重糖网病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "eye预测结果为：增值性":
            delivery = "您被确诊为增值性糖网病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        default:
            delivery = "结果出错了，请再次尝试。";
    };
    window.location.href = "result_CT.html?delivery=" + encodeURI(delivery.replace(/%/g, '%25')) +
        "&category=" + encodeURI(category) +
        "&fileName=" + encodeURI(fileName); //防止出现中文乱码
    
});