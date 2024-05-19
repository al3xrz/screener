const { zabbixLogin, zabbixLogout } = require("../helpers/zabbix/zabbix");
const { createWriteStream } = require("fs")
const { Readable } = require("stream")
const path = require("path")


async function downloadGraph(graphid, width = 1200, height = 600, fileName) {

    const resp = await fetch(`${process.env.Z_SERVER}/chart2.php?graphid=${graphid}&from=now-24h&to=now&height=${height}&width=${width}&profileIdx=web.charts.filter&_=wmv2jkim`, {
        headers: {
            Cookie: `zbx_sessionid=${process.env.Z_API_KEY}`,
            Accept: "*/*"
        },
    })
    console.log(resp.body)

    if (resp.ok && resp.body) {
        console.log("Writing to file:", fileName);
        let writer = createWriteStream(fileName);
        Readable.fromWeb(resp.body).pipe(writer);
    }
}

async function getGraphs(hostid) {
    await zabbixLogin()
    const names = []
    console.log("hostid", hostid)

    const request = {
        jsonrpc: "2.0",
        method: "graph.get",
        params: {
            output: "extend",
            hostids: [hostid],
        },
        auth: process.env.Z_API_KEY,
        id: 1

    }

    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' },
        })
        const result = (await zResponse.json())
            .result
            .filter(gr => gr.name === "Основное питание" || gr.name === "Отклик комплекса")
            .map(gr => gr.graphid)
        console.log(result)
        for (let graphid of result) {
            let fileName = `screen_${hostid}_${graphid}_${Date.now()}.png`
            let fullName = path.resolve(__dirname, "..", "public", "results", fileName)
            names.push(fileName)
            await downloadGraph(graphid, 800, 400, fullName)
        }

        return names

    } catch (e) {
        console.log(e)
        return []
        //throw { message: "Нет связи с Zabbix сервером" }
    } finally {

        await zabbixLogout()
    }

}

module.exports = {
    getGraphs
}