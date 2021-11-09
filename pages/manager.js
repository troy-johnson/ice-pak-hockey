import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/client";
import { useMediaQuery } from "@mui/material";
import { Loading, ControlledInput, ControlledSelect, PageContainer } from "../components";
import { roleCheck } from "../utils";

const Manager = () => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const [session, loading] = useSession();

   return <PageContainer small pageTitle="Manager"></PageContainer>;
};

export default Manager;
