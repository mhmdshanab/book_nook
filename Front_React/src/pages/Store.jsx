import React from 'react';

const Store = () => {
  return (
    <>
      <section className="page-section cta">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 mx-auto">
              <div className="cta-inner bg-faded text-center rounded">
                <h2 className="section-heading mb-5">
                  <span className="section-heading-upper">Come On In</span>
                  <span className="section-heading-lower">We're Open</span>
                </h2>
                <ul className="list-unstyled list-hours mb-5 text-left mx-auto">
                  {[
                    ['Sunday', 'Closed'],
                    ['Monday', '7:00 AM to 8:00 PM'],
                    ['Tuesday', '7:00 AM to 8:00 PM'],
                    ['Wednesday', '7:00 AM to 8:00 PM'],
                    ['Thursday', '7:00 AM to 8:00 PM'],
                    ['Friday', '7:00 AM to 8:00 PM'],
                    ['Saturday', '9:00 AM to 5:00 PM'],
                  ].map(([d, h]) => (
                    <li key={d} className="list-unstyled-item list-hours-item d-flex">
                      {d}<span className="ms-auto">{h}</span>
                    </li>
                  ))}
                </ul>
                <p className="address mb-5">
                  <em>
                    <strong>1116 Orchard Street</strong><br />
                    Golden Valley, Minnesota
                  </em>
                </p>
                <p className="mb-0">
                  <small><em>Call Anytime</em></small><br />
                  (317) 585-8468
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section about-heading">
        <div className="container">
          <img className="img-fluid rounded about-heading-img mb-3 mb-lg-0" src="/assets/img/about.png?v=3" alt="Reading corner" loading="lazy" />
          <div className="about-heading-content">
            <div className="row">
              <div className="col-xl-9 col-lg-10 mx-auto">
                <div className="bg-faded rounded p-5">
                  <h2 className="section-heading mb-4">
                    <span className="section-heading-upper">A Place for Readers</span>
                    <span className="section-heading-lower">About Our Bookstore</span>
                  </h2>
                  <p>We host clubs, author signings, and cozy browsing spaces.</p>
                  <p className="mb-0">Come for recommendations, stay for the atmosphere.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Store;
