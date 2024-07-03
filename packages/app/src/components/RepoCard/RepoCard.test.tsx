import { render, screen } from '@testing-library/react';
import React from 'react';
import renderer from 'react-test-renderer';
import { RepoCard } from './RepoCard';

describe('RepoCard Tests', () => {
    const mockRepoData = {
        id: 1,
        name: 'test',
        description: 'test description',
        visibility: true,
        avatarUrl: 'http://some.url'
    };

    const setup = () => render(
        <RepoCard
            addVisibilityHandler={jest.fn()}
            data={mockRepoData}
        />
    );

    it('should render RepoCard component', () => {
        const tree = renderer
            .create(<RepoCard
                addVisibilityHandler={jest.fn()}
                data={mockRepoData}
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should display avatar image', () => {
        setup();
        const avatarImage = screen.getByAltText('avatar');
        expect(avatarImage).toBeInTheDocument();
        expect(avatarImage).toHaveAttribute('src', mockRepoData.avatarUrl);
    });

    it('should display repo name', () => {
        setup();
        const repoNameElement = screen.getByText(mockRepoData.name);
        expect(repoNameElement).toBeInTheDocument();
    });

    it('should display repo description', () => {
        setup();
        const repoDescriptionElement = screen.getByText(mockRepoData.description);
        expect(repoDescriptionElement).toBeInTheDocument();
    });

    it('should display visibility toggle button', () => {
        setup();
        const visibilityButton = screen.getByText(mockRepoData.visibility ? '-' : '+');
        expect(visibilityButton).toBeInTheDocument();
    });
});
