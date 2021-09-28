import styled from "@emotion/styled";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const StyledOpenNav = ({ className, onClick }) => {
   return (
      <Button className={className} onClick={onClick}>
         <MenuIcon />
      </Button>
   );
};

const StyledCloseNav = ({ className, onClick }) => {
   return (
      <Button className={className} onClick={onClick}>
         <CloseIcon />
      </Button>
   );
};

export const Container = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;

   h1 {
      flex-grow: 2;
      text-align: center;
   }
`;

export const NavMenuBox = styled(Box)`
   background-color: ${(props) => props.theme.palette.primary.main};
   height: 100%;
   width: ${(props) => (props.desktop ? 300 : "500px")};
`;

export const MenuItem = styled(ListItemText)`
   span {
      font-size: 48px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5rem;

      transition: color 0.2s ease-in-out;

      :hover {
         color: ${(props) => props.theme.palette.secondary.main};
      }
   }
`;

export const OpenNav = styled(StyledOpenNav)`
   svg {
      color: black;
      height: 24px;
      width: 24px;
   }
`;

export const CloseNav = styled(StyledCloseNav)`
   svg {
      font-size: 48px;
      color: white;

      :hover {
         color: ${(props) => props.theme.palette.secondary.main};
      }
   }
`;
