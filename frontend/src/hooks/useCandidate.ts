import { useEffect, useState } from "react";

interface CandidatesProps {
    id: string;
    vision: string;
    name: string;
    mission: string;
    image: string;
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<CandidatesProps[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("http://localhost:8000/candidates", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setCandidates(data.data || []);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return candidates;
}
