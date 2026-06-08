import WhatIDoIcon from '../../img/whatido.svg';

const Karya = () => {
  return (
    <>
      <section className="services">
        <div className="services-header">
          <img src={WhatIDoIcon} alt="What I Do" />
        </div>
        <div className="services-header">
          <img src={WhatIDoIcon} alt="What I Do" />
        </div>
        <div className="services-header">
          <img src={WhatIDoIcon} alt="What I Do" />
        </div>
      </section>
      <section className="services-copy">
        <h1 className="animate-text">
          I create websites and digital experiences that value clarity above
          excess. Through minimal form and precise detail, I aim to build work
          that lasts and offers a quiet sense of order.
        </h1>
      </section>
    </>
  );
};

export default Karya;
