"use client"

import { z } from "zod"
import { cn } from "@/lib/utils"
import { LoadingDots } from "@/components/shared/icons"
import { Input, Button } from "@/components/shared"
import { useForm } from "react-hook-form"
import { logIn } from "@/api/AuthApi"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shared/form"
import { useState } from "react"
import { signInDefaultValues, signInSchema } from "@/lib/schemas/signin.schema"

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: SignInFormProps) {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: signInDefaultValues,
  })
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  const onSubmit = async (formData: any) => {
    const { email, password } = formData;
    setIsFormLoading(true)
    const response = await logIn(email, password) as any;

    switch(response?.statusCode) {
      case 200:
        localStorage.setItem('access_token', response?.access_token);
        router.push('/')
        window.location.reload()
        break;
      case 400:
      case 401:
      case 404:
        setErrorMessage('The email or password are incorrect')
        setIsFormLoading(false)
        break
      default:
        setErrorMessage('Server error. Please try later.')
        setIsFormLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Email Sign In */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2 space-y-2 text-left">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isFormLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Mot de passe"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isFormLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isFormLoading}>
              {isFormLoading ? (
                <LoadingDots color="#808080" />
              ) : (
                <p>Se connecter</p>
              )}
            </Button>
            
            {errorMessage
              ? <p className="w-full text-red-600 text-sm">
                {errorMessage}
              </p>
              : null
            }
          </div>
        </form>
      </Form>
    </div>
  )
}