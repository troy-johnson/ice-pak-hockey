import { StyledMenu } from "./Menu.styled";

const Menu = ({ open, ...props }) => {
   const isHidden = open ? true : false;
   const tabIndex = isHidden ? 0 : -1;

   return (
      <StyledMenu open={open} aria-hidden={!isHidden} {...props}>
         <a href="/" tabIndex={tabIndex}>
            <span aria-hidden="true">💁🏻‍♂️</span>
            About us
         </a>
         <a href="/" tabIndex={tabIndex}>
            <span aria-hidden="true">💸</span>
            Pricing
         </a>
         <a href="/" tabIndex={tabIndex}>
            <span aria-hidden="true">📩</span>
            Contact
         </a>
      </StyledMenu>
   );
};
export default Menu;
