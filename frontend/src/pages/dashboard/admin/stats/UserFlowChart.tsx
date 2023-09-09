import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import { ITimeSeriesData } from "./AdminStats";

interface UserFlowChartProps {
  userflow: ITimeSeriesData[];
}

const UserFlowChart: React.FC<UserFlowChartProps> = (props) => {
  const { userflow } = props;

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);

    const labels = userflow.map(item => item.date);
    const dataPoints = userflow.map(item => item.count);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "User Registrations",
          data: dataPoints,
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: documentStyle.getPropertyValue("--text-color"),
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: documentStyle.getPropertyValue("--text-color-secondary"),
          },
          grid: {
            color: documentStyle.getPropertyValue("--surface-border"),
          },
        },
        y: {
          ticks: {
            color: documentStyle.getPropertyValue("--text-color-secondary"),
            stepSize: 1,
          },
          grid: {
            color: documentStyle.getPropertyValue("--surface-border"),
          },
          min: 0,
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [userflow]);

  return (
    <div className="card">
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
};

export default UserFlowChart;