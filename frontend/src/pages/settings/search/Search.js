import React from "react";
import styled from "styled-components";

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  height: 5em;
  align-items: center;
`;

const SearchInput = styled.div`
  display: d-flex;

  background-color: white;
  height: 2.5em;
`;

const Search = () => {
  return (
    <SearchGrid>
      <h2>Search</h2>
      <SearchInput />
    </SearchGrid>
  );
};

export default Search;
