import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    { text: "Investing in mutual funds changed my financial future!", author: "John Doe" },
    { text: "I love the ease of managing my investments.", author: "Jane Smith" },
  ];

  return (
    <section className="testimonials">
      <h2>What Our Clients Say</h2>
      <div className="testimonials-carousel">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <p>"{testimonial.text}"</p>
            <h4>- {testimonial.author}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

