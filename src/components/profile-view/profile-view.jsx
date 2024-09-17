import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '../movie-card/movie-card';
import { Button, Form, Card, Row, Col, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import './profile-view.scss';

export const ProfileView = ({ user, movies, token, onFavoriteToggle }) => {
  const [userData, setUserData] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedBirthday, setUpdatedBirthday] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [resizedImages, setResizedImages] = useState([]);
  const [fullImage, setFullImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // For image upload
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const API_URL = 'http://35.173.126.252:8080'; // Include port 8080

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImageUrl(imageUrl);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setUploadError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post(`${API_URL}/users/${user.username}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const updatedUserData = { ...userData, profileImage: response.data.profileImage };
        setUserData(updatedUserData);
        setPreviewImageUrl(null);
        setSelectedImage(null);
        setUploadError(null);

        // Fetch resized images after successful upload
        fetchResizedImages();
      } else {
        setUploadError('Failed to upload image.');
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      setUploadError(error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred during image upload.');
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/${user.username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [user, token]);

  useEffect(() => {
    if (movies && user && user.favoriteMovies) {
      setFavoriteMovies(movies.filter((movie) => user.favoriteMovies.includes(movie._id)));
    }
  }, [movies, user]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    const data = {
      username: updatedUsername || userData.username,
      password: updatedPassword || userData.password,
      email: updatedEmail || userData.email,
      birthday: updatedBirthday || userData.birthday,
    };

    try {
      const response = await axios.put(`${API_URL}/users/${user.username}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const updatedData = response.data;
        setUserData(updatedData);
        setIsEditing(false);
      } else {
        setError('Failed to update user data');
        console.error('Update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user data:', error.response ? error.response.data : error.message);
      setError(error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Failed to update user data');
    }
  };

  // Function to fetch resized images
  const fetchResizedImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${user.username}/resized-images`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setResizedImages(response.data.images); // Assuming response contains an array of image URLs
      } else {
        console.error('Failed to fetch resized images');
      }
    } catch (error) {
      console.error('Error fetching resized images:', error);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchResizedImages();
    }
  }, [user, token]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}/users/${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.clear();
        navigate('/login'); // Redirect to login page after deletion
      } else {
        setError('Failed to delete account');
        console.error('Deletion failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting account:', error.response ? error.response.data : error.message);
      setError(error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Failed to delete account');
    }
  };

  const handleFavoriteToggle = async (movieID) => {
    try {
      const isFavorite = userData.favoriteMovies.includes(movieID);
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await axios({
        method: method,
        url: `${API_URL}/users/${user.username}/movies/${movieID}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedFavoriteMovies = isFavorite
          ? userData.favoriteMovies.filter((id) => id !== movieID)
          : [...userData.favoriteMovies, movieID];
        setUserData({ ...userData, favoriteMovies: updatedFavoriteMovies });

        if (isFavorite) {
          setFavoriteMovies(favoriteMovies.filter((movie) => movie._id !== movieID));
        }
      } else {
        setError('Failed to update favorite movies');
        console.error('Favorite toggle failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating favorite movies:', error.response ? error.response.data : error.message);
      setError(error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Failed to update favorite movies');
    }
  };

  const handleThumbnailClick = (imageUrl) => {
    const originalImageUrl = imageUrl.replace('resized-images', 'original-images');
    setFullImage(originalImageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFullImage(null);
  };

  return (
    <div className="profile-view">
      <Card className="profile-info">
        <Card.Body>
          <Row>
            <Col>
              {userData?.profileImage && (
                <div className="profile-image-container">
                  <img src={userData.profileImage} alt="Profile" className="profile-image" />
                </div>
              )}
              <div className="welcome">
                <div>{userData?.username}</div>
              </div>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button variant="link" onClick={() => setIsEditing(!isEditing)} className="edit-button">
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button variant="danger" onClick={handleDelete} className="delete-button">
                Delete Account
              </Button>
            </Col>
          </Row>

          {isEditing && userData && (
            <>
              {/* Image Upload Section */}
              <Form.Group controlId="formProfileImage" className="mb-3">
                <Form.Label>Profile Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              </Form.Group>

              {previewImageUrl && (
                <div className="preview-image-container">
                  <img src={previewImageUrl} alt="Preview" className="preview-image" />
                </div>
              )}

              <Button variant="primary" onClick={handleImageUpload} className="mt-2">
                Upload Image
              </Button>

              {uploadError && <Alert variant="danger">{uploadError}</Alert>}

              <Form onSubmit={handleUpdate}>
                <Form.Group controlId="profileUsername" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={updatedUsername}
                    onChange={(e) => setUpdatedUsername(e.target.value)}
                    required
                    minLength="5"
                  />
                </Form.Group>

                <Form.Group controlId="profilePassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    required
                    minLength="5"
                  />
                </Form.Group>

                <Form.Group controlId="profileEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="profileBirthday" className="mb-3">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type="date"
                    value={updatedBirthday}
                    onChange={(e) => setUpdatedBirthday(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="dark" type="submit" className="mt-3">
                  Update Profile
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Display Resized Images Section */}
      {resizedImages.length > 0 && (
        <div className="resized-images-gallery mt-4">
          <h5>Resized Images</h5>
          <Row>
            {resizedImages.map((imageUrl, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <img
                  src={imageUrl}
                  alt={`Thumbnail ${index}`}
                  className="resized-image-thumbnail"
                  onClick={() => handleThumbnailClick(imageUrl)}
                  loading="lazy"
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Modal for Full-Sized Image */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Full-Sized Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fullImage && <img src={fullImage} alt="Full-Sized" style={{ width: '100%' }} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {favoriteMovies.length > 0 ? (
        <div>
          <h4 className="favorite-movies-title">Favorite Movies</h4>
          <Row>
            {favoriteMovies.map((movie) => (
              <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  className="movie-card transparent-blur-overlay"
                  onClick={() => navigate(`/movies/${movie._id}`)}
                >
                  <div className="image-container">
                    <Card.Img
                      variant=""
                      src={movie.ImageURL}
                      alt={`The cover of ${movie.Title}`}
                      className="movie-card-img"
                    />
                  </div>
                  <Card.Body className="movie-card-body">
                    <Card.Title className="movie-card-title">{movie.Title}</Card.Title>
                    <Card.Text className="movie-card-text">{movie.Director}</Card.Text>
                    {userData && (
                      <Button
                        variant={userData.favoriteMovies.includes(movie._id) ? 'danger' : 'primary'}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleFavoriteToggle(movie._id);
                        }}
                      >
                        {userData.favoriteMovies.includes(movie._id) ? 'Remove' : 'Add to Favorites'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <p>No favorite movies yet.</p>
      )}

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default ProfileView;
