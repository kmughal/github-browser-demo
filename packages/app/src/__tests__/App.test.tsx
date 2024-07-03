import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { useGithubRepoStore, useVisibilityStore } from '../stores';

jest.mock('../stores', () => ({
    useGithubRepoStore: jest.fn(),
    useVisibilityStore: jest.fn(),
}));

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGithubRepoStore.mockReturnValue({
            data: [],
            fetch: jest.fn(),
            nextPage: jest.fn(),
            prevPage: jest.fn(),
            currentPage: 1,
            totalItems: 0,
            updateVisibility: jest.fn(),
        });

        useVisibilityStore.mockReturnValue({
            toggleVisibility: jest.fn(),
        });
    });

    it('should render App component with header', () => {
        render(<App />);
        const headerElement = screen.getByText('browse Github');
        expect(headerElement).toBeInTheDocument();
    });

    it('should render ActionButtons component', () => {
        render(<App />);
        const prevButton = screen.getByText('Previous');
        const nextButton = screen.getByText('Next');
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
    });

    it('should render RepoCard components based on mock data', () => {
        useGithubRepoStore.mockReturnValue({
            data: [
                { id: 1, name: 'repo1', description: 'description1', visibility: true, avatarUrl: 'http://avatar1.url' },
                { id: 2, name: 'repo2', description: 'description2', visibility: false, avatarUrl: 'http://avatar2.url' },
            ],
            fetch: jest.fn(),
            nextPage: jest.fn(),
            prevPage: jest.fn(),
            currentPage: 1,
            totalItems: 20,
            updateVisibility: jest.fn(),
        });

        useVisibilityStore.mockReturnValue({
            toggleVisibility: jest.fn(),
        });

        render(<App />);


        const repoCards = screen.getAllByTestId('repo-card-1');
        expect(repoCards.length).toBe(1);
    });

    it('should toggle visibility on RepoCard click', () => {
        const mockToggleVisibility = jest.fn();
        const mockUpdateVisibility = jest.fn();

        useGithubRepoStore.mockReturnValue({
            data: [
                { id: 1, name: 'repo1', description: 'description1', visibility: true, avatarUrl: 'http://avatar1.url' },
                { id: 2, name: 'repo2', description: 'description2', visibility: false, avatarUrl: 'http://avatar2.url' },
            ],
            fetch: jest.fn(),
            nextPage: jest.fn(),
            prevPage: jest.fn(),
            currentPage: 1,
            totalItems: 20,
            updateVisibility: mockUpdateVisibility,
        });

        useVisibilityStore.mockReturnValue({
            toggleVisibility: mockToggleVisibility,
        });

        render(<App />);
        const repoCard = screen.getAllByTestId('repo-card-1').at(0);
        fireEvent.click(repoCard);
        expect(mockToggleVisibility).toHaveBeenCalledWith(1);
        expect(mockUpdateVisibility).toHaveBeenCalledWith(1);
    });
});
