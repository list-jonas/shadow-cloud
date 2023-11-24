import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import { ITimeSeriesData } from "./AdminStats";

interface UploadFlowChartProps {
  uploadflow: ITimeSeriesData[];
}

const UploadFlowChart: React.FC<UploadFlowChartProps> = (props) => {
  const { uploadflow } = props;

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);

    const labels = uploadflow.map(item => item.date);
    const dataPoints = uploadflow.map(item => item.count);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Upload Counts",
          data: dataPoints,
          fill: false,
          borderColor: documentStyle.getPropertyValue("--green-500"),
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
  }, [uploadflow]);

  return (
    <div className="card">
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
};

export default UploadFlowChart;