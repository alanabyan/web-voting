"use client";

import Image from "next/image";
import Link from "next/link";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";
import { useEffect, useRef, useState } from "react";

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<{
    totalUser: number;
    userVoted: number;
    userNotvoted: number;
  }>({
    totalUser: 0,
    userVoted: 0,
    userNotvoted: 0,
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:8000/vote/calculation", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        setChartData({
          totalUser: data.totalUser,
          userVoted: data.userVoted,
          userNotvoted: data.userNotvoted,
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (canvasRef.current) {
      const { totalUser, userVoted, userNotvoted } = chartData;

      // Calculate percentages
      const votedPercentage = (userVoted / totalUser) * 100;
      const notVotedPercentage = (userNotvoted / totalUser) * 100;

      chartRef.current = new Chart(canvasRef.current, {
        type: "pie",
        data: {
          labels: ["Voted", "Not Voted"],
          datasets: [
            {
              label: "Voting Statistics",
              data: [votedPercentage, notVotedPercentage],
              backgroundColor: [
                votedPercentage > 0 ? "#665191" : "#ffcc00", // Green for voted
                notVotedPercentage > 0 ? "#2f4b7c" : "#ff4f4f", // Gray for not voted, Red if not voted is zero
              ],
              borderColor: ["#ffffff", "#ffffff"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const value = tooltipItem.raw as number;
                  return tooltipItem.label + ": " + value.toFixed(2) + "%";
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="-z-10 overflow-hidden">
      <div className="z-10 flex flex-col items-center justify-between ">
        <h1 className="md:text-2xl text-xl text-center text-dark-blue font-extrabold">
          Civitas SMK Negeri 1 Cibinong sudah memberikan suaranya!
        </h1>
        <div className="my-10">
          <canvas ref={canvasRef} width={250} height={250} />
        </div>
        <h1 className="md:text-2xl text-xl text-center text-dark-blue font-extrabold">
          Tunggu apa lagi? Ayo tentukan pilihanmu!
        </h1>
        <div className="flex justify-center items-center my-5">
          <Link
            href={"/vote"}
            className="text-light-blue py-2 px-16 bg-dark-blue hover:bg-transparent hover:text-dark-blue border-dark-blue border-[2px] text-xl rounded-3xl font-bold transition-all ease-out duration-150"
          >
            Vote
          </Link>
        </div>
      </div>
      <Image
        src="/leftmascot.png"
        alt=""
        width={200}
        height={200}
        className="absolute bottom-0 left-10 lg:inline hidden"
      />
      <Image
        src="/rightmascot.png"
        alt=""
        width={200}
        height={200}
        className="absolute bottom-0 right-10 lg:inline hidden"
      />
    </div>
  );
}
