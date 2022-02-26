import styled from "styled-components";
import { redBoxShadow } from "../../styles/Variants";

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

export const DeletableTile = styled(
  Tile
)`&:hover{cursor: pointer; ${redBoxShadow}}
}`;

export const DisableTile = styled(Tile)`pointer-events: none;
opacity: 0.4;
}`;
