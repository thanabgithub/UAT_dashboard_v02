import styled from "styled-components";
import {
  brightGlowBoxShadow,
  lightGreyBackground,
} from "../../styles/Variants";

export const Tile = styled.div`
  ${lightGreyBackground};
  padding: 10px;
  border-radius: 0.25em;
`;

export const SelectableTile = styled(
  Tile
)`&:hover{cursor: pointer; ${brightGlowBoxShadow}}
}`;
