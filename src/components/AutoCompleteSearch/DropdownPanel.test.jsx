import React from 'react';
import DropDownPanel from './DropdownPanel';
import { render, screen } from '@testing-library/react';

const mockupData = [
    {
        "name": "BitCoyote-----[user]",
        "url": "https://github.com/BitCoyote",
        "avatar_url": "https://avatars.githubusercontent.com/u/112066114?v=4",
        "selected": false
    },
    {
        "name": "BitCoyote/BitCoyote.github.io-----[repository]",
        "url": "https://github.com/BitCoyote/BitCoyote.github.io",
        "avatar_url": "https://avatars.githubusercontent.com/u/112066114?v=4",
        "selected": false
    }
]

describe('Autocomplete search result should be', () => {
   
    it('shown in the screen.', () => {
        render(<DropDownPanel results={mockupData} loading={false} isSearch={true} error='' />)
        expect(screen.getByText('BitCoyote-----[user]')).toBeInTheDocument();
    })

    it('shown loading feedback.', () => {
        render(<DropDownPanel results={[]} loading={true} isSearch={true} error='' />)
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    })

    it('shown empty result feedback.', () => {
        render(<DropDownPanel results={[]} loading={false} isSearch={true} error='' />)
        expect(screen.getByText('There is no such data...')).toBeInTheDocument();
    })

    it('never shown anything when search is not executed.', () => {
        const { container } = render(<DropDownPanel results={[]} loading={false} isSearch={false} error='' />)
        expect(container).toBeEmptyDOMElement();
    })

    it('shown error feedback.', () => {
        render(<DropDownPanel results={[]} loading={false} isSearch={true} error='errorstring'/>)
        expect(screen.getByText('errorstring')).toBeInTheDocument();
    })
})