import React from 'react'

interface HeaderProps{
    label?:string;
}

const Header = ({label}:HeaderProps) => {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
      <p className=' text-2xl  '>
            {label}
      </p>
    </div>
  )
}

export default Header
