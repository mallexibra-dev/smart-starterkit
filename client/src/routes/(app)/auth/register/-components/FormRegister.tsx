import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "@tanstack/react-router"
import { registerSchema, type RegisterInput } from "shared/src/validation/auth.validation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRegister } from "@/hooks/useAuth"
import { Eye, EyeOff } from "lucide-react"

type Props = {
    onSuccess?: () => void
}

export const FormRegister = ({ onSuccess }: Props) => {
    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" }
    })
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const mutation = useRegister()

    async function onSubmit(values: RegisterInput) {
        setServerError(null)
        mutation.mutate(values, {
            onSuccess: () => {
                onSuccess?.()
            },
            onError: (error: unknown) => {
                setServerError((error as Error).message)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full rounded-md border px-3 py-2 outline-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email"
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
                                        placeholder="Enter your password (min. 8 characters)"
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
                        {mutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    )
}