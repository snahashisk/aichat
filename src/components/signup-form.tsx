'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const router = useRouter()
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  })

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true)
      const payload = {
        username: user.username,
        email: user.email,
        password: user.password
      }
      const response = await axios.post('/api/users/signup', payload)
      toast.success("Verify Your Email")
      const userId = response.data.savedUser._id;
      router.push(`/verifyemail/${userId}`)


    } catch (error: any) {
      console.log("Sign up failed", error.message);
      toast.error("Signup Failed")
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length >= 8 && user.username.length >= 4 && user.password === user.confirmPassword) {
      setButtonDisabled(false);
    }else {
      setButtonDisabled(true);
    }
  }, [user])

  return (
    <form onSubmit={onSignup} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="name" value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} type="text" placeholder="jhondoe" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} placeholder="examplem@example.com" required />
          <FieldDescription>
            We&apos;ll use this to contact you.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" value={user.confirmPassword} onChange={(e) => setUser({...user, confirmPassword: e.target.value})} type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">{loading ? <Spinner /> : "Create Account"}</Button>
        </Field>
        <FieldDescription className="text-center">
            Already have an account? <a href="/login">Sign in</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
