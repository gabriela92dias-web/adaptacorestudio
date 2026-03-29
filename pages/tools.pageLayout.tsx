import React from "react";
import { UserRoute } from "../components/ProtectedRoute";
import { AppLayout } from "../components/AppLayout";

export default [
  ({ children }: { children: React.ReactNode }) => <UserRoute><AppLayout>{children}</AppLayout></UserRoute>
];
