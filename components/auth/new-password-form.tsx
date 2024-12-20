"use client"

import * as z from "zod";
import { Suspense, useState, useTransition } from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import CardWrapper from "./card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-suceess";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";

const NewPasswordForm = () => { 

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error , setError] = useState<string | undefined>("");
  const [success , setSuccess] = useState<string | undefined>("");
  const [isPending,startTransition] = useTransition();


  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver:zodResolver(NewPasswordSchema),
    defaultValues:{
      password:"",
    }
  })

  const onSubmit = (values :z.infer<typeof NewPasswordSchema>)=>{
    setError("")
    setSuccess("")
    
    startTransition(()=>{
        newPassword(values,token).then((data)=>{
          setError(data?.error)
          setSuccess(data?.success)
      });
    })
  }

  return (
    <Suspense fallback={<BeatLoader />}>

    <CardWrapper
    headerLabel='Enter a new password'
    backButtonLabel='Back to login'
    backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button 
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
    </Suspense>
  )
}

export default NewPasswordForm
