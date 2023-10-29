const ProductLayout = ({ children }) => (
  <section className="main-page">
    <h3 className="category">Product Detail</h3>

    <section>{children}</section>
  </section>
);

export default ProductLayout;
