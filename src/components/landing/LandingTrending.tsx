import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingTrending() {
  return (
    <section className="py-20 sm:py-28 px-4 relative overflow-hidden" id="trending">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4"
          >
            <TrendingUp className="h-4 w-4" />
            Free Product Discovery
          </motion.span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Not sure what to sell?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            We scan TikTok Shop, Amazon, and major webshops every week to surface the
            top 10 trending products -- with a free in-depth breakdown for each one.
          </p>
          <div className="mt-8">
            <Link to="/trending">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Button 
                  size="lg"
                  className="rounded-full px-10 h-14 text-base font-semibold gap-3 bg-gradient-to-r from-primary to-[hsl(var(--chart-2))] hover:opacity-90 text-white shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.4)]"
                >
                  <Sparkles className="h-5 w-5" />
                  Discover Trending Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}