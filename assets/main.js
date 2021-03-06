$(document).ready(function() {
    var d = $("#nodeTable").DataTable({
        columnDefs: [{
            targets: [0, 1],
            visible: !1,
            searchable: !1
        }],
        order: [
            [2, "asc"]
        ],
        searching: !1,
        info: !1,
        paging: !1,
        lengthMenu: -1
    });
    loadTable(d);
    setInterval(function() {
        updateTable(d)
    }, 31000)
});

function updateTable(d) {
    d.rows().every(function(d, a, c) {
        var b = this.data(),
            e = this;
        $.ajax({
            url: apiInterface + b[0] + "/" + b[1] + "/getinfo?random=" + (new Date).getTime(),
            dataType: "json",
            type: "GET",
            cache: "false",
            success: function(a) {
                a.error ? (b[4] = 0, b[5] = "No", b[6] = "0 H/s", b[7] = 0, b[8] = 0, b[9] = 0, b[10] = 0, b[11] = 0, b[12] = "Unknown") : (b[4] = a.height, b[5] = a.synced ? "Yes" : "No", b[6] = a.difficulty, b[7] = (a.globalHashRate / 1E6).toFixed(2) + " MH/s", b[8] = a.tx_pool_size, b[9] = a.tx_count, b[10] = a.incoming_connections_count, b[11] = a.outgoing_connections_count,
                    b[12] = a.version);
                e.invalidate()
            }
        })
    });
    d.draw()
}

function loadTable(d) {
    $.each(nodes, function(f, a) {
    	console.log(`http://${a.hostname}:${a.port}/getinfo?random=`)
        $.ajax({
            url: a.api,
            dataType: "json",
            type: "GET",
            cache: "false",
            success: function(c) {
                if (c.synced) {
                   c.error ? d.row.add([a.hostname, a.port, a.name, a.region, 0, 0, "0 H/s", "No", 0, 0, 0, 0, "Unknown"]).draw(!1) : d.row.add([a.hostname, a.port, a.name, a.region, c.height, c.synced ? "Yes" : "No", c.difficulty, (c.globalHashRate / 1E6).toFixed(2) + " MH/s", c.tx_pool_size, c.tx_count, c.incoming_connections_count, c.outgoing_connections_count,
                    c.version
                    ]).draw(!1) 
                }
                
            }
        })
    })
};