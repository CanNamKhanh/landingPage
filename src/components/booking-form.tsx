"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { submitContactForm } from "@/services/contactService";

const schema = z.object({
  name: z.string().min(1, { message: "Name can not be blank!" }),
  email: z
    .string()
    .min(1, { message: "Email can not be blank!" })
    .email({ message: "Email format is invalid!" }),
  subject: z.string().min(1, { message: "Please enter a subject!" }),
  message: z.string().min(1, { message: "Please let me know your request!" }),
});

export type FormData = z.infer<typeof schema>;

export function BookingForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await submitContactForm(data);
      if (res.success) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        toast.error(res.error ?? "Something went wrong. Please try again!");
      }
    } catch {
      toast.error("Failed to send message. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ts-book-form reveal select-none py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-4xl font-bold mb-4">
            <span className="text-white">STILL HAVE </span>
            <span className="text-[#B642F0] text-shadow-[0_0_40px_rgba(182,66,240,0.8)]">
              QUESTIONS?
            </span>
          </h2>
          <p className="text-[16px] text-muted-foreground">
            Send us a message and our team will get back to you as soon as
            possible.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-white/10 rounded-xl p-8 bg-[#151728] shadow-[0_4px_20px_rgba(184,66,240,0.15)]"
        >
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Name <span className="text-[#B842F0]">*</span>
              </label>
              <Input
                {...register("name")}
                type="text"
                placeholder="Your name"
                className="bg-[#0F0F17] border-white/10 text-foreground placeholder:text-muted-foreground focus:border-[#B842F0] focus:ring-[#B842F0]"
              />
              {errors?.name?.message && (
                <span className="text-red-500 text-[12px]">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">
                Email <span className="text-[#B842F0]">*</span>
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="bg-[#0F0F17] border-white/10 text-foreground placeholder:text-muted-foreground focus:border-[#B842F0] focus:ring-[#B842F0]"
              />
              {errors?.email?.message && (
                <span className="text-red-500 text-[12px]">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              Subject <span className="text-[#B842F0]">*</span>
            </label>
            <Input
              {...register("subject")}
              type="text"
              placeholder="What is your question about?"
              className="bg-[#0F0F17] border-white/10 text-foreground placeholder:text-muted-foreground focus:border-[#B842F0] focus:ring-[#B842F0]"
            />
            {errors?.subject?.message && (
              <span className="text-red-500 text-[12px]">
                {errors.subject.message}
              </span>
            )}
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Message <span className="text-[#B842F0]">*</span>
            </label>
            <textarea
              {...register("message")}
              placeholder="Type your question here..."
              rows={5}
              className="w-full bg-[#0F0F17] border border-white/10 rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:border-[#B842F0] focus:ring-2 focus:ring-[#B842F0]/20 focus:outline-none resize-none"
            />
            {errors?.message?.message && (
              <span className="text-red-500 text-[12px]">
                {errors.message.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            disabled={!isValid || loading}
            type="submit"
            className="w-full text-white font-bold py-7 text-md rounded-full transition-all duration-300 cursor-pointer border-none"
            style={{
              background:
                "linear-gradient(90deg, #e05cd5 0%, #f0608a 50%, #f8855a 100%)",
              boxShadow: "0 4px 20px rgba(224,92,213,0.3)",
            }}
            onMouseEnter={(e) => {
              if ((e.currentTarget as HTMLButtonElement).disabled) return;
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 28px rgba(224,92,213,0.5)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(224,92,213,0.3)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            {loading ? <Spinner /> : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
