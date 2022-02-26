import React from "react";
import styled from "styled-components";
import { AppContext } from "../../contexts/AppContext";
import { fontSize1, palevioletredBoxShadow } from "../../styles/Variants";
const ConfirmButtonStyled = styled.div`
  margin: 20px;
  color: white;
  cursor: pointer;
  background-color: #690033;
  padding: 10px 40px;
  border-radius: 0.5em;
  ${fontSize1}
  &:hover {
    ${palevioletredBoxShadow}
  }
`;
// #852049 text-shadow: #fc0 1px 0 10px;
export const CenterDiv = styled.div`
  display: grid;
  justify-content: center;
`;

const ConfirmButton = () => {
  return (
    <AppContext.Consumer>
      {({ handleConfirmFavorite }) => (
        <CenterDiv>
          <ConfirmButtonStyled onClick={handleConfirmFavorite}>
            confirm favorite
          </ConfirmButtonStyled>
        </CenterDiv>
      )}
    </AppContext.Consumer>
  );
};
export default ConfirmButton;

// const ConfirmButton = () => {
//   return (
//     <CenterDiv>
//       <AppContext.Context>
//         {({ handleConfirmFavorite }) => (
//           <ConfirmButtonStyled onClick={handleConfirmFavorite}>
//             confirm favorite
//           </ConfirmButtonStyled>
//         )}
//       </AppContext.Context>
//     </CenterDiv>
//   );
// };
// export default ConfirmButton;
