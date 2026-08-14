import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listSourcingRequests from "./tools/list-sourcing-requests";
import getSourcingRequest from "./tools/get-sourcing-request";
import createSourcingRequest from "./tools/create-sourcing-request";
import listOrders from "./tools/list-orders";
import sendRequestMessage from "./tools/send-request-message";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "final-version-website",
  title: "Final version website",
  version: "0.1.0",
  instructions:
    "Tools for the Equilinq sourcing platform. Use them to list and inspect the signed-in user's sourcing requests and quotes, create new sourcing requests, track orders, and message the sourcing agent.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listSourcingRequests, getSourcingRequest, createSourcingRequest, listOrders, sendRequestMessage],
});
