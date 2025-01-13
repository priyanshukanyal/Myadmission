import React, { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What are the eligibility criteria for studying abroad?",
      answer:
        "Eligibility criteria vary by university and program but generally include academic qualifications, English language proficiency (IELTS, TOEFL, etc.), and financial documentation.",
    },
    {
      question:
        "Which countries are the most popular for Indian students to study abroad?",
      answer:
        "Popular countries include the USA, UK, Canada, Australia, Germany, and New Zealand.",
    },
    {
      question: "What is the cost of studying abroad?",
      answer:
        "The cost depends on the country, university, and program, ranging from INR 10 lakhs to INR 50 lakhs per year, including tuition and living expenses.",
    },
    {
      question: "Are scholarships available for Indian students?",
      answer:
        "Yes, many universities and governments offer scholarships for Indian students based on merit, need, or specific achievements.",
    },
    {
      question: "What documents are required for the application process?",
      answer:
        "Documents typically include academic transcripts, proof of English proficiency, letters of recommendation, a statement of purpose, and a valid passport.",
    },
    {
      question: "When should I start the application process?",
      answer:
        "It is recommended to start 12-18 months before the intended intake to ensure enough time for applications, tests, and visa processes.",
    },
    {
      question: "How can I improve my chances of getting a student visa?",
      answer:
        "Ensure accurate documentation, demonstrate financial stability, and present a clear study plan during the visa interview.",
    },
    {
      question: "Do I need health insurance while studying abroad?",
      answer:
        "Yes, health insurance is mandatory in most countries to cover medical expenses during your stay.",
    },
    {
      question: "Can I work part-time while studying abroad?",
      answer:
        "Many countries allow students to work part-time for up to 20 hours a week during semesters and full-time during breaks.",
    },
    {
      question: "What are the popular exams required for admission?",
      answer:
        "Common exams include IELTS, TOEFL, GRE, GMAT, and SAT, depending on the program and country.",
    },
    {
      question: "What if I don’t meet the English language requirements?",
      answer:
        "You may take additional English courses or enroll in pathway programs offered by universities.",
    },
    {
      question: "How can I find the right program and university?",
      answer:
        "Consider your interests, career goals, budget, and preferred country. Our counselors can guide you in making an informed choice.",
    },
    {
      question: "Is accommodation provided by the universities?",
      answer:
        "Many universities offer on-campus accommodation or assist students in finding off-campus housing.",
    },
    {
      question: "How can I manage my finances while studying abroad?",
      answer:
        "Create a budget, explore scholarships, and consider part-time work opportunities to manage expenses.",
    },
    {
      question: "What should I pack before moving abroad?",
      answer:
        "Pack essential items, including documents, clothes suitable for the weather, and personal belongings. Avoid over-packing.",
    },
    {
      question: "What is the process for obtaining a student visa?",
      answer:
        "The process involves submitting an application, attending an interview, and providing necessary documents like an admission letter, financial proof, and a valid passport.",
    },
    {
      question: "Are there opportunities to stay and work after graduation?",
      answer:
        "Yes, many countries offer post-study work visas, allowing you to gain work experience after completing your degree.",
    },
    {
      question: "How do I stay connected with my family back home?",
      answer:
        "Use video calls, messaging apps, and international calling services to stay connected with your family.",
    },
    {
      question:
        "What support services are available for international students?",
      answer:
        "Universities provide support services like counseling, academic help, and career guidance for international students.",
    },
    {
      question: "How can your consultancy help me in studying abroad?",
      answer:
        "We provide personalized guidance, assist with applications, scholarships, and visas, and ensure a smooth transition for students.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              <span>{activeIndex === index ? "-" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .faq-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .faq-list {
          border-top: 1px solid #ddd;
        }

        .faq-item {
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .faq-answer {
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

export default FAQ;
