import { Check, Search, FileText, CreditCard, Factory, Truck } from "lucide-react";

type Step = {
  label: string;
  icon: React.ElementType;
  description: string;
};

const steps: Step[] = [
  { label: "Request Submitted", icon: Search, description: "Our team is reviewing your request" },
  { label: "Quote Ready", icon: FileText, description: "Review and accept the quote" },
  { label: "Payment", icon: CreditCard, description: "Complete payment via bank transfer" },
  { label: "In Production", icon: Factory, description: "Your order is being manufactured" },
  { label: "Shipped", icon: Truck, description: "Your order is on its way" },
];

function getActiveStep(
  requestStatus: string,
  paymentStatus?: string,
  orderStatus?: string
): number {
  if (orderStatus === "in_transit" || orderStatus === "delivered") return 4;
  if (orderStatus === "processing" || orderStatus === "qc_review") return 3;
  if (paymentStatus === "confirmed") return 3;
  if (requestStatus === "confirmed") return 2; // awaiting payment
  if (requestStatus === "quoted") return 1;
  return 0; // pending / active
}

export function OrderProgressStepper({
  requestStatus,
  paymentStatus,
  orderStatus,
}: {
  requestStatus: string;
  paymentStatus?: string;
  orderStatus?: string;
}) {
  const activeStep = getActiveStep(requestStatus, paymentStatus, orderStatus);

  return (
    <div className="flex items-center w-full gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < activeStep;
        const isActive = i === activeStep;
        const StepIcon = step.icon;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center text-center min-w-0">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted border border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <p
                className={`text-[11px] mt-1.5 font-medium leading-tight max-w-[80px] ${
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
                className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${
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
