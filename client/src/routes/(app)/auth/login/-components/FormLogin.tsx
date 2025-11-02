import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { login } from "../../../../../services/auth.service"
import { loginSchema, type LoginInput } from "shared/src/validation/auth.validation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"

type Props = {
    onSuccess?: () => void
}

export const FormLogin = ({ onSuccess }: Props) => {
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { identifier: "", password: "" }
    })
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            onSuccess?.()
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err?.message || "Login failed"
            setServerError(msg)
        }
    })

    async function onSubmit(values: LoginInput) {
        setServerError(null)
        mutation.mutate(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username or Email</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Enter your username or email"
                                    className="w-full rounded-md border px-3 py-2 outline-none"
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full rounded-md border px-3 py-2 pr-10 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {serverError ? (
                    <p className="text-sm text-destructive">{serverError}</p>
                ) : null}

                <div className="flex justify-end">
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}