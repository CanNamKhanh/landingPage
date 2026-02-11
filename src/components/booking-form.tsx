"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooking } from "@/middlewares/bookingMiddleware";
import type { AppDispatch, RootState } from "@/stores/store";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, { message: "Name can not be blank!" }),
  email: z
    .string()
    .min(1, { message: "Email can not be blank!" })
    .email({ message: "Email format is invalid!" }),
  contactMethod: z.string().nonempty("Please choose your contact method!"),
  contactInfo: z.string().min(1, {
    message:
      "Discord: username#0000 | Telegram/IG: @username or Link | WhatsApp: Phone number. IMPORTANT: Check your privacy settings to allow messages from strangers!",
  }),
  game: z.string().nonempty("Please choose your game!"),
  paymentMethod: z.string().nonempty("Please choose your payment method!"),
  boostingRequirements: z
    .string()
    .min(1, { message: "Please let me know your request!" }),
});

export type FormData = z.infer<typeof schema>;

export function BookingForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const bookingState = useSelector((state: RootState) => state.booking);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(fetchBooking(data)).unwrap();
      setTimeout(() => {
        setOpen(true);
      }, 1500);
      toast.success("Booking success!");
    } catch (error) {
      console.error("Booking failed", error);
      toast.error("Booking failed. Please try again later!");
    }
  };

  return (
    <section className="ts-book-form reveal select-none py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-4xl font-bold mb-4">
            <span className="text-white">BOOK YOUR </span>
            <span className="text-accent text-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              BOOST
            </span>
          </h2>
          <p className="text-[16px] text-muted-foreground">
            Fill in the form below and we'll get back to you within 24 hours
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-2 border-accent/50 rounded-lg p-8 backdrop-blur-sm bg-card/30 shadow-[0_0_20px_rgba(236,72,153,0.8)]"
        >
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Name <span className="text-accent">*</span>
              </label>
              <Input
                {...register("name")}
                type="text"
                placeholder="Your name"
                required
                className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              />
              {errors?.name?.message && (
                <span className="text-red-500 text-[12px]">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">
                Email <span className="text-accent">*</span>
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                required
                className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              />
              {errors?.email?.message && (
                <span className="text-red-500 text-[12px]">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Contact Method & Contact Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Contact Method <span className="text-accent">*</span>
              </label>
              <Controller
                name="contactMethod"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-card border-border/50 w-full">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.contactMethod && (
                <span className="text-red-500 text-[12px]">
                  {errors.contactMethod.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">
                Contact Info <span className="text-accent">*</span>
              </label>
              <Input
                {...register("contactInfo")}
                type="text"
                placeholder="Your Discord ID, Telegram username"
                required
                className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              />
              {errors?.contactInfo?.message && (
                <span className="text-red-500 text-[12px]">
                  {errors.contactInfo.message}
                </span>
              )}
            </div>
          </div>

          {/* Game & Payment Method Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Game <span className="text-accent">*</span>
              </label>
              <Controller
                name="game"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-card border-border/50 w-full">
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valorant">Valorant</SelectItem>
                      <SelectItem value="arena-breakout">
                        Arena Breakout: Infinite
                      </SelectItem>
                      <SelectItem value="tft">Teamfight Tactics</SelectItem>
                      <SelectItem value="lol">League of Legends</SelectItem>
                      <SelectItem value="cs2">Counter-Strike 2</SelectItem>
                      <SelectItem value="delta-force">Delta Force</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.game && (
                <span className="text-red-500 text-[12px]">
                  {errors.game.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">
                Payment Method <span className="text-accent">*</span>
              </label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-card border-border/50 w-full">
                      <SelectValue placeholder="Select payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">
                        Crypto (USDT/BTC/ETH)
                      </SelectItem>
                      <SelectItem value="wise">Wise</SelectItem>
                      <SelectItem value="payoneer">Payoneer</SelectItem>
                      <SelectItem value="bank-transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.paymentMethod && (
                <span className="text-red-500 text-[12px]">
                  {errors.paymentMethod.message}
                </span>
              )}
            </div>
          </div>

          {/* Boosting Requirements */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Boosting Requirements <span className="text-accent">*</span>
            </label>
            <textarea
              {...register("boostingRequirements")}
              placeholder="Describe what you need (e.g., 'Boost from Silver 2 to Diamond 1', 'Win 10 ranked games', etc.)"
              required
              rows={5}
              className="w-full bg-card border border-border/50 rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none"
            />
            {errors?.boostingRequirements?.message && (
              <span className="text-red-500 text-[12px]">
                {errors.boostingRequirements.message}
              </span>
            )}
          </div>

          {/* Submit Button */}

          <Button
            disabled={!isValid}
            type="submit"
            className="w-full bg-accent cursor-pointer text-white font-bold py-8 text-lg rounded-lg"
          >
            {bookingState?.loading ? <Spinner /> : "SUBMIT ORDER"}
          </Button>

          {/* Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-120 [&>button]:hidden max-w-2xl border-pink-500/30 bg-linear-to-b from-slate-900 to-slate-950 sm:rounded-lg">
              <DialogHeader className="space-y-3 text-center">
                <DialogTitle className="text-3xl font-bold text-white">
                  Thank you for choosing us!
                </DialogTitle>
                <div className="h-1 w-24 bg-linear-to-r from-pink-500 to-pink-600 mx-auto rounded-full" />
                <DialogDescription className="text-base text-slate-300 leading-relaxed pt-2">
                  Please join our discord server to proceed with the boost:
                </DialogDescription>
              </DialogHeader>

              <div className="my-6 p-4 bg-slate-800/50 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                <a
                  href="https://discord.gg/JjVzxkVEmE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 text-pink-400 hover:text-pink-300 transition-colors font-medium"
                >
                  <span className="break-all">
                    https://discord.gg/JjVzxkVEmE
                  </span>
                  <ExternalLink className="w-5 h-5 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <DialogClose className="border-2 cursor-pointer text-white hover:bg-accent/10 font-semibold px-4 py-3 text-lg rounded-xl bg-transparent hover:border-pink-500">
                  Close
                </DialogClose>
                <Button
                  onClick={() =>
                    window.open("https://discord.gg/JjVzxkVEmE", "_blank")
                  }
                  className="bg-accent cursor-pointer text-white hover:bg-pink-500 font-semibold px-4 py-7 text-lg rounded-xl shadow-sm shadow-pink-500/50 transition-all hover:shadow-[0_0_30px_8px_rgba(236,72,153,0.7)]"
                >
                  Join Discord Server
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Disclaimer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By submitting, you agree to our terms of service. We'll contact you
            to discuss pricing and details.
          </p>
        </form>
      </div>
    </section>
  );
}
