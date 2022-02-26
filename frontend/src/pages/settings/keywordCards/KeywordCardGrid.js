import React from "react";
import { AppContext } from "../../../contexts/AppContext";
import { SelectableTile } from "../../components/Tile';

const KeywordTile = ({nowHitKeywordListData}) => {return 
    <AppContext.Consumer>{({nowHitKeywordListData}) => {

let keyword = nowHitKeywordListData.keyword


    }}</AppContext.Consumer>


}