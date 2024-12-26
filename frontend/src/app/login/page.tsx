"use client";

import Input from "@/components/UI/InputLogin";
import LoginBanner from "@/components/UI/LoginBanner";
import LoginBtn from "@/components/UI/LoginBtn";
import Title from "@/components/UI/Title";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [nis, setNis] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nis, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed");
      }

      if (data.user.role === "ADMIN") {
        router.push("/dashboard");
      } else if (data.user.role === "USER") {
        router.push("/");
      }

      console.log("User info:", data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-11/12 lg:w-10/12 glassmorphism rounded-xl shadow-lg overflow-hidden my-5">
        <div className="flex flex-col sm:flex-row h-full">
          <LoginBanner />
          <div className="w-full lg:w-1/3 bg-white">
            <div className="relative">
              <Image
                src={"/rectangle.png"}
                width={100}
                height={100}
                alt="rectangle"
                className="w-16 transform -scale-x-100 -scale-y-100 absolute top-0 right-0"
              />
            </div>
            <div className="flex flex-col justify-center gap-16 z-50 px-12 h-full">
              <div className="flex flex-col items-center mt-5 md:mt-0">
                <div className="flex items-center justify-center">
                  <Image
                    src={"/kampak.png"}
                    alt="logo"
                    width={40}
                    height={40}
                  />
                  <Image src={"/mppk.png"} alt="logo" width={40} height={40} />
                  <Image src={"/osis.png"} alt="logo" width={45} height={45} />
                </div>
                <div className="w-[32rem] text-center">
                  <Title title="pemilu raya osis" />
                </div>
                <h2 className="text-xl md:text-2xl mb-1 text-dark-blue mt-2">
                  Sign In
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <Input
                  name="nis"
                  label="NIS / NIP"
                  icon="mdi:user"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                />
                <Input
                  name="password"
                  label="Password"
                  icon="mdi:lock"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <LoginBtn text="Sign In" />
              </form>
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
              <div className="flex gap-2 items-center justify-center mb-5 md:mb-0">
                <h2 className="text-dark-blue">Powered By</h2>
                <Image src={"/nevtik.png"} alt="logo" width={40} height={40} />
              </div>
            </div>
            <div className="relative">
              <Image
                src={"/rectangle.png"}
                width={100}
                height={100}
                alt="rectangle"
                className="w-16 absolute bottom-0 left-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
