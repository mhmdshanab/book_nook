import React from 'react';

const Products = () => {
  return (
    <>
      <section className="page-section">
        <div className="container">
          <div className="product-item">
            <div className="product-item-title d-flex">
              <div className="bg-faded p-5 d-flex ms-auto rounded">
                <h2 className="section-heading mb-0">
                  <span className="section-heading-upper">Handpicked Selections</span>
                  <span className="section-heading-lower">Fiction & Literature</span>
                </h2>
              </div>
            </div>
            <img className="product-item-img mx-auto d-flex rounded img-fluid mb-3 mb-lg-0" src="/assets/img/products-01.png?v=3" alt="..." />
            <div className="product-item-description d-flex me-auto">
              <div className="bg-faded p-5 rounded"><p className="mb-0">Lose yourself in compelling narratives—from contemporary bestsellers to award‑winning novels and timeless classics. Perfect picks for book clubs and weekend escapes.</p></div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="page-section">
        <div className="container">
          <div className="product-item">
            <div className="product-item-title d-flex">
              <div className="bg-faded p-5 d-flex me-auto rounded">
                <h2 className="section-heading mb-0">
                  <span className="section-heading-upper">Inspire and Learn</span>
                  <span className="section-heading-lower">Non‑Fiction & Self‑Help</span>
                </h2>
              </div>
            </div>
            <img className="product-item-img mx-auto d-flex rounded img-fluid mb-3 mb-lg-0" src="/assets/img/products-02.png?v=3" alt="..." />
            <div className="product-item-description d-flex ms-auto">
              <div className="bg-faded p-5 rounded"><p className="mb-0">Explore thought‑provoking reads in history, business, biographies, wellness, and creativity. Curated to spark ideas and fuel growth.</p></div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="page-section">
        <div className="container">
          <div className="product-item">
            <div className="product-item-title d-flex">
              <div className="bg-faded p-5 d-flex ms-auto rounded">
                <h2 className="section-heading mb-0">
                  <span className="section-heading-upper">For Every Young Reader</span>
                  <span className="section-heading-lower">Kids & Young Adult</span>
                </h2>
              </div>
            </div>
            <img className="product-item-img mx-auto d-flex rounded img-fluid mb-3 mb-lg-0" src="/assets/img/products-03.png?v=3" alt="..." />
            <div className="product-item-description d-flex me-auto">
              <div className="bg-faded p-5 rounded"><p className="mb-0">From picture books to epic adventures, help growing minds discover the joy of reading. Ask us for age‑appropriate recommendations.</p></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
