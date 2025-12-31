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
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Sign up with GitHub
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
