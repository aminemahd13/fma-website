"use client"

import { z } from "zod"
import { cn } from "@/lib/utils"
import { LoadingDots } from "@/components/shared/icons"
import { Input, Button } from "@/components/shared"
import { useForm } from "react-hook-form"
import { resetPassword } from "@/api/AuthApi"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shared/form"
import { useState } from "react"
import { toast } from '@/components/hooks/use-toast';

const resetPasswordSchema = z.object({
  email: z.string().min(1, {message: 'An email is required'}).email({message: 'Invalid email address'}),
})

const defaultValues = {
  email: "",
}

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: defaultValues,
  })
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const onSubmit = async (formData: any) => {
    const { email } = formData;
    setIsFormLoading(true)
    const response = await resetPassword(email) as any;

    switch(response?.statusCode) {
      case 200:
        setIsFormLoading(false)
        setSuccessMessage(`An email was sent to your inbox.\n Please check your SPAM folder if it didn't reach your inbox`);
        break;
      case 400:
      case 401:
        setErrorMessage('The email is incorrect')
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
            
            <Button type="submit" disabled={isFormLoading}>
              {isFormLoading ? (
                <LoadingDots color="#808080" />
              ) : (
                <p>Réinitialiser</p>
              )}
            </Button>
            
            {errorMessage
              ? <p className="w-full text-red-600 text-sm">
                {errorMessage}
              </p>
              : null
            }
            {successMessage
              ? <p className="w-full text-green-700 text-sm font-medium">
                {successMessage}
              </p>
              : null
            }
          </div>
        </form>
      </Form>
    </div>
  )
}