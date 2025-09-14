import React from 'react';

const About = () => {
  return (
    <section className="page-section about-heading">
      <div className="container">
        <img className="img-fluid rounded about-heading-img mb-3 mb-lg-0" src="/assets/img/about.png?v=3" alt="About our bookstore" loading="lazy" />
        <div className="about-heading-content">
          <div className="row">
            <div className="col-xl-9 col-lg-10 mx-auto">
              <div className="bg-faded rounded p-5">
                <h2 className="section-heading mb-4">
                  <span className="section-heading-upper">A Love for Books</span>
                  <span className="section-heading-lower">About Our Bookstore</span>
                </h2>
                <p>Founded in 1987 by the Hernandez family, our bookstore has been connecting readers with unforgettable stories and ideas.</p>
                <p className="mb-0">We believe the right book can change your day—or your life.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
