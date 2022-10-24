import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

export const StyledLi = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding: 10px;
  &:hover {
    border: 1px solid black;
  }
  & > div {
    display: flex;
    align-items: center;
    align-content: center;
  }
`;

export const StyledUl = styled.ul`
  display: block;
`;

const StyledButton = styled.a`
  text-decoration: none;
  background-color: #36729B;
  padding : 10px;
  color: white;
`;
const DropDownPanel = (data) => {
  console.log(data)
  const ref = useRef(null);
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setList(data.results);
  }, [data.results]);

  useEffect(() => {
    const onKeyDown = ({ key }) => {
      if (list.length === 0) return;
      let tempList = list.map((e) => ({ ...e, selected: false }));
      if (key === "ArrowUp") {
        setIndex(index === 0 ? 0 : index - 1);
      } else if (key === "ArrowDown") {
        setIndex(index === list.length - 1 ? index : index + 1);
      } else if (key === "Enter") {
        window.open(list[index].url, "_blank");
        return;
      } else {
        return;
      }
      ref.current.children[index].scrollIntoView({ block: "center" });
      tempList[index].selected = true;
      setList(tempList);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [index, list]);
  if (data.loading) {
    return (
      <StyledUl ref={ref}>
        <StyledLi>Loading...</StyledLi>
      </StyledUl>
    );
  } else if (data.isSearch && list.length === 0 && data.error === '') {
    return (
      <StyledUl ref={ref}>
        <StyledLi>There is no such data...</StyledLi>
      </StyledUl>
    );
  } else if (list.length > 0) {
    return (
      <StyledUl ref={ref}>
        {list.map((e, i) => (
          <StyledLi
            key={i}
            style={
              e.selected ? { backgroundColor: "rgba(255, 0, 0, 0.2)" } : {}
            }
          >
            <div>
              <img src={e.avatar_url} alt="noimage" width="40" height="40" />
              &nbsp;&nbsp;
              <span>{e.name}</span> &nbsp;&nbsp;
            </div>
            <StyledButton
              href={e.url}
              target="_blank"
              type="button"
            >
              goto
            </StyledButton>
          </StyledLi>
        ))}
      </StyledUl>
    );
  } else if(!data.isSearch && list.length === 0 && data.error === '') {
    // If search is not executed.
    return(
      <></>
    );
  } else {
    return (
    <StyledUl ref={ref}>
      <StyledLi data-testid="ErrorBar">{data.error}</StyledLi>
    </StyledUl>
    );
  }
};

export default DropDownPanel;
