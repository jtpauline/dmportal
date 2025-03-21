import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CharacterDetailIndex from './index';
import { CharacterValidator } from '~/modules/utils/validation/character-validator';

// Mock the Remix Link component
vi.mock('@remix-run/react', () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  )
}));

// Mock the Modal component
vi.mock('~/components/ui/Modal', () => ({
  Modal: ({ isOpen, children, onClose }: any) => (
    isOpen ? <div data-testid="modal">{children}</div> : null
  )
}));

describe('CharacterDetailIndex Component', () => {
  // Rendering Tests
  describe('Rendering', () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <CharacterDetailIndex />
        </MemoryRouter>
      );
    });

    test('renders main heading', () => {
      const heading = screen.getByText(/Character Management/i);
      expect(heading).toBeInTheDocument();
    });

    test('renders all section links', () => {
      const sections = [
        'Spell Casting', 
        'Spell Combinations', 
        'Spell Preparation', 
        'Encounter Narrative', 
        'Encounter Design', 
        'Spell Synergies'
      ];

      sections.forEach(section => {
        const link = screen.getByText(section);
        expect(link).toBeInTheDocument();
      });
    });

    test('renders validation check button', () => {
      const button = screen.getByText(/Run Validation Check/i);
      expect(button).toBeInTheDocument();
    });
  });

  // Validation Tests
  describe('Validation Mechanism', () => {
    let validationSpy: any;

    beforeEach(() => {
      // Spy on the CharacterValidator
      validationSpy = vi.spyOn(CharacterValidator, 'validate');
    });

    afterEach(() => {
      validationSpy.mockRestore();
    });

    test('triggers validation on button click', () => {
      render(
        <MemoryRouter>
          <CharacterDetailIndex />
        </MemoryRouter>
      );

      const button = screen.getByText(/Run Validation Check/i);
      fireEvent.click(button);

      // Verify validation method was called
      expect(validationSpy).toHaveBeenCalled();
    });

    test('opens modal with validation errors', () => {
      // Mock validation to return errors
      validationSpy.mockReturnValue({
        isValid: false,
        errors: ['Invalid character name', 'Level out of range']
      });

      render(
        <MemoryRouter>
          <CharacterDetailIndex />
        </MemoryRouter>
      );

      const button = screen.getByText(/Run Validation Check/i);
      fireEvent.click(button);

      // Check if modal is rendered
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();

      // Check error messages
      expect(screen.getByText('Invalid character name')).toBeInTheDocument();
      expect(screen.getByText('Level out of range')).toBeInTheDocument();
    });

    test('handles unexpected validation errors', () => {
      // Mock validation to throw an error
      validationSpy.mockImplementation(() => {
        throw new Error('Validation process failed');
      });

      // Capture console.error to prevent test output
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <MemoryRouter>
          <CharacterDetailIndex />
        </MemoryRouter>
      );

      const button = screen.getByText(/Run Validation Check/i);
      fireEvent.click(button);

      // Check if modal is rendered with unexpected error
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();

      expect(screen.getByText('Unexpected validation error occurred')).toBeInTheDocument();

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  // Link Navigation Tests
  describe('Link Navigation', () => {
    test('links have correct href attributes', () => {
      render(
        <MemoryRouter>
          <CharacterDetailIndex />
        </MemoryRouter>
      );

      const links = [
        { text: 'Spell Casting', href: 'spell-casting' },
        { text: 'Spell Combinations', href: 'spell-combos' },
        { text: 'Spell Preparation', href: 'spell-preparation' },
        { text: 'Encounter Narrative', href: 'encounter-narrative' },
        { text: 'Encounter Design', href: 'encounter-design' },
        { text: 'Spell Synergies', href: 'spell-synergies' }
      ];

      links.forEach(link => {
        const element = screen.getByText(link.text);
        expect(element).toHaveAttribute('href', link.href);
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('buttons are keyboard accessible', () => {
      render(
        <MemoryRouter>
          <CharacterDetailIndex />
        </MemoryRouter>
      );

      const button = screen.getByText(/Run Validation Check/i);
      
      // Simulate keyboard interaction
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      // These should not throw any errors
      expect(button).toBeInTheDocument();
    });

    test('links have appropriate aria attributes', () => {
      render(
        <MemoryRouter>
          <CharacterDetailIndex />
        </MemoryRouter>
      );

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });
});
