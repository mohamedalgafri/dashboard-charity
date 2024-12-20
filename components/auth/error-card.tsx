import React from 'react'
import CardWrapper from './card-wrapper'
import { TriangleAlert } from 'lucide-react'

const ErrorCard = () => {
  return (

    <CardWrapper

        headerLabel='Oops! Something went wrong!'
        backButtonHref='/auth/login'
        backButtonLabel='Back to login'
    >
        <div className='w-full flex justify-center items-center'>
            <TriangleAlert className='size-16 text-destructive' />
        </div>
    </CardWrapper>
  )
}

export default ErrorCard
