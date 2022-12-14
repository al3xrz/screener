const { getGroupInfo, getHostInfo } = require("../helpers/zabbix/zabbix-ext");
const { uptimeToString, violationsFixations } = require("../helpers/math/math");
const { zabbixLogout, zabbixLogin } = require("../helpers/zabbix/zabbix");

const GROUP_NAME_PVF = "Комплексы ФВФ";
const GROUP_NAME_CODD = "ЦОДД";
const GROUP_NAME_CODD_NEW = "ЦОДД-NEW";

function getMaxPriority(complex) {
  let priorities = complex.triggers.map(trigger => parseInt(trigger.priority, 10));
  let maxPriority = Math.max(...priorities);
  return maxPriority
}

function problemMutator(trigger) {
  if (trigger.problem.tags.filter((tag) => tag.tag === "name")[0]) {
    problemName = trigger.problem.tags.filter((tag) => tag.tag === "name")[0]
      .value;
    problemDuration =
      Math.floor(Date.now() / 1000) -
      parseInt(trigger.lastchange) +
      parseInt(
        trigger.problem.tags.filter((tag) => tag.tag === "base")[0].value
      );
    return {
      name: problemName,
      duration: uptimeToString(problemDuration),
    };
  }
  return null;
}

async function getFullState() {
  await zabbixLogin();

  const state = [
    ...((await getGroupInfo(GROUP_NAME_PVF)).map((complex) => ({
      ...complex,
      type: "base",
    }))),
    ...((await getGroupInfo(GROUP_NAME_CODD)).map((complex) => ({
      ...complex,
      type: "codd",
    }))),
    ...((await getGroupInfo(GROUP_NAME_CODD_NEW)).map((complex) => ({
      ...complex,
      type: "coddN",
    }))),
  ].map((complex) => {
    return {
      type : complex.type,
      hostid: complex.hostid,
      name: complex.name,
      host: complex.host,
      problems: complex.triggers.map((trigger) => {
        return problemMutator(trigger);
      }),
      priority : getMaxPriority(complex),
      inventory: complex.inventory,
      macros: complex.macros,
      violations: violationsFixations(complex).violations,
      fixations: violationsFixations(complex).fixations,
      lastUpdate : Date.now()
    };
  });

  await zabbixLogout();

  return state;
}

async function getHostStateByHostid(hostid) {
  const fullState = await getFullState();
  return fullState.find((complex) => complex.hostid == hostid);
}

async function getHostStateByHost(host) {
  const fullState = await getFullState();
  return fullState.find((complex) => complex.host == host);
}

module.exports = {
  getFullState,
  getHostStateByHost,
  getHostStateByHostid
};
