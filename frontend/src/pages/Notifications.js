import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../components/generalComponents/authContext";

const Notifications = () => {
  const { state } = useAuth();
  const { token, user } = state;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications/${user?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && user?._id) {
      fetchNotifications();
    }
  }, [token, user]);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Notifications</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : notifications.length > 0 ? (
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              {notifications.map((notification, index) => (
                <ListGroup.Item key={index} className="py-2">
                  {notification.message}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info">No notifications at the moment.</Alert>
      )}
    </Container>
  );
};

export default Notifications;
