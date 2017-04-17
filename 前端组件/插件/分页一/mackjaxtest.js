
function GenerateData(pageIndex, pageSize) {
    var list = {
        total: 1000,
        records: []
    }
    for (var i = 1; i <= pageSize; i++) {
        var o = Generate();
        o.ID = ((pageIndex - 1) * pageSize + i).toString();
        list.records.push(o);
    }
    return list;
}

function Generate() {
    var now = new Date();
    var rndNum = RandNum(20, 30), Names = ["张三", "李四", "王五"];
    return {
        Name: Names[RandNum(0, 2)] + rndNum,
        Sex: (rndNum % 2 == 0),
        Age: rndNum,
        PhoneNumber: RandPhoneNumber(),
        Birthday: new Date(now.setFullYear(now.getFullYear() - rndNum, RandNum(0, 11), RandNum(1, 31))).toLocaleDateString(),
        Address: "江苏省张家港市北二环与江帆路交界处"
    };
}


var phoneStart = ["130", "131", "132", "133", "134", "135", "136", "137", "138", "139",
	"145", "147", "150", "151", "152", "153", "155", "156", "157", "158", "159",
	"180", "181", "182", "183", "184", "185", "186", "187", "188", "189"];


function RandPhoneNumber() {
    var idx = RandNum(0, phoneStart.length - 1);
    var str = phoneStart[idx];
    for (var i = 1; i <= 8; i++) {
        str += (RandNum(0, 9) + "");
    }
    return str;
}

function RandNum(min, max) {
    var range = max - min;
    var rnd = Math.random();
    return (min + Math.round(rnd * range));
}



$.mockjax({
    url: "_test/getData",
    status: 200,
    responseTime: 100,
    contentType: "application/json",
    response: function (settings) {
        settings.data = settings.data || {};
        var pageIndex = settings.data.pageindex || 1,
             pageSize = settings.data.pagesize || 10
        this.responseText = GenerateData(pageIndex, pageSize);
    }
})
