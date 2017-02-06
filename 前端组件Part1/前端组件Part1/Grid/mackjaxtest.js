function GenerateData(pageIndex, pageSize, sortBy, direction, name) {
    var list = {
        total: 1000,
        records: []
    }
    if (!name) {
        name = "张三";
    }
    for (var i = 0; i < pageSize; i++) {
        var o = {
            id: (((pageIndex - 1) * pageSize) + i).toString(),
            name: name + (((pageIndex - 1) * pageSize) + i).toString(),
            gender: (i % 2 == 0) ? "男" : "女",
            salary: parseInt(3000 * Math.random()) + 2000,
            age: parseInt(5 * Math.random()) + 20,
            createtime: new Date()
        };
        list.records.push(o);
    }
    console.log("排序字段：" + sortBy + "；排序方向：" + direction);
    return list;
}
$.mockjax({
    url: 'test/getdata',
    status: 200,
    responseTime: 100,
    contentType: "application/json",
    response: function (settings) {
        var pageIndex = settings.data.page,
            pageSize = settings.data.limit,
            sortBy = settings.data.sortBy,
            direction = settings.data.direction,
            name = settings.data.name;
        this.responseText = GenerateData(pageIndex, pageSize, sortBy, direction, name);
    },
});


