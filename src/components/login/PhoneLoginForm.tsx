import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

// Define phone validation schema
const formSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

type FormValues = z.infer<typeof formSchema>;

interface PhoneLoginFormProps {
  handlePhoneLogin: (values: FormValues) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const PhoneLoginForm = ({
  handlePhoneLogin,
  error,
  loading,
}: PhoneLoginFormProps) => {
  // Initialize react-hook-form with zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    await handlePhoneLogin(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  id="phone"
                  placeholder="1234567890"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your 10-digit phone number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </Form>
  );
};

export default PhoneLoginForm;
