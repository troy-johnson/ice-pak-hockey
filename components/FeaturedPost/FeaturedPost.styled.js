import styled from "styled-components";

export const Container = styled.article`
   border: 2px solid #ececec;
   border-radius: 8px;
   margin-left: 10px;
   margin-right: 10px;
   padding-left: 5px;
   padding-right: 5px;
   display: flex;
   flex-direction: column;
   width: 75%;

   @media (max-width: ${({ theme }) => theme.mobile}) {
      width: 100%;
   }
`;

export const Title = styled.h2`
   font-size: 24px;
   margin-bottom: 2px;
   color: ${props => props.theme.black}
`;

export const PostDate = styled.h3`
   margin-top: 0px;
   font-weight: 300;
   color: ${props => props.theme.mediumGrey}
`;