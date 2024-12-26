"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/UI/Spinner";
import Image from "next/image";

interface Candidate {
    id: string;
    vision: string;
    name: string;
    mission: string;
    image: string;
}

export default function CandidateDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`http://localhost:8000/candidates/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCandidate(data.data);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Candidate not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-5 modal-box max-w-full w-11/12 lg:w-full">
      <div className="flex md:flex-row justify-around gap-64">
        <div className="avatar md:inline hidden w-52">
          <div className="rounded-3xl w-[27rem]">
            <Image
              src={`http://localhost:8000/uploads/${candidate?.image}`}
              alt=""
              width={1000}
              height={1000}
            />
          </div>
        </div>
        <div className="md:w-3/4 w-11/12 text-dark-blue md:m-3 m-0 flex flex-col gap-5">
          <h1 className="md:text-4xl text-3xl font-bold">{candidate?.name}</h1>
          <div className="overflow-y-auto md:overflow-y-visible">
            <div className="mb-5">
              <h1 className="text-2xl font-semibold">Visi</h1>
              <p>{candidate?.vision}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
