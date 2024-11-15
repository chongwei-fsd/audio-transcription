// App.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { uploadFiles, fetchTranscriptions, searchTranscriptions } from './api';

// Mock API functions
jest.mock('./api', () => ({
  uploadFiles: jest.fn(),
  fetchTranscriptions: jest.fn(),
  searchTranscriptions: jest.fn(),
}));

describe('App Component', () => {
  
  test('renders and uploads files', async () => {
    const mockTranscriptions = [{ id: '123', filename: 'test.mp3', transcription: 'Test text' }];
    
    fetchTranscriptions.mockResolvedValueOnce(mockTranscriptions);

    render(<App />);
    
    const inputFile = screen.getByLabelText(/Choose a file:/i);
    const uploadButton = screen.getByText(/Upload & Transcribe/i);

    fireEvent.change(inputFile, {
      target: { files: [new File(['file content'], 'test.mp3')] },
    });
    
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(fetchTranscriptions).toHaveBeenCalled();
      expect(screen.getByText(/Test text/i)).toBeInTheDocument();
    });
  });

  test('display transcriptions after fetching', async () => {
    const mockData = [{ id: 1, filename: 'test.mp3', transcription: 'Test transcription' }];
    fetchTranscriptions.mockResolvedValueOnce(mockData);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test transcription')).toBeInTheDocument();
    });
  });

  test('should handle search', async () => {
    searchTranscriptions.mockResolvedValueOnce([{ id: 1, filename: 'test.mp3', transcription: 'Test transcription' }]);

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Search by filename'), {
      target: { value: 'test' }
    });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(searchTranscriptions).toHaveBeenCalledWith('test');
    });

    expect(screen.getByText('Test transcription')).toBeInTheDocument();
  });


});
