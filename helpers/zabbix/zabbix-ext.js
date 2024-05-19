const
    {
        getGroupID,
        getHosts,
        getTriggers,
        getProblems,
        getHostsByID,
    } = require('./zabbix')


async function getHostInfo(hostid) {
    try {
        const host = await getHostsByID(hostid);
        return host;
    } catch (e) {
        console.log.log(e.message);
        throw {message : "Невозможно получить информацию  об узле Zabbix"};
    }
}


async function getGroupInfo(groupName) {
    try {
        const id = await getGroupID(groupName);
        const hosts = await getHosts(id);
        const triggers = await getTriggers(id);
        const problems = await getProblems(id);

        for (trigger of triggers) {
            trigger.problem = problems.filter(problem => {
                return problem.objectid === trigger.triggerid
            })[0]
        }

        for (host of hosts) {
            host.triggers = triggers.filter(trigger => {
                return host.hostid == trigger.hosts[0].hostid
            })
        }
        return hosts;
    } catch (e) {
        console.log(e.message)
        throw {message : "Невозможно получить список узлов Zabbix"};
    }


}



module.exports = {
    getGroupInfo,
    getHostInfo,
}