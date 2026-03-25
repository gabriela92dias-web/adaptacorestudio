import React from "react";
import { UserRoute } from "../components/ProtectedRoute";

export default [
  ({ children }: { children: React.ReactNode }) => <UserRoute>{children}</UserRoute>
];
