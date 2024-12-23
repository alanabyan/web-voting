/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/UI/button";
import { DataTable } from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/UI/dropdown-menu";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/UI/dialog";
import { Input } from "@/components/UI/input";
import toast, { Toaster } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../UI/select";


interface User {
  id: string;
  name: string;
  nis: string;
  role: string;
  kelas: string;
  hasVoted: boolean;
}

const getDataUser = async () => {
  try {
    const response = await fetch("http://localhost:8000/vote/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [kelasFilter, setKelasFilter] = useState<string | null>(null);
  const [votingFilter, setVotingFilter] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [nis, setNis] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [kelas, setKelas] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getDataUser();
      setUsers(data);
      setFilteredUsers(data);
    };
    fetchUsers();
  }, []);

  const applyFilters = () => {
    let filtered = users;

    if (kelasFilter) {
      filtered = filtered.filter((user) => user.kelas === kelasFilter);
    }

    if (votingFilter) {
      filtered = filtered.filter((user) =>
        votingFilter === "voted" ? user.hasVoted : !user.hasVoted
      );
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters();
    console.log("Filtered Users:", filteredUsers);
  }, [kelasFilter, votingFilter]);

  const handleDelete = async () => {
    if (!selectedUserId) return alert("No user selected for deletion");

    try {
      const response = await fetch(
        `http://localhost:8000/auth/delete/${selectedUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      toast.success("User successfully deleted!");
      setSelectedUserId(null);
      window.location.reload();

      const data = await getDataUser();
      setUsers(data);
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Failed to delete user.");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !nis || !kelas || !role || !password) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    const newUser = {
      name,
      nis,
      kelas,
      role,
      password,
    };

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data from backend:", errorData);
        throw new Error("Gagal menambahkan user");
      }

      toast.success("User berhasil ditambahkan!");

      setIsAddUserModalOpen(false);
      setName("");
      setNis("");
      setKelas("");
      setRole("");
      setPassword("");

      const usersData = await getDataUser();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error saat menambah user:", error);
      toast.error("Terjadi kesalahan saat menambah user");
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "index",
      header: () => (
        <div className="text-dark-blue font-bold text-base">NO</div>
      ),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: () => (
        <div className="text-dark-blue font-bold text-base">NAME</div>
      ),
    },
    {
      accessorKey: "nis",
      header: () => (
        <div className="text-dark-blue font-bold text-base">NIS</div>
      ),
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="text-dark-blue font-bold text-base">ROLE</div>
      ),
    },
    {
      accessorKey: "kelas",
      header: () => (
        <div className="text-dark-blue font-bold text-base">KELAS</div>
      ),
    },
    {
      accessorKey: "hasVoted",
      header: () => (
        <div className="text-dark-blue font-bold text-base">VOTED</div>
      ),
      cell: ({ row }) => (
        <Button
          variant="outline"
          disabled
          className={`uppercase text-sm ${
            row.original.hasVoted
              ? "bg-light-blue text-dark-blue"
              : "bg-dark-blue text-light-blue font-bold"
          } w-32`}
        >
          {row.original.hasVoted ? "Voted" : "Not Voted"}
        </Button>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-dark-blue font-bold text-base">ACTIONS</div>
      ),
      cell: ({ row }) => (
        <div className="flex">
          <Button
            variant="destructive"
            onClick={() => {
              setSelectedUserId(row.original.id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto text-dark-blue h-screen overflow-y-auto font-bold bg-table sidebar-shadow rounded-3xl w-[100%] p-2 md:p-10">
      <div className="mb-10">
        <p className="text-lg text-main-bg font-medium">list</p>
        <p className="text-3xl font-extrabold tracking-tight text-dark-blue dark:text-lightOne">
          users
        </p>
      </div>
      <div className="flex gap-4 mb-6 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-light-blue text-dark-blue hover:bg-dark-blue hover:text-light-blue flex items-center"
            >
              <div className="flex items-center gap-2">
                Kelas
                <Icon icon={"tabler:chevron-down"} width={20} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setKelasFilter(null)}>
              Semua
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setKelasFilter("XII SIJA I")}>
              XII SIJA
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setKelasFilter("GURU PNS")}>
              GURU PNS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-light-blue text-dark-blue hover:bg-dark-blue hover:text-light-blue flex items-center"
            >
              <div className="flex items-center gap-2">
                Status Voting
                <Icon icon={"tabler:chevron-down"} width={20} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setVotingFilter(null)}>
              Semua
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVotingFilter("voted")}>
              Sudah Vote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVotingFilter("not-voted")}>
              Belum Vote
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          className="bg-light-blue text-dark-blue hover:bg-dark-blue hover:text-light-blue flex items-center"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          Add User
        </Button>
      </div>

      <DataTable columns={columns} data={filteredUsers} />

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus user ini?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
                setIsDeleteModalOpen(false);
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAddUserModalOpen(false);
            }}
          >
            <div className="grid gap-4 py-4">
              <Input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="NIS" value={nis} onChange={(e) => setNis(e.target.value)} />
              <Input placeholder="Kelas" value={kelas} onChange={(e) => setKelas(e.target.value)} />
              <Select onValueChange={(value: string) => {
                setRole(value)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">
                    USER
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    ADMIN
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" onClick={handleAddUser}>Tambah</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster position="top-center" />
    </div>
  );
};

export default Users;
