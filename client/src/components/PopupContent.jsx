import React from "react";

function PopupContent(props) {
  return (
    <div>
      {props.complex.type === "base"
        ? props.complex.name
        : `ЦОДД. ${props.complex.name}`}
      <br />
      <br />[{props.complex.inventory.location_lat} ,{" "}
      {props.complex.inventory.location_lon}]
      <br />
      <br />({new Date(props.complex.lastUpdate).toLocaleString("ru")})
      <br />
      <br />
      <span style={{ color: "green" }}>
        Фиксаций в течение дня: {props.complex.fixations}
      </span>
      <br />
      <span style={{ color: "red" }}>
        Нарушений в течение дня: {props.complex.violations}
      </span>
      <br />
      <br />
      {props.complex.problems.length === 0 ? (
        <span style={{ color: "green" }}>
          {" "}
          Комплекс работает в штатном режиме
        </span>
      ) : (
        props.complex.problems.map((problem) => {
          if (problem) {
            return (
              <>
                <span style={{ color: "red" }}>
                  {problem.name}: {problem.duration}
                </span>
                <br />
              </>
            );
          }
        return false;
        })
      )}
    </div>
  );
}

export default PopupContent;
