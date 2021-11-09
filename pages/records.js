import Link from "next/link";
import styled from "@emotion/styled";
import { useMediaQuery } from "@mui/material";
import { Loading, ControlledInput, ControlledSelect, PageContainer } from "../components";

const Records = () => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   return (
      <PageContainer small pageTitle="Records">
         Coming Soon
      </PageContainer>
   );
};

export default Records;
