import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Mail, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpSupport() {
  const { data: faqItems = [], isLoading } = useQuery({
    queryKey: ["faq-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-heading font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Find answers or reach out to our team</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5 text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-xs text-muted-foreground mt-1">Chat with your sourcing agent</p>
              <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                <Link to="/messages">Open Messages</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5 text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-xs text-muted-foreground mt-1">Get help via email</p>
              <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Knowledge Base</h3>
              <p className="text-xs text-muted-foreground mt-1">Read our insights and guides</p>
              <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                <Link to="/insights">View Insights</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-heading font-semibold">Frequently Asked Questions</h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : faqItems.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No FAQ items available yet. Check back soon.
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-left text-sm font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
