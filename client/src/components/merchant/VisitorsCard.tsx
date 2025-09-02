import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import WeeklyOrdersAPI from "../../services/MerchantService";

export interface WeeklyOrdersItem {
  date: string;
  count: number;
}

export interface WeeklyOrdersResponse {
  success: boolean;
  data?: WeeklyOrdersItem[];
  message?: string;
  error?: string;
}

const VisitorsCard = () => {
  const [data, setData] = useState<WeeklyOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantId = Number(localStorage.getItem("restaurantId") || 1);

        const res = await WeeklyOrdersAPI.WeeklyOrders({ restaurantId });
        setData(res);
      } catch (error) {
        console.error("Failed to fetch weekly orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories =
    data?.data?.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    ) || [];

  const series = [
    {
      name: "Orders",
      data: data?.data?.map((d) => d.count) || [],
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 300,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      curve: "straight",
      width: 2,
    },
    grid: {
      strokeDashArray: 2,
      borderColor: "#e5e7eb",
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.8,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "category",
      tickPlacement: "on",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontFamily: "Inter, ui-sans-serif",
          fontWeight: 400,
        },
      },
    },
    yaxis: [
      {
        labels: {
          align: "left",
          style: {
            colors: "#9ca3af",
            fontSize: "13px",
            fontFamily: "Inter, ui-sans-serif",
            fontWeight: 400,
          },
          formatter: (value: number): string =>
            value >= 1000 ? `${value / 1000}k` : `${value}`,
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (value: number): string =>
          value >= 1000 ? `${value / 1000}k` : `${value}`,
      },
    },
    colors: ["#2563eb"],
  };

  return (
    <div className="p-4 md:p-5 min-h-[25rem] flex flex-col bg-white border border-gray-200 shadow rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 className="text-sm text-gray-500 dark:text-neutral-500">
            Weekly Orders
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
            {loading
              ? "Loading..."
              : data?.data?.reduce((sum, d) => sum + d.count, 0) || 0}
          </p>
        </div>

        <div>
          <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-500">
            {loading ? (
              "..."
            ) : (
              <>
                <svg
                  className="inline-block size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                {data?.data?.slice(-1)[0]?.count ?? 0} today
              </>
            )}
          </span>
        </div>
      </div>

      {/* Chart */}
      {!loading && data ? (
        <Chart options={options} series={series} type="area" height={300} />
      ) : (
        <div className="flex justify-center items-center flex-1">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      )}
    </div>
  );
};

export default VisitorsCard;
