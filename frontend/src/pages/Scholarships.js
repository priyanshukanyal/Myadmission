import React, { useState } from "react";

const Scholarships = () => {
  const scholarships = [
    {
      type: "Merit-Based Scholarships",
      description:
        "These scholarships are awarded to students based on their academic, athletic, or artistic achievements. They are often offered by universities to attract top-performing students.",
      eligibility:
        "Applicants must demonstrate outstanding academic performance, standardized test scores, or exceptional talent in specific fields such as sports or arts.",
      howToObtain:
        "Research universities offering merit-based scholarships, ensure your application highlights achievements, and submit required documents such as transcripts, test scores, and letters of recommendation.",
    },
    {
      type: "Need-Based Scholarships",
      description:
        "These scholarships are designed for students who demonstrate financial need. They aim to make education accessible to those who might not otherwise afford it.",
      eligibility:
        "Applicants must provide financial documents proving their need, such as income statements or tax returns.",
      howToObtain:
        "Fill out the financial aid application of the respective university or organization, such as FAFSA for the USA. Include all necessary financial documents.",
    },
    {
      type: "Country-Specific Scholarships",
      description:
        "These scholarships are targeted at students from specific countries to encourage cultural exchange and diversity.",
      eligibility:
        "Applicants must be citizens of eligible countries as specified by the scholarship provider.",
      howToObtain:
        "Check for scholarships offered by universities, governments, or organizations for students from your country and follow the application process.",
    },
    {
      type: "Program-Specific Scholarships",
      description:
        "These scholarships are designed for students enrolling in specific programs, such as engineering, business, or healthcare.",
      eligibility:
        "Applicants must be admitted to the eligible program and meet specific criteria related to that field of study.",
      howToObtain:
        "Identify scholarships linked to your chosen program and submit the required documents alongside your program application.",
    },
    {
      type: "University-Specific Scholarships",
      description:
        "Many universities offer scholarships to attract international students, which can cover partial or full tuition.",
      eligibility:
        "Eligibility criteria vary but may include academic performance, extracurricular involvement, or financial need.",
      howToObtain:
        "Visit the university's financial aid or scholarship page, and submit applications as per their guidelines.",
    },
    {
      type: "Government-Funded Scholarships",
      description:
        "Governments of countries like the USA, Canada, Australia, and the UK offer scholarships to support international students.",
      eligibility:
        "Applicants must meet academic or leadership criteria, and some scholarships require commitment to returning to the home country after studies.",
      howToObtain:
        "Examples include the Fulbright Program (USA), Chevening Scholarships (UK), Australia Awards, and Vanier Canada Graduate Scholarships. Check respective government portals for application details.",
    },
    {
      type: "Sports Scholarships",
      description:
        "These scholarships are offered to talented athletes to pursue their education while representing the university in sports.",
      eligibility:
        "Applicants must demonstrate excellence in sports and may need to maintain specific academic standards.",
      howToObtain:
        "Reach out to university athletic departments or coaches, submit your sports portfolio, and participate in trials if required.",
    },
    {
      type: "Diversity and Inclusion Scholarships",
      description:
        "These scholarships are aimed at promoting diversity and inclusivity by supporting students from underrepresented groups.",
      eligibility:
        "Applicants must belong to the target group (e.g., minority communities, women in STEM).",
      howToObtain:
        "Look for scholarships with diversity initiatives and submit a compelling application demonstrating your background and goals.",
    },
    {
      type: "Research-Based Scholarships",
      description:
        "These scholarships support students pursuing research-intensive programs, often at the graduate or doctoral level.",
      eligibility:
        "Applicants must show strong research skills and submit a research proposal or portfolio.",
      howToObtain:
        "Contact universities or faculty members, align your research interests with available funding opportunities, and submit your proposal.",
    },
    {
      type: "Alumni Scholarships",
      description:
        "These scholarships are funded by alumni associations to support current or prospective students.",
      eligibility:
        "Criteria vary but may include academic performance, community involvement, or leadership skills.",
      howToObtain:
        "Check if your target university has alumni-funded scholarships and follow the application process.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleScholarship = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="scholarships-container">
      <h1>Types of Scholarships for Studying Abroad</h1>
      <div className="scholarship-list">
        {scholarships.map((scholarship, index) => (
          <div key={index} className="scholarship-item">
            <div
              className="scholarship-type"
              onClick={() => toggleScholarship(index)}
            >
              <h3>{scholarship.type}</h3>
              <span>{activeIndex === index ? "-" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="scholarship-details">
                <p>
                  <strong>Description:</strong> {scholarship.description}
                </p>
                <p>
                  <strong>Eligibility:</strong> {scholarship.eligibility}
                </p>
                <p>
                  <strong>How to Obtain:</strong> {scholarship.howToObtain}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .scholarships-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .scholarship-list {
          border-top: 1px solid #ddd;
        }

        .scholarship-item {
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
        }

        .scholarship-type {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .scholarship-details {
          margin-top: 10px;
          padding-left: 20px;
          color: #555;
        }

        span {
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Scholarships;
