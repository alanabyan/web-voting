/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/UI/button";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/UI/Spinner";
import { useRouter } from "next/navigation";
import CardCandidate from "@/components/containers/CardCandidate";
import getAllCandidates from "@/hooks/getAllCandidate";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import DialogModal from "@/components/DialogModal";

export default function Vote() {
  const { setDecodedToken, decodedToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
    }
  };
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteCandidate = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/candidates/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await getAllCandidates();

      if (response.ok) {
        toast.success("Candidate deleted succesfully");
        window.location.reload();
      } else {
        alert(data.message || "Failed to delete the candidate.");
      }
    } catch (error) {
      console.error("Error while deleting candidate:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
        toast.success(data.message);
        closeModal();
        window.location.reload();
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
        toast.success(data.message);
        router.push("/thanks");
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[95%] gradient-bg-main -my-20 overflow-y-hidden">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="md:h-[95%] -my-20 h-[200%] gradient-bg-vote md:gradient-bg-main lg:overflow-y-hidden">
      <div className="md:my-24 my-20">
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Candidate Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  placeholder="Masukan nama kandidat"
                  name="name"
                  id="name"
                  required
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visi">Visi</Label>
                <Textarea
                  id="vision"
                  name="vision"
                  required
                  placeholder="Masukkan Visi Kandidat"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="misi">Misi</Label>
                <Textarea
                  id="mission"
                  name="mission"
                  required
                  placeholder="Masukkan Misi Kandidat"
                />
              </div>
              <div className="spacey-2">
                <Label htmlFor="image">Photo</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    handleFileSelect(file);
                    console.log(file.name); // Handle file upload here
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById("image")?.click()}
                >
                  {selectedFile ? (
                    <span className="text-gray-700">{selectedFile.name}</span>
                  ) : (
                    "Drag and drop an image here, or click to upload"
                  )}
                </div>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  className="opacity-0 absolute -z-10"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleFileSelect(file || null);
                  }}
                />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex justify-around md:flex-row flex-col mx-20 my-5 items-center flex-wrap">
          <CardCandidate
            onOpenDeleteDialog={(candidateId) => {
              setSelectedCandidateId(candidateId);
              setIsDeleteModalOpen(true);
            }}
            onOpenVoteDialog={(candidateId) => {
              setSelectedCandidateId(candidateId);
              setIsVoteModalOpen(true);
            }}
            decoded={decodedToken}
          />
          <DialogModal
            isOpen={isDeleteModalOpen}
            title="Delete Candidate"
            message="Are you sure you want to delete this candidate?"
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              if (selectedCandidateId) {
                handleDeleteCandidate(selectedCandidateId);
              }
              setIsDeleteModalOpen(false);
            }}
            confirmLabel="Hapus"
            confirmButtonVariant="destructive"
          />

          <DialogModal
            isOpen={isVoteModalOpen}
            title="Vote Candidate"
            message="Kamu yakin ingin memberikan suara kepada kandidat ini"
            onClose={() => setIsVoteModalOpen(false)}
            onConfirm={() => {
              if (selectedCandidateId) {
                handleVote(selectedCandidateId);
              }
              setIsVoteModalOpen(false);
            }}
            confirmLabel="Vote"
            confirmButtonVariant="outline"
            confirmButtonClass="bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue flex items-center"
          />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
