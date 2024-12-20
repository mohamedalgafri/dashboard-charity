import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from 'lucide-react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from './logout-button'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

const UserButton = () => {

    const user = useCurrentUser();

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className='bg-gray-900'>
                    <User className='text-white'/>
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='end'>
            <LogoutButton>
                <DropdownMenuItem>
                    Logout
                </DropdownMenuItem>
            </LogoutButton>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
