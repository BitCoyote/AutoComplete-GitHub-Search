import { useState, useEffect, useRef } from 'react';
import DropdownPanel from './DropdownPanel';
import styled from "styled-components";

const header = {
    'Authorization': `${process.env.REACT_APP_GITHUB_TOKEN}`,
    'connection': 'close',
    'Content-Type': 'application/json',
    'User-Agent': 'BitCoyote',
    'Accept': 'application/json'
}

const StyledInput = styled.input`
  display: block;
  width: 100%;
  height: -webkit-calc(2.75rem + 2px);
  height: -moz-calc(2.75rem + 2px);
  height: calc(2.75rem + 2px);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.25;
  color: #4e5154;
  background-color: #fff;
  border: 1px solid #adb5bd;
  border-left: none;
  border-right: none;
  border-top: none;
  outline: none;
  &:focus-within {
    border-color: #3e34d3 !important;
    border-color: rgba(var(--aa-primary-color-rgb), 1) !important;
    box-shadow: 0 0 0 2px rgba(62, 52, 211, 0.2),
      inset 0 0 0 2px rgba(62, 52, 211, 0.2) !important;
    box-shadow: rgba(var(--aa-primary-color-rgb), var(--aa-primary-color-alpha))
        0 0 0 2px,
      inset rgba(var(--aa-primary-color-rgb), var(--aa-primary-color-alpha)) 0 0
        0 2px ! imortant;
    outline: medium none #3e34d3 !important;
  }
`;

const AutoCompleteSearch = () => {
  const ref = useRef();
  const [searchText, setSearchText] = useState(localStorage.getItem('searchText') || '');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (changedText) => {
    setSearchText(changedText);
  }
  useEffect(() => {
    ref.current.focus();
    const timeOutId = setTimeout(() => {
        if(searchText.length >= 3 && localStorage.getItem('searchText') !== searchText){
            localStorage.setItem('searchText', searchText);
            window.location.reload(false);
        } else if (searchText.length < 3) {
          localStorage.setItem('searchText', searchText);
          if(searchText === "") setResult([]);
        }
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [searchText]);

  useEffect(() => {
    const handleSearch = () => {
        if(localStorage.getItem('searchText') === null || localStorage.getItem('searchText') === '')
          return;
        let data = [];
        setLoading(true)
        Promise.all([
          fetch(
            `https://api.github.com/search/repositories?q=${localStorage.getItem('searchText')}&page=1&per_page=50&order=asc`, {headers: header}
          ),
          fetch(
            `https://api.github.com/search/users?q=${localStorage.getItem('searchText')}&page=1&per_page=50&orders=asc`, {headers: header}
          ),
        ])
        .then((responses) => {  
            responses.forEach((res) => {
                if(res.status === 404) {
                    throw new Error('Error! Request failed.')
                }
                res.json().then(body => {
                    data.push(...body.items.map(item => ({
                        name: item.full_name === undefined ? `${item.login}-----[user]` : `${item.full_name}-----[repository]`,
                        url: item.html_url,
                        avatar_url: item.avatar_url === undefined ? item.owner.avatar_url : item.avatar_url,
                        selected: false,
                    })));
                    let temp = data.sort((a, b) => {
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                  }).slice(0,50);
                    setResult(temp)
                })
                
            })
        })
        .catch((err) => {setError(err.toString())})
        .finally(() => {setLoading(false)});
      };
      handleSearch();
    },[])
    return (
        <div>
        <StyledInput 
          ref={ref} 
          data-testid="testInput" 
          onChange={(e) => handleChange(e.target.value)} 
          value={searchText}
          placeholder="Search GitHub Users and Repositories"
        />
        <DropdownPanel 
            loading={loading} 
            results={result}
            isSearch={searchText !== ""}
            error={error}
        />
        </div>
    )
}

export default AutoCompleteSearch;