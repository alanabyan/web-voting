"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";
import getTotalVoters from "@/hooks/getTotalVoters";
import getWinners from "@/hooks/getWinners";

Chart.register(PieController, ArcElement, Tooltip, Legend);

interface VoteProps {
  totalUser: string;
}

export default function Statistics() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [winners, setWinners] = useState<any[]>([]);
  const [totalVoters, setTotalVoters] = useState<VoteProps>();

  useEffect(() => {
    getWinners()
      .then((data) => {
        setWinners(data.slice(0, 3));
      })
      .catch((error) => console.error("Error fetching winners:", error));

    getTotalVoters()
      .then((data) => setTotalVoters(data))
      .catch((error) => console.error("Error fetching total voters:", error));
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (canvasRef.current && winners.length > 0) {
      const labels = winners.map((winner) => winner.candidate.name);
      const votes = winners.map((winner) => winner.votes);
      const backgroundColors = ["#665191", "#2f4b7c", "#a05195"];

      chartRef.current = new Chart(canvasRef.current, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              label: "Vote Distribution",
              data: votes,
              backgroundColor: backgroundColors.slice(0, labels.length),
              borderColor: ["#ffffff"],
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
                  return tooltipItem.label + ": " + value + " votes";
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
  }, [winners]);

  return (
    <div className="glassmorphism rounded-3xl w-full">
      <div className="flex justify-center">
        <div className="text-dark-blue font-bold text-4xl py-5">
          Congratulations To
          <p className="text-main-bg text-3xl font-semibold flex justify-center">
            {winners[0]?.candidate.name || "Unknown Winner"}
          </p>
          <p className="text-main-blue text-xl font-semibold flex justify-center">
            Total Voters: {totalVoters?.totalUser || 0}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-1 gap-2">
        {winners.map((winner: any, index: number) => (
          <div key={index} className="">
            <div className="flex justify-center text-center">
              <div className="flex flex-col">
                <h1 className="text-3xl text-main-bg font-bold">
                  {winner.candidate?.name || "Unknown Candidate"}
                </h1>
                <p className="text-main-blue text-2xl font-semibold">
                  Votes: {winner.votes || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="my-10 flex flex-col w-[32rem]">
          <p className="text-center">Voters per candidate</p>
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            style={{ width: "200px", height: "200px" }}
          ></canvas>
        </div>
      </div>
    </div>
  );
}
