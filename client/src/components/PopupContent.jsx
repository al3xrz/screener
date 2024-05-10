import React from "react";

function PopupContent(props) {

  const header = complex => {
    switch (complex.type) {
      case "codd": return `ЦОДД. ${complex.name}`
      case "uprdor": return `УПРДОР. ${complex.name}`
      case "axis":
      case "vsc": return `Перекресток. ${complex.name}`
      case "pvf": return `Комплекс КС. ${complex.name}`
      default: return `${complex.name}`
    }
  }

  const childInfo = complex => {
    if (complex.child) {
      return (
        <div style={{ paddingLeft: "10px", fontSize: "13px" }} >
          <br />
          {
            props.complex.child ?
              props.complex?.child.name : ""
          }
          <br />
          {
            props.complex.child.problems.map(problem => {
              return (
                <div key={problem.name} style={{ color: "red", }}>
                  {problem.name} : {problem.duration}
                </div>)
            })
          }
          <br />

        </div>
      )
    } else return (
      <div>
        <br />
      </div>
    )
  }


  return (
    <div>
      {header(props.complex)}
      <br />
      <br />[{props.complex.inventory.location_lat} ,{" "}
      {props.complex.inventory.location_lon}]
      <br />
      <br />({new Date(props.complex.lastUpdate).toLocaleString("ru")})
      <br />
      <br />
      <span style={{ color: "green" }}>
        Проездов в течение дня: {props.complex.fixations}
      </span>
      <br />
      <span style={{ color: "red" }}>
        Нарушений в течение дня: {props.complex.violations}
      </span>
      <br />
      {
        childInfo(props.complex)
      }
      {props.complex.problems.length === 0 ? (
        <span style={{ color: "green" }}>
          {" "}
          Комплекс работает в штатном режиме
        </span>
      ) : (
        props.complex.problems.map((problem) => {
          if (problem) {
            return (
              <div key={problem.name}>
                <span style={{ color: "red" }}>
                  {problem.name}: {problem.duration}
                </span>
                <br />
              </div>
            );
          }
          return false;
        })
      )}
    </div>
  );
}

export default PopupContent;
