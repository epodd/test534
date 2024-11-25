import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export const BarChart = ({ chartData }) => {
  return (
    <div className="chart-container">
      <Bar
        style={{maxHeight: '80vh'}}
        options={{
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Value',
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(tooltipItem) {
                  return `Total price: ${tooltipItem.raw.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Dates',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Total',
              },
              beginAtZero: true,
            },
          },
        }}
        data={chartData}
      />
    </div>
  );
};

