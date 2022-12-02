const fetch = require('node-fetch');

async function zabbixLogout() {
    console.log(process.env.Z_SERVER)
    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                    "jsonrpc": "2.0",
                    "method": "user.logout",
                    "auth": ${process.env.Z_API_KEY}
                }`,
            headers: { 'Content-Type': 'application/json' },
        })
        
        console.log('Zabbix API отключен')
    } catch (e) {
        console.log(e)
        throw { message: "Ошибка отключения Zabbix API" }
    }

}


async function getAPIKey() {
    console.log(process.env.Z_SERVER)
    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                    "jsonrpc": "2.0",
                    "method": "user.login",
                    "params": {
                        "user": "${process.env.Z_NAME}",
                        "password": "${process.env.Z_PASSWORD}"
                    },
                    "id": 1,
                    "auth": null
                }`,
            headers: { 'Content-Type': 'application/json' },
        })
        const apiKey = await zResponse.json();
        process.env.Z_API_KEY = apiKey.result
        console.log('Zabbix API подключен')
        console.log('API_KEY: ', apiKey.result)
        return apiKey.result;
    } catch (e) {
        console.log(e)
        throw { message: "Ошибка подключения к Zabbix" }
    }

}

async function zabbixLogin() {
    try {
        await getAPIKey()
    } catch (e) {
        console.log(e)
        throw { message: e.message }
    }

}

async function getGroupID(groupName) {
    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                    "jsonrpc": "2.0",
                    "method": "hostgroup.get",
                    "params": {
                        "filter": {
                            "name": [
                                "${groupName}"
                            ]
                        }
                    },
                    "auth": "${process.env.Z_API_KEY}",
                    "id": 1
                }`,
            headers: { 'Content-Type': 'application/json' },
        })
        const result = await zResponse.json()
        console.log(result)
        return result.result[0].groupid
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }
}


async function getHosts(groupID) {
    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                    "jsonrpc": "2.0",
                    "method": "host.get",
                    "params": {
                        "groupids" : [${groupID}],   
                        "output": ["hostid", "name", "host", "inventory", "status"],
                        "selectMacros" : [
                            "macro",
                            "value"
                        ],
                        "selectInventory" : ["location", "location_lat", "location_lon", "url_a"],
                        "selectItems" : [
                            "key_",
                            "name",
                            "status",
                            "value_type",
                            "description", 
                            "lastvalue",
                            "units"
                        ]
                    },
                    "auth": "${process.env.Z_API_KEY}",
                    "id": 1
                }`,
            headers: { 'Content-Type': 'application/json' },
        })
        const result = await zResponse.json()

        return result.result
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }

}


async function getTriggers(groupID) {
    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                    "jsonrpc": "2.0",
                    "method": "trigger.get",
                    "params": {
                        "only_true" : 1,
                        "monitored" : 1,
                        "active" : 1,
                        "skipDependent" : 1,
                        "groupids" : [${groupID}],  
                        "selectHosts" : ["hostid"],
                        "output" : ["trigerrid", "description", "status", "lastchange", "priority", "state", "value"],
                    "filter": {
                    "value": 1
                      },
                    "sortfield": "priority",
                    "sortorder": "DESC"
                    },
                    "auth": "${process.env.Z_API_KEY}",
                    "id": 1
                }`,
            headers: { 'Content-Type': 'application/json' },
        })
        const result = await zResponse.json()
        return result.result
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }

}


async function getEvents(groupID) {
    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                "jsonrpc": "2.0",
                "method": "event.get",
                "params": {
                    "groupids" : [${groupID}],  
                    "output": "extend"
                },
                "auth": "${process.env.Z_API_KEY}",
                "id": 1
            }`,
            headers: { 'Content-Type': 'application/json' },
        })
        const result = await zResponse.json()
        return result.result
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }

}


async function getProblems(groupID) {

    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                    "jsonrpc": "2.0",
                    "method": "problem.get",
                    "params": {
                        "output" : "extend",
                        "selectAcknowledges" : "extend", 
                        "selectTags" : "extend",
                        "groupids" : [${groupID}] ,
                        "recent" : true
                    },
                    "auth": "${process.env.Z_API_KEY}",
                    "id": 1
                }`,
            headers: { 'Content-Type': 'application/json' },
        })
        const result = await zResponse.json()
        return result.result
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }

}


async function getHostsByID(hostIDs) {
    try {
        const zResponse = await fetch(`${process.env.Z_SERVER}/api_jsonrpc.php`, {
            method: 'post',
            body:
                `{
                        "jsonrpc": "2.0",
                        "method": "host.get",
                        "params": {
                            "hostids" : ${hostIDs}, 
                            "output": ["hostid", "name", "host", "inventory"],
                            "selectMacros" : [
                                "macro",
                                "value"
                            ],
                            "selectInventory" : ["location", "location_lat", "location_lon"],
                            "selectItems" : [
                                "key_",
                                "name",
                                "status",
                                "value_type",
                                "description", 
                                "lastvalue",
                                "units"
                            ]
                        },
                        "auth": "${process.env.Z_API_KEY}",
                        "id": 1
                    }`,
            headers: { 'Content-Type': 'application/json' },
        })
        const result = await zResponse.json()
        return result.result
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }
}

async function getHistory(itemIDs) {
    const request = {
        jsonrpc: "2.0",
        method: "history.get",
        params: {
            output: 'extend',
            // hostids : hostIDs, 
            itemids: itemIDs,
            limit: 10
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
        const result = await zResponse.json()
        console.log('result', result)
        return result.result
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }
}


async function getItems(hostIDs, key) {
    const request = {
        jsonrpc: "2.0",
        method: "item.get",
        params: {
            output: [
                "itemid",
                "name",
                "hostid",
                "lastvalue",
                "prevvalue"
            ],
            hostids: hostIDs,
            search: {
                key_: key
            },
            sortfield: "name"
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
        const result = await zResponse.json()
        return result.result
    } catch (e) {
        console.log(e)
        throw { message: "Нет связи с Zabbix сервером" }
    }
}




module.exports = {
    getAPIKey,
    getGroupID,
    getHosts,
    getTriggers,
    getEvents,
    getProblems,
    getHostsByID,
    zabbixLogin,
    zabbixLogout,
    getHistory,
    getItems

}










// async function test(){
//     const key = await getAPIKey()
//     console.log(key)
//     console.log(process.env.Z_API_KEY)
// }

// test()