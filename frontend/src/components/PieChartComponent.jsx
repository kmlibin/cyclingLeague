import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#cc0000", "#6751eb", "#51d5eb", "#009900", "#ffa500"];

const PieChartComponent = ({ specialties }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={specialties}
          dataKey="points"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          labelLine={false}
          nameKey="specialty"
          label
        >
          {specialties.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" iconType="circle" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
