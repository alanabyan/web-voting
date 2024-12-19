/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { getData } from "@/hooks/getAllCandidate";
import Image from "next/image";
import { Button } from "@/components/UI/button";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/UI/Spinner";
import { useRouter } from "next/navigation";

export default function Vote() {
  const { setDecodedToken, decodedToken } = useAuthStore();
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch("http://localhost:8000/candidates", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 201) {
        alert(data.message);
        setCandidates((prevCandidates) => [
          ...prevCandidates,
          data.newCandidate,
        ]);
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error while adding candidate:", error);
      alert("Failed to add candidate. Please try again.");
    }
  };

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/vote/check", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 208) {
          setTimeout(() => {
            setHasVoted(true);
          }, 500);

          await fetch("http://localhost:8000/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          router.push("/thanks");
        } else if (response.status === 200) {
          setHasVoted(false);
        }
      } catch (error) {
        console.error("Error checking vote status:", error);
      }
    };

    const fetchDecodedToken = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/token", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setDecodedToken(data.payload);
        }
      } catch (error) {
        console.error("Error fetching decoded token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkVoteStatus();
    fetchDecodedToken();
  }, [setDecodedToken]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const data = await getData();
      setCandidates(data?.data || []);
    };

    fetchCandidates();
  }, []);

  const handleVote = async (candidateId: string) => {
    try {
      const response = await fetch("http://localhost:8000/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 409) {
        alert(data.message);
      } else {
        alert(data.message);
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  if(loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <>
          <h1 className="text-dark-blue text-3xl md:text-5xl uppercase text-center font-semibold title">
            make your choices!
          </h1>
          <div className="md:mx-20 m-5">
            <h1 className="text-dark-blue md:text-3xl text-xl">
              Hello, {loading ? "Loading..." : decodedToken?.name || "Guest"}
            </h1>
            <div className="flex justify-between items-center">
              {decodedToken?.role === "ADMIN" ? (
                <Button
                  onClick={openModal}
                  className="p-2 bg-dark-blue text-white"
                >
                  Add Candidate
                </Button>
              ) : (
                <p className="text-white bg-dark-blue inline py-1 px-2 rounded-md text-lg">
                  {hasVoted ? "You voted for" : "You haven't voted yet"}
                </p>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl mb-4">Add Candidate</h2>
                <form onSubmit={handleAddCandidate}>
                  <div className="mb-4">
                    <label className="block mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Vision</label>
                    <textarea
                      name="vision"
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Mission</label>
                    <textarea
                      name="mission"
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Image</label>
                    <input
                      type="file"
                      name="image"
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white p-2 rounded"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="flex justify-around md:flex-row flex-col mx-20 my-5 items-center flex-wrap">
            {candidates.map((candidate: any, index: any) => (
              <div
                className="glassmorphism flex flex-col gap-2 items-center my-5 md:my-0 w-52 h-[23rem] rounded-lg transition duration-300 ease-in-out hover:scale-110"
                key={index}
              >
                <div className="avatar static m-2">
                  <div className="w-48 h-60 rounded-lg candidate-img justify-center items-center">
                    <Image
                      src={`http://localhost:8000/uploads/${candidate?.image}`}
                      alt=""
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-dark-blue w-44 text-center font-bold">
                  <span className="text-lg leading-none">
                    {candidate?.name}
                  </span>
                </div>
                <Button
                  onClick={() => handleVote(candidate.id)}
                  className="text-white text-xl px-10 bg-dark-blue rounded transition duration-300 hover:text-dark-blue hover:bg-light-blue"
                >
                  Vote
                </Button>
              </div>
            ))}
          </div>
    </>
  );
}
