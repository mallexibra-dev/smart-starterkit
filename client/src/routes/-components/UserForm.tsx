import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormCard } from "@/components/blocks/FormCard";

// Schema untuk form user
const userSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  role: z.string().min(1, "Role harus dipilih"),
});

type UserFormData = z.infer<typeof userSchema>;

export const UserForm = () => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  const onSubmit = (data: UserFormData) => {
    console.log("Form data:", data);
    // Handle form submission
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <FormCard
      title="Tambah Pengguna Baru"
      description="Isi form di bawah ini untuk menambahkan pengguna baru ke sistem"
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={handleReset}
      submitText="Simpan"
      resetText="Reset"
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
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
                <Input type="email" placeholder="contoh@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Admin, User, Moderator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </FormCard>
  );
}; 