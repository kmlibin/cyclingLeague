import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SpecialtyBarChart = ({ bardata, colors }) => {
  const COLORS = ["#009900", "#ffa500", "#51d5eb", "#cc0000"];
  return (
    <ResponsiveContainer
      width="100%"
      height={420}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="d-flex flex-column align-items-center justify-content-center wrap">
        <BarChart
          width={300}
          height={300}
          data={bardata}
          margin={{
            top: 20,
            right: 50,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis dataKey="lName" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="count">
            {bardata.map((item, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
            ))}
          </Bar>
        </BarChart>

        {/* //custom legend */}

        <div
          className="d-flex flex-wrap justify-content-center"
          style={{ width: "75%", marginTop: "1rem" }}
        >
          {bardata.map((spec, index) => (
            <div className="d-flex align-items-center m-1">
              <span
                style={{
                  backgroundColor: COLORS[index % 20],
                  width: "16px",
                  height: "16px",
                  marginRight: "5px",
                  borderRadius: "50%",
                }}
              />
              <span style={{ color: COLORS[index % 20] }}>{spec.name}</span>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default SpecialtyBarChart;
