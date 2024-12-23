"use client"

import BackButton from "./back-button";
import Header from "./header";
import Social from "./social";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel?:string;
    backButtonLabel?:string;
    backButtonHref:string;
    showSocial?:boolean;
}

const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial,
}:CardWrapperProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 w-[90%] max-w-[350px] md:w-[400px] shadow-md rounded-xl">
        <div className="p-5">
            <Header label={headerLabel} />
        </div>
        <div className="p-5">
            {children}
        </div>
        {
            showSocial && (
                <div className="p-5 text-center w-full flex justify-center" >
                    <Social />
                </div>
            )
        }
        <div className="p-2">
          
        </div>
    </div>
  )
}

export default CardWrapper
