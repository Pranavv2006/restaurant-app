import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import merchantService from "../../services/MerchantService";

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

interface WeeklyOrdersProps {
  restaurantId?: number;
}

const WeeklyOrders = ({ restaurantId }: WeeklyOrdersProps) => {
  const [data, setData] = useState<WeeklyOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use prop first, then fallback to localStorage, then default
        const id =
          restaurantId || Number(localStorage.getItem("restaurantId")) || 1;

        console.log("Fetching weekly orders for restaurant ID:", id);

        const res = await merchantService.WeeklyOrders({ restaurantId: id });

        if (res.success) {
          setData(res);
          console.log("Weekly orders data:", res.data);
        } else {
          setError(res.error || "Failed to fetch weekly orders");
        }
      } catch (error) {
        console.error("Failed to fetch weekly orders:", error);
        setError("Failed to fetch weekly orders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]); // Add restaurantId as dependency

  // Calculate total orders and percentage change
  const totalOrders = data?.data?.reduce((sum, d) => sum + d.count, 0) || 0;
  const todayOrders = data?.data?.slice(-1)[0]?.count || 0;
  const yesterdayOrders = data?.data?.slice(-2)[0]?.count || 0;
  const percentageChange =
    yesterdayOrders > 0
      ? Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 100)
      : 0;
  const isPositive = percentageChange >= 0;

  // Prepare chart data
  const categories =
    data?.data?.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    }) || [];

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
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
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
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          dashArray: 0,
        },
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontFamily: "Inter, ui-sans-serif",
          fontWeight: 400,
        },
        formatter: (title: string) => {
          let t = title;
          if (t) {
            const newT = t.split(" ");
            t = `${newT[0]} ${newT[1]?.slice(0, 3) || ""}`;
          }
          return t;
        },
      },
    },
    yaxis: {
      labels: {
        align: "left",
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontFamily: "Inter, ui-sans-serif",
          fontWeight: 400,
        },
        formatter: (value: number) =>
          value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString(),
      },
    },
    tooltip: {
      x: {
        format: "MMMM yyyy",
      },
      y: {
        formatter: (value: number) =>
          `${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`,
      },
    },
    colors: ["#2563eb"],
    responsive: [
      {
        breakpoint: 568,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              offsetX: -2,
              formatter: (title: string) => title.slice(0, 3),
            },
          },
          yaxis: {
            labels: {
              align: "left",
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              formatter: (value: number) =>
                value >= 1000
                  ? `${(value / 1000).toFixed(1)}k`
                  : value.toString(),
            },
          },
        },
      },
    ],
  };

  // Show error state
  if (error) {
    return (
      <div className="p-4 md:p-5 min-h-[25rem] flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex justify-center items-center flex-1">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading weekly orders</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-5 min-h-[25rem] flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 className="text-sm text-gray-500 dark:text-neutral-500">
            Weekly Orders
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
            {loading
              ? "Loading..."
              : totalOrders >= 1000
              ? `${(totalOrders / 1000).toFixed(1)}k`
              : totalOrders}
          </p>
        </div>

        <div>
          <span
            className={`py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${
              loading
                ? "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-500"
                : isPositive
                ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500"
                : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500"
            }`}
          >
            {loading ? (
              "..."
            ) : (
              <>
                <svg
                  className="inline-block size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isPositive ? (
                    <>
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </>
                  ) : (
                    <>
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </>
                  )}
                </svg>
                {Math.abs(percentageChange)}%
              </>
            )}
          </span>
        </div>
      </div>
      {/* End Header */}

      {/* Chart */}
      <div className="flex-1">
        {!loading && data?.data && data.data.length > 0 ? (
          <Chart options={options} series={series} type="area" height={300} />
        ) : loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyOrders;
