
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButtons } from './ActionButtons';
import renderer from 'react-test-renderer';

describe('ActionButtons Tests', () => {
  const mockNextPage = jest.fn();
  const mockPrevPage = jest.fn();

  beforeEach(() => {
    mockNextPage.mockClear();
    mockPrevPage.mockClear();
  });

  it('should render RepoCard component', () => {
    const tree = renderer
        .create(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={1} totalItems={50} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

  it("should render ActionButtons component", () => {
    render(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={1} totalItems={50} />);
    expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it("should render two buttons", () => {
    render(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={1} totalItems={50} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it("should DISABLE previous button WHEN it is first page", () => {
    render(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={0} totalItems={50} />);
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it("should ENABLE next button WHEN it is not the last page", () => {
    render(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={3} totalItems={50} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeEnabled();
  });

  it("should ENABLE previous button WHEN it is not the first page", () => {
    render(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={1} totalItems={50} />);
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeEnabled();
  });

  it("should call nextPage function when next button is clicked", () => {
    render(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={1} totalItems={50} />);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(mockNextPage).toHaveBeenCalledTimes(1);
  });

  it("should call prevPage function when previous button is clicked", () => {
    render(<ActionButtons nextPage={mockNextPage} prevPage={mockPrevPage} currentPage={1} totalItems={50} />);
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);
    expect(mockPrevPage).toHaveBeenCalledTimes(1);
  });
});
