import { Check, Search, FileText, CreditCard, Factory, Truck, Eye, Package } from "lucide-react";
import { motion } from "framer-motion";

type Step = {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
};

const steps: Step[] = [
  { key: "submitted", label: "Request Submitted", icon: Search, description: "Our team is reviewing your request" },
  { key: "quoted", label: "Quote Ready", icon: FileText, description: "Review and accept the quote" },
  { key: "payment", label: "Payment", icon: CreditCard, description: "Complete payment via bank transfer" },
  { key: "production", label: "In Production", icon: Factory, description: "Your order is being manufactured" },
  { key: "qc", label: "QC Review", icon: Eye, description: "Quality inspection in progress" },
  { key: "shipped", label: "Shipped", icon: Truck, description: "Your order is on its way" },
  { key: "delivered", label: "Delivered", icon: Package, description: "Order delivered successfully" },
];

function getActiveStep(
  requestStatus: string,
  paymentStatus?: string,
  orderStatus?: string
): number {
  if (orderStatus === "delivered") return 6;
  if (orderStatus === "in_transit") return 5;
  if (orderStatus === "qc_review") return 4;
  if (orderStatus === "processing" || paymentStatus === "confirmed") return 3;
  if (paymentStatus === "paid") return 2; // payment sent, awaiting confirmation
  if (requestStatus === "confirmed") return 2; // awaiting payment
  if (requestStatus === "quoted") return 1;
  return 0; // pending / active
}

export function OrderProgressStepper({
  requestStatus,
  paymentStatus,
  orderStatus,
  createdAt,
  variant = "horizontal",
}: {
  requestStatus: string;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: string;
  variant?: "horizontal" | "vertical";
}) {
  const activeStep = getActiveStep(requestStatus, paymentStatus, orderStatus);

  if (variant === "vertical") {
    return (
      <div className="space-y-0">
        {steps.map((step, i) => {
          const isCompleted = i < activeStep;
          const isActive = i === activeStep;
          const isFuture = i > activeStep;
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3"
            >
              {/* Vertical line + circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted border border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : <StepIcon className="h-3.5 w-3.5" />}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-[28px] transition-colors ${
                      i < activeStep ? "bg-emerald-500" : "bg-border"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`pb-5 ${isFuture ? "opacity-40" : ""}`}>
                <p
                  className={`text-sm font-medium leading-tight ${
                    isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Horizontal compact version
  return (
    <div className="flex items-center w-full gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < activeStep;
        const isActive = i === activeStep;
        const StepIcon = step.icon;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center text-center min-w-0">
              <div
                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted border border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <StepIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </div>
              <p
                className={`text-[10px] sm:text-[11px] mt-1.5 font-medium leading-tight max-w-[60px] sm:max-w-[80px] ${
                  isCompleted
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-0.5 sm:mx-1 rounded-full transition-colors ${
                  i < activeStep ? "bg-emerald-500" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
