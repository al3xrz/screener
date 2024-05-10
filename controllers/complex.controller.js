const { getGroupInfo, getHostInfo } = require("../helpers/zabbix/zabbix-ext");
const { uptimeToString, violationsFixations } = require("../helpers/math/math");
const { zabbixLogout, zabbixLogin } = require("../helpers/zabbix/zabbix");

const GROUP_NAME_PVF = "Комплексы ФВФ";
const GROUP_NAME_CODD = "ЦОДД";
const GROUP_NAME_CODD_NEW = "ЦОДД-NEW";
const GROUP_NAME_UPRDOR = "УпрДор";
const GROUP_NAME_CODD_OVN = "ЦОДД КАМЕРЫ ОВН";
const GROUP_NAME_SUPP = "Пешеходные переходы";
const GROUP_NAME_VSC = "Перекрестки VSC"
const GROUP_NAME_AXIS = "Перекрестки Axis"
const GROUP_NAME_CROSSROADS = "Перекрестки"





function getMaxPriority(complex) {
  let priorities = complex.triggers.map(trigger => parseInt(trigger.priority, 10));
  let maxPriority = Math.max(...priorities);
  // console.log('maxP', maxPriority)
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

async function getFullState(hostid) {
  await zabbixLogin();

  const host = (await getHostInfo(hostid))[0]
  const type = host.tags.find(tag => tag.tag === "type").value
  console.log(type)
  let state = []
  switch (type) {

    case "pvf": state = [...((await getGroupInfo(GROUP_NAME_PVF)).map((complex) => ({
      ...complex,
      type: "pvf",
    })))]; break;

    case "uprdor": state = [...((await getGroupInfo(GROUP_NAME_UPRDOR)).map((complex) => ({
      ...complex,
      type: "uprdor",
    })))]; break;

    case "codd": state = [...((await getGroupInfo(GROUP_NAME_CODD)).map((complex) => ({
      ...complex,
      type: "codd",
    }))),
    ...((await getGroupInfo(GROUP_NAME_CODD_NEW)).map((complex) => ({
      ...complex,
      type: "codd",
    }))),]; break;

    case "vsc":
      const vsc = [...((await getGroupInfo(GROUP_NAME_VSC)).map((complex) => ({
        ...complex,
        type: "vsc",
      })))];
      const vscChild = vsc.find(complex => complex.hostid === hostid)
    case "axis":
      const axis = [...((await getGroupInfo(GROUP_NAME_AXIS)).map((complex) => ({
        ...complex,
        type: "axis",
      })))];
      const axisChild = axis.find(complex => complex.hostid === hostid)
      const crossroads = [...((await getGroupInfo(GROUP_NAME_CROSSROADS)).map((complex) => ({
        ...complex,
        type: "crossroad",
      })))];
      const crNum = host.macros.find(macro => macro.macro === "{$CR_NUM}").value
      const crossroad = crossroads.find(cr => cr.macros.find(macro => macro.macro === "{$CR_NUM}").value === crNum)
      crossroad.child = vscChild || axisChild
      crossroad.child.problems = crossroad.child.triggers.map((trigger) => {
        return problemMutator(trigger);
      })
      crossroad.hostid = hostid // подмена hostid 
      state = crossroads

      break;



    case "pp": state = [...((await getGroupInfo(GROUP_NAME_SUPP)).map((complex) => ({
      ...complex,
      type: "pp",
    }))),]; break;

    case "camera_ovn": state = [...((await getGroupInfo(GROUP_NAME_CODD_OVN)).map((complex) => ({
      ...complex,
      type: "camera_ovn",
    }))),]; break;

  }


  switch (type) {
    case "pvf":
    case "camera_ovn":
    case "pp":
    case "codd":
    case "uprdor":
      state = state.map((complex) => {
        return {
          type: complex.type,
          hostid: complex.hostid,
          name: complex.name,
          host: complex.host,
          problems: complex.triggers.map((trigger) => {
            return problemMutator(trigger);
          }),
          priority: getMaxPriority(complex),
          inventory: complex.inventory,
          macros: complex.macros,
          violations: violationsFixations(complex).violations,
          fixations: violationsFixations(complex).fixations,
          lastUpdate: Date.now(),

        };
      });
      break

    case "vsc":
    case "axis":
      state = state.map((complex) => {
        return {
          type: complex.type,
          hostid: complex.hostid,
          name: complex.name,
          host: complex.host,
          problems: complex.triggers.map((trigger) => {
            return problemMutator(trigger);
          }),
          priority: getMaxPriority(complex),
          inventory: complex.inventory,
          macros: complex.macros,
          violations: violationsFixations(complex).violations,
          fixations: violationsFixations(complex).fixations,
          lastUpdate: Date.now(),
          child: complex.child
        };
      });

      break


  }


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
