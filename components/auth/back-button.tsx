import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';

interface BackButtonProps{
    label?:string;
    href:string;
}

const BackButton = ({
    label,
    href,
}:BackButtonProps) => {
  return (
    <Button
        variant='link'
        className='w-full font-normal'
        size='sm'
    >
      <Link  href={href} >{label}</Link>
    </Button>
  )
}

export default BackButton;
