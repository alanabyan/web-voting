import Image from "next/image";
import React from "react";

const LoginBanner = () => {
    return (
        <div className="w-full lg:w-2/3">
            <Image src={'/loginbanner.jpg'} priority width={800} height={800} alt="Login Banner" className="p-2 rounded-xl w-full" />
        </div>
    );
};

export default LoginBanner;
