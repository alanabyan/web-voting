"use client";

import getData from "@/hooks/getAllCandidate";
import { Button } from "../UI/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CandidateProps } from "@/interface/CandidateType";

interface CandidateCardProps {
  onVote: (candidateId: string) => void;
  onDelete: (id: string) => void;
  decoded: { role: string };
  onOpenDeleteDialog: (candidateId: string) => void;
  onOpenVoteDialog: (candidateId: string) => void;
}

const CardCandidate: React.FC<CandidateCardProps> = ({
  decoded,
  onOpenDeleteDialog,
  onOpenVoteDialog,
}) => {
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const router = useRouter();

  const handleCardClick = (candidateId: string) => {
    router.push(`/candidate/${candidateId}`);
  };

  useEffect(() => {
    getData()
      .then((data) => setCandidates(data))
      .catch((error) => console.error("Error fetching candidates:", error));
  }, []);

  return (
    <>
      {candidates.map((candidate: CandidateProps, index: number) => (
        <div
          className="glassmorphism flex flex-col gap-2 items-center my-5 md:my-0 w-52 h-[23rem] rounded-lg transition duration-300 ease-in-out hover:scale-110"
          key={index}
        >
          <div
            className="avatar static m-2"
            onClick={() => handleCardClick(candidate.id)}
          >
            <div className="w-48 h-60 rounded-lg candidate-img justify-center items-center">
              <Image
                src={`http://localhost:8000/uploads/${candidate?.image}`}
                alt=""
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-dark-blue w-44 text-center font-bold">
            <span className="text-lg leading-none">{candidate?.name}</span>
          </div>
          {decoded.role === "ADMIN" ? (
              <Button
                variant="destructive"
                onClick={() => onOpenDeleteDialog(candidate.id)}
                className="text-xl px-10 rounded "
              >
                Delete
              </Button>
          ) : (
              <Button
                onClick={() => onOpenVoteDialog(candidate.id)}
                className="text-white text-xl px-10 bg-dark-blue rounded transition duration-300 hover:text-dark-blue hover:bg-light-blue"
              >
                Vote
              </Button>
          )}
        </div>
      ))}
    </>
  );
};

export default CardCandidate;
