import React from 'react';
import AutoCompleteSearch from './AutoCompleteSearch';
import { render, screen, fireEvent } from '@testing-library/react';
describe('SearchBar component', () => { 
    it('should show input text', async () => {
      let searchText = '';
      const title = 'All SEPs';
      const setSearchText = (text) => {
        searchText = text;
      };
      render(
        <AutoCompleteSearch />
      );
      const field = screen.getByTestId('testInput');
      expect(field).toBeInTheDocument();
  
      fireEvent.change(field, { target: { value: 'bitcoyote' }});
      jest.useFakeTimers();
        setTimeout(() => {
            expect(field.value).toEqual('bitcoyote'); 
        }, 2500);
        jest.runAllTimers();
    });
  });