import Image from "next/image";

export default function Thanks() {
  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <div className="flex items-center">
        <Image height={100} width={100}
          src="/kampak.png"
          alt="logo-kampak"
          className="md:w-36 w-20"
        />
        <Image height={100} width={100}
          src="/mppk.png"
          alt="logo-mppk"
          className="ml-2 md:w-36 w-20"
        />
        <Image height={100} width={100} src="/osis.png" alt="logo-osis" className="md:w-36 w-24" />
      </div>
      <div className="text-dark-blue text-center">
        <h1 className="md:text-6xl text-3xl font-bold">
          Thank you for your vote!
        </h1>
        <h3 className="md:text-3xl text-2xl my-5">
          satukan suara, wujudkan demokrasi, lahirkan pemimpin berdedikasi
        </h3>
        <div className="flex gap-1 justify-center items-center">
          <p className="text-xl">powered by</p>
          <Image height={40} src="/nevtik.png" alt="logo-nevtik" width={40} />
        </div>
      </div>
    </div>
  );
}
