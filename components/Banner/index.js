import Link from "next/link";
import { StyledContainer } from "./Banner.styled";

const Banner = () => {
   return (
      <StyledContainer>
         <h1>
            <Link href={`/`}>Ice Pak Hockey </Link>
         </h1>
      </StyledContainer>
   );
};

export default Banner;
