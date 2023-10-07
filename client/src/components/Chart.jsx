import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export const options = {
  responsive: true,
  plugins: {
    legend: true,
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false, //this will remove only the label
      },
    },

    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false, //this will remove only the label
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [2, 4, 5, 7, 7, 6, 5],
      backgroundColor: "aqua",
      borderColor: "black",
      pointBorderColor: "black",
    },
  ],
};

export default function Chart() {
  return (
    <div style={{ width: "300px", height: "50px" }}>
      <Line options={options} data={data} />;
    </div>
  );
}
