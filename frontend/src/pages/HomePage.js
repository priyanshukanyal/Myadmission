import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../designsAndCss/HomePage.css";
import UniversityComparison from "../components/UniversityComparion"; // Import the comparison component

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section text-center text-light">
        <Container>
          <h1 className="display-4 fw-bold">Study Abroad Made Simple</h1>
          <p className="lead">
            Discover top universities and programs around the world. Take the
            next step in your academic journey with confidence.
          </p>
          <Button
            as={Link}
            to="/Universities"
            variant="primary"
            size="lg"
            className="mt-3"
          >
            Explore Universities
          </Button>
        </Container>
      </div>

      {/* Why Choose Us Section */}
      <Container className="my-5">
        <h2 className="text-center fw-bold mb-4">Why Choose Us?</h2>
        <Row className="gy-4">
          <Col md={4}>
            <Card className="info-card shadow-sm">
              <Card.Body>
                <Card.Title>Expert Guidance</Card.Title>
                <Card.Text>
                  Our experienced advisors provide personalized assistance for
                  your study abroad journey.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="info-card shadow-sm">
              <Card.Body>
                <Card.Title>Top Universities</Card.Title>
                <Card.Text>
                  We partner with leading institutions worldwide to offer you
                  the best programs.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="info-card shadow-sm">
              <Card.Body>
                <Card.Title>Seamless Application</Card.Title>
                <Card.Text>
                  Our platform simplifies the application process with
                  easy-to-follow steps and expert reviews.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* University Comparison Section */}
      <Container className="my-5">
        <h2 className="text-center fw-bold mb-4">Compare Universities</h2>
        <UniversityComparison />{" "}
        {/* Render the UniversityComparison component */}
      </Container>

      {/* Call-to-Action Section */}
      <div className="cta-section text-center text-light">
        <Container>
          <h2 className="fw-bold">Ready to Begin?</h2>
          <p className="lead">
            Create your profile and start exploring the best programs tailored
            to your goals.
          </p>
          <Button
            as={Link}
            to="/onboarding"
            variant="success"
            size="lg"
            className="mt-3"
          >
            Get Started Now
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;

// import React from "react";
// import { Container, Row, Col, Button, Card } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import "../designsAndCss/HomePage.css";

// const HomePage = () => {
//   return (
//     <div className="homepage">
//       <div className="hero-section text-center text-light">
//         <Container>
//           <h1 className="display-4 fw-bold">Study Abroad Made Simple</h1>
//           <p className="lead">
//             Discover top universities and programs around the world. Take the
//             next step in your academic journey with confidence.
//           </p>
//           <Button
//             as={Link}
//             to="/Universities"
//             variant="primary"
//             size="lg"
//             className="mt-3"
//           >
//             Explore Universities
//           </Button>
//         </Container>
//       </div>

//       <Container className="my-5">
//         <h2 className="text-center fw-bold mb-4">Why Choose Us?</h2>
//         <Row className="gy-4">
//           <Col md={4}>
//             <Card className="info-card shadow-sm">
//               <Card.Body>
//                 <Card.Title>Expert Guidance</Card.Title>
//                 <Card.Text>
//                   Our experienced advisors provide personalized assistance for
//                   your study abroad journey.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="info-card shadow-sm">
//               <Card.Body>
//                 <Card.Title>Top Universities</Card.Title>
//                 <Card.Text>
//                   We partner with leading institutions worldwide to offer you
//                   the best programs.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="info-card shadow-sm">
//               <Card.Body>
//                 <Card.Title>Seamless Application</Card.Title>
//                 <Card.Text>
//                   Our platform simplifies the application process with
//                   easy-to-follow steps and expert reviews.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       <div className="cta-section text-center text-light">
//         <Container>
//           <h2 className="fw-bold">Ready to Begin?</h2>
//           <p className="lead">
//             Create your profile and start exploring the best programs tailored
//             to your goals.
//           </p>
//           <Button
//             as={Link}
//             to="/onboarding"
//             variant="success"
//             size="lg"
//             className="mt-3"
//           >
//             Get Started Now
//           </Button>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
