"use client";

import Image from "next/image";
import Title from "../UI/Title";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../UI/dropdown-menu";
import { Button } from "../UI/button";
import { Icon } from "@iconify/react";


export default function Navbar() {
  const pathname = usePathname();
  const [decodedToken, setDecodedToken] = useState<{
    name?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  useEffect(() => {
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
        } else {
          console.error("Failed to fetch decoded token");
        }
      } catch (error) {
        console.error("Error fetching decoded token:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pathname !== "/thanks") {
      fetchDecodedToken();
    } else {
      setDecodedToken(null);
      setLoading(false);
    }
  }, [pathname]);

  const logo = [
    { logo: "/kampak.png" },
    { logo: "/mppk.png" },
    { logo: "/osis.png" },
  ];

  return (
    <div className="z-50 glassmorphism w-full">
      <nav className="flex justify-between p-2 h-24 md:ml-6 md:mr-6 relative mb-5">
        <div className="ml-5 flex items-center">
          {logo.map((item, index) => (
            <div className="" key={index}>
              <Image src={item.logo} width={39} height={39} alt="logo" />
            </div>
          ))}
          <div className="lg:block hidden pl-2">
            <Title title={"pemilu raya osis 2024"} />
          </div>
        </div>
        <div className="flex gap-6 items-center mr-5">
          {pathname === "/thanks" ? (
            <Link
              href={"/login"}
              className="text-2xl capitalize text-dark-blue"
            >
              login
            </Link>
          ) : (
            <>
              <Link href={"/"} className="text-2xl capitalize text-dark-blue">
                Dashboard
              </Link>
              <Link
                href={"/vote"}
                className="text-2xl capitalize text-dark-blue"
              >
                Vote
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg">
                    <div className="avatar static text-dark-blue">
                      <div className="w-9 rounded-full">
                        <Image
                          src={"/placeholder-profile.png"}
                          width={100}
                          height={100}
                          alt="logo"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                    <span className="text-dark-blue text-xl">
                      {loading
                        ? "Loading..."
                        : decodedToken?.name
                        ? `Hi, ${decodedToken.name}`
                        : "Hi"}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={"/dashboard"} className="flex items-center gap-2"><Icon icon="mdi:home" />Back To Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button className="bg-transparent text-black flex items-center hover:bg-transparent -ml-3.5" onClick={() => handleLogout()}>
                      <Icon icon="material-symbols:logout" /> Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
