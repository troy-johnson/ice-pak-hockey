import styled from "@emotion/styled";

export const StyledMain = styled.main`
left: 1.5rem;

@media (max-width: ${({ theme }) => theme.mobile}) {
   margin: 1rem 0.25rem;
}
`;