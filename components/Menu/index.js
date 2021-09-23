import Link from "next/link";
import { StyledMenu } from "./Menu.styled";

const Menu = ({ open, ...props }) => {
   const isHidden = open ? true : false;
   const tabIndex = isHidden ? 0 : -1;

   return (
      <StyledMenu open={open} aria-hidden={!isHidden} {...props}>
         <Link href="/team" tabIndex={tabIndex}>
            Team
         </Link>
         <Link href="/schedule" tabIndex={tabIndex}>
            Schedule
         </Link>
         <Link href="/stats" tabIndex={tabIndex}>
            Stats
         </Link>
         <Link href="/news" tabIndex={tabIndex}>
            News
         </Link>
         <Link href="/standings" tabIndex={tabIndex}>
            Standings
         </Link>
         <Link href="/shop" tabIndex={tabIndex}>
            Shop
         </Link>
      </StyledMenu>
   );
};
export default Menu;
