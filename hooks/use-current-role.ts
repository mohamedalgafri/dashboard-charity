import { useSession } from "next-auth/react";

export const useCurrentRole = () =>{
    const session = useSession();

    console.log( "rooole : " + session.data?.user.role);
    return session.data?.user.role;
}