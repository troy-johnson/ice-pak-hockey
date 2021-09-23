import Link from "next/link";
import { StyledMenu } from "./Menu.styled";

const Menu = ({ open, setOpen }) => {
   const isHidden = open ? true : false;
   const tabIndex = isHidden ? 0 : -1;

   return (
      <StyledMenu open={open} aria-hidden={!isHidden}>
         <span onClick={() => setOpen(false)}>
            <Link href="/" tabIndex={tabIndex}>
               Home
            </Link>
         </span>

         <span onClick={() => setOpen(false)}>
            <Link href="/team" tabIndex={tabIndex}>
               Team
            </Link>
         </span>

         <span onClick={() => setOpen(false)}>
            <Link href="/schedule" tabIndex={tabIndex}>
               Schedule
            </Link>
         </span>

         <span onClick={() => setOpen(false)}>
            <Link href="/stats" tabIndex={tabIndex}>
               Stats
            </Link>
         </span>

         <span onClick={() => setOpen(false)}>
            <Link href="/news" tabIndex={tabIndex}>
               News
            </Link>
         </span>

         <span onClick={() => setOpen(false)}>
            <Link href="/standings" tabIndex={tabIndex}>
               Standings
            </Link>
         </span>

         <span onClick={() => setOpen(false)}>
            <Link href="/shop" tabIndex={tabIndex}>
               Shop
            </Link>
         </span>
      </StyledMenu>
   );
};
export default Menu;
