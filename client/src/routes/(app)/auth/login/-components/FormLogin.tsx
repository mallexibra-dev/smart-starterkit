import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter your username or email"
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
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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