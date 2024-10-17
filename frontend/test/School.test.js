import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SchoolManagementPage from '../app/school/page';
import { act } from 'react-dom/test-utils';
// test/utils/render.js
import { render as rtlRender } from '@testing-library/react';

function render(ui, options = {}) {
  return rtlRender(ui, { wrapper: ({ children }) => children, ...options });
}

export * from '@testing-library/react';
export { render };

// Mock `window.matchMedia`
beforeAll(() => {
  global.matchMedia = global.matchMedia || function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  global.alert = jest.fn(); // Mock `alert` to avoid side effects
});

let mockUsersData = [];
let mockSchoolsData = [];

beforeEach(() => {
  mockUsersData = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  ];

  mockSchoolsData = [
    { id: '1', name: 'Test School', adminUserId: '1', adminUser: null },
  ];
});

beforeAll(() => {
  global.fetch = jest.fn((url, options) => {
    if (url.includes('/users')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: mockUsersData,
          }),
      });
    } else if (url.includes('/schools') && (!options?.method || options?.method === 'GET')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: mockSchoolsData,
          }),
      });
    } else if (url.includes('/schools') && options?.method === 'POST') {
      const newSchoolData = JSON.parse(options.body);
      const newSchool = {
        id: String(mockSchoolsData.length + 1), // Assign a new ID
        ...newSchoolData,
        adminUser: null,
      };

      // Find the admin user by id
      const adminUser = mockUsersData.find(user => String(user.id) === String(newSchoolData.adminUserId));
      if (adminUser) {
        newSchool.adminUser = adminUser;
      }

      mockSchoolsData.push(newSchool);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: newSchool }),
      });
    } else if (url.includes('/schools') && options?.method === 'PUT') {
      const idToUpdate = url.split('/').pop();
      const updatedSchoolData = JSON.parse(options.body);

      mockSchoolsData = mockSchoolsData.map((school) =>
        school.id === idToUpdate ? { ...school, ...updatedSchoolData } : school
      );

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: updatedSchoolData }),
      });
    } else if (url.includes('/schools') && options?.method === 'DELETE') {
      const idToDelete = url.split('/').pop();
      mockSchoolsData = mockSchoolsData.filter((school) => school.id !== idToDelete);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }
    // Handle other cases or invalid requests
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not Found' }),
    });
  });
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('SchoolManagementPage', () => {
  test('edits a school to change its name', async () => {
    render(<SchoolManagementPage />);

    // Wait for "Test School" to be in the document
    await waitFor(() => {
      expect(screen.getByText('Test School')).toBeInTheDocument();
    });

    // Click the edit button associated with "Test School"
    const editButtons = screen.getAllByText('✏️');
    fireEvent.click(editButtons[0]);

    // Wait for the modal to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText('School Name')).toBeInTheDocument();
    });

    // Change the school name
    fireEvent.change(screen.getByPlaceholderText('School Name'), { target: { value: 'Edited School Name' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the school list to update
    await waitFor(() => {
      expect(screen.getByText('Edited School Name')).toBeInTheDocument();
      expect(screen.queryByText('Test School')).not.toBeInTheDocument();
    });
  });

  test('shows no schools when there are none', async () => {
    // Set mockSchoolsData to empty array
    mockSchoolsData = [];

    render(<SchoolManagementPage />);

    // Wait for schools to load (which will be none)
    await waitFor(() => {
      expect(screen.getByText('No schools found')).toBeInTheDocument();
    });
  });

  test('displays multiple schools in the list', async () => {
    // Set mockSchoolsData to have multiple schools
    mockSchoolsData = [
      { id: '1', name: 'Test School 1', adminUserId: '1', adminUser: null },
      { id: '2', name: 'Test School 2', adminUserId: '2', adminUser: null },
      { id: '3', name: 'Test School 3', adminUserId: null, adminUser: null },
    ];

    render(<SchoolManagementPage />);

    // Wait for schools to load
    await waitFor(() => {
      expect(screen.getByText('Test School 1')).toBeInTheDocument();
      expect(screen.getByText('Test School 2')).toBeInTheDocument();
      expect(screen.getByText('Test School 3')).toBeInTheDocument();
    });
  });

  test('adds a school with an admin user assigned', async () => {
    render(<SchoolManagementPage />);

    // Wait for the initial schools to load
    await waitFor(() => {
      expect(screen.getByText('Test School')).toBeInTheDocument();
    });

    // Click the "Create School" button
    fireEvent.click(screen.getByText('Create School'));

    // Wait for the modal to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText('School Name')).toBeInTheDocument();
    });

    // Fill in the school name
    fireEvent.change(screen.getByPlaceholderText('School Name'), { target: { value: 'School with Admin' } });

    // Select an admin user from the dropdown
    fireEvent.change(screen.getByLabelText('Admin User'), { target: { value: '2' } }); // Selecting Jane Smith

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the new school to appear in the list
    await waitFor(() => {
      expect(screen.getByText('School with Admin')).toBeInTheDocument();
    });

    // Verify that the admin user's name is displayed
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  // Include the existing tests as well
  test('adds a school', async () => {
    render(<SchoolManagementPage />);

    // Wait for the initial schools to load
    await waitFor(() => {
      expect(screen.getByText('Test School')).toBeInTheDocument();
    });

    // Click the "Create School" button
    fireEvent.click(screen.getByText('Create School'));

    // Fill in the school name
    fireEvent.change(screen.getByPlaceholderText('School Name'), { target: { value: 'New Test School' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the new school to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New Test School')).toBeInTheDocument();
    });
  });

  test('deletes a school', async () => {
    render(<SchoolManagementPage />);

    // Wait for "Test School" to be in the document
    await waitFor(() => {
      expect(screen.getByText('Test School')).toBeInTheDocument();
    });

    // Click the delete button associated with "Test School"
    fireEvent.click(screen.getAllByText('❌')[0]);

    // Wait for the "Test School" to be removed from the document
    await waitFor(() => {
      expect(screen.queryByText('Test School')).not.toBeInTheDocument();
    });
  });

  test('renders the SchoolManagementPage with basic elements', async () => {
    render(<SchoolManagementPage />);

    expect(screen.getByText(/School Management/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Test School/i)).toBeInTheDocument());
  });

  test('opens and closes the school modal', async () => {
    render(<SchoolManagementPage />);

    fireEvent.click(screen.getByText(/Create School/i));
    expect(screen.getByPlaceholderText(/School Name/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/✖️/i));
    expect(screen.queryByPlaceholderText(/School Name/i)).not.toBeInTheDocument();
  });

  test('filters schools by search input', async () => {
    render(<SchoolManagementPage />);

    // Wait for schools to be rendered
    await waitFor(() => expect(screen.getByText(/Test School/i)).toBeInTheDocument());

    // Perform search
    fireEvent.change(screen.getByPlaceholderText(/Search schools/i), {
      target: { value: 'Nonexistent' },
    });

    // Verify that no schools match the search term
    expect(screen.queryByText(/Test School/i)).not.toBeInTheDocument();
  });
});
