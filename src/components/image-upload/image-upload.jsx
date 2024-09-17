import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

const ImageUpload = ({ token, username }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`http://35.173.126.252/users/${username}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus('File uploaded successfully');
        // Optionally, update user data in your app to reflect the new profile image
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Upload Image</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-2">
        Upload
      </Button>
      {uploadStatus && (
        <Alert variant={uploadStatus.includes('successfully') ? 'success' : 'danger'} className="mt-2">
          {uploadStatus}
        </Alert>
      )}
    </Form>
  );
};

export default ImageUpload;
