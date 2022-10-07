import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { PillsApp } from "./01-pills/PillsApp";

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="pills" element={<PillsApp />} />)
);

export const Router = () => {
  return <RouterProvider router={router} />;
};
