import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import './style.css';

function Mouldings({ data, loadingActive }) {
  const [modalOpen, setModalOpen] = useState(null);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 870);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 870);
    };
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!data || data.length === 0) {
    if(loadingActive){
      return <></>;
    }
    return <p>No mouldings available</p>;
  }

  const toggleModal = (index) => {
    if (modalOpen === index) {
      setModalOpen(null); // Close the modal if the same icon is clicked again
    } else {
      setModalOpen(index);
    }
  };

  return (
    <div className="itemContainer">
      <ul className="ulItemId">
        <div>
          {data.length > 0 && (
            <div className="product-list">
              {data.map((item, index) => (
                <div key={item.Product + index}>
                  <div className="product-item">
                    <table className="tableStyle">
                      <thead>
                        <tr className="centerlizedTitleField">

                          {/* ------- TITLE --> CONTENT IF COMPUTER / LARGE SCREEN  ------- */}

                          {!isSmallScreen && (
                            <>
                              <th className="HVCenter12">Picture</th>
                              <th className="HVCenter12">Product</th>
                              <th className="HVCenter12">Color</th>
                              <th className="HVCenter12">Category</th>
                              <th className="HVCenter12">Size</th>
                              <th className="HVCenter12">Material</th>
                              <th className="HVCenter12">Line-Art</th>
                              <th
                                className={
                                  item.Status === 'Regular'
                                    ? 'HVCenter12Regular'
                                    : item.Status === 'Intro'
                                    ? 'HVCenter12Intro'
                                    : item.Status === 'Special Offer'
                                    ? 'HVCenter12Special'
                                    : 'HVCenter12'
                                }
                              >
                                {item.Status}
                              </th>
                            </>
                          )}

                          {/* ------- TITLE --> CONTENT IF PHONE / SMALL SCREEN  ------- */}

                          {isSmallScreen && (
                            <>
                              <td className="HVCenter12"><h2>{item.Color}</h2></td>
                              <td className="HVCenter12"><h2>{item.Category}</h2></td>
                              <th
                                className={
                                  item.Status === 'Regular'
                                    ? 'HVCenter12Regular'
                                    : item.Status === 'Intro'
                                    ? 'HVCenter12Intro'
                                    : item.Status === 'Special Offer'
                                    ? 'HVCenter12Special'
                                    : 'HVCenter12'
                                }
                              >
                                {item.Status}
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>

                          {/* ------- CONTENT IF COMPUTER / LARGE SCREEN ------- */}

                          {!isSmallScreen && (
                          <>
                            <tr className="centerlizedField">
                              <td className="HVCenter12">
                                <img
                                  src={item.Photo_1}
                                  className="imgMaterialContainer"
                                  alt="img"
                                  width={"100%"}
                                  onClick={() => toggleModal(index)}
                                />
                              </td>
                              <td className="HVCenter12">
                                <h4>{item.Product}</h4>
                              </td>
                              <td className="HVCenter12">{item.Color}</td>
                              <td className="HVCenter12">{item.Category}</td>
                              <td className="HVCenter12">{item.Size}"</td>
                              <td className="HVCenter12">{item.Material}</td>
                              <td className="HVCenter12">
                                <img
                                  src={item.Photo_2}
                                  className="imgMaterialContainer"
                                  alt="img"
                                  width={"100%"}
                                  onClick={() => toggleModal(index)}
                                />
                              </td>
                              <td className="HVCenter12">
                                {modalOpen === index ? (
                                  <ChevronUp
                                    className="iconOpenDetails"
                                    onClick={() => toggleModal(index)}
                                  />
                                ) : (
                                  <ChevronDown
                                    className="iconOpenDetails"
                                    onClick={() => toggleModal(index)}
                                  />
                                )}
                              </td>
                            </tr>
                            </>
                          )}

                          {/* ------- CONTENT IF PHONE / SMALL SCREEN ------- */}
                          {isSmallScreen && (
                          <>
                            <tr className="centerlizedField">
                              <td className="HVCenter12">
                                <img
                                  src={item.Photo_1}
                                  className="imgMaterialContainer"
                                  alt="img"
                                  width={"100%"}
                                  onClick={() => toggleModal(index)}
                                />
                              </td>
                              <td className="HVCenter12">
                                <h1>{item.Product}</h1>
                              </td>
                              <td className="HVCenter12">
                                <img
                                  src={item.Photo_2}
                                  className="imgMaterialContainer"
                                  alt="img"
                                  width={"100%"}
                                  onClick={() => toggleModal(index)}
                                />
                              </td>

                            </tr>
                            <tr className="centerlizedField">
                              <td className="HVCenter12"><h2>{item.Size}"</h2></td>
                              <td className="HVCenter12"><h2>{item.Material}</h2></td>
                              <td className="HVCenter12">
                                {modalOpen === index ? (
                                  <ChevronUp
                                    className="iconOpenDetails"
                                    onClick={() => toggleModal(index)}
                                  />
                                ) : (
                                  <ChevronDown
                                    className="iconOpenDetails"
                                    onClick={() => toggleModal(index)}
                                  />
                                )}
                              </td>
                            </tr>
                            </>
                          )}
                        
                      </tbody>
                    </table>
                  </div>

                  {modalOpen === index && (
                    <div className="detailsModal">
                      <div className="detailsItemsModal">
                        <div>
                          <img
                            src={item.Photo_3}
                            className="imgDetailsMaterialContainer"
                            alt="img"
                          />
                        </div>
                        <div className="textDetailsStyle">
                          <h1>{item.Product}</h1>
                          <p>
                            Color: <strong>{item.Color}</strong>
                          </p>
                          <p>
                            Category: <strong>{item.Category}</strong>
                          </p>
                          <p>
                            Material: <strong>{item.Material}</strong>
                          </p>
                          <p>
                            Size: <strong>{item.Size}</strong>
                          </p>
                          <p>
                            Ft / Box: <strong>{item.Ft_Box}<strong style={{color:'#444'}}></strong></strong>
                          </p>
                          <p className="box-ft-text">
                            <strong>* Box footage may vary</strong>
                          </p>
                          <p>
                            Catalog Page: <strong>{item.Page_MTL}</strong>
                          </p>
                          <p>
                            <strong>{item.Description}</strong>
                          </p>
                        </div>
                        <div>
                          <img
                            src={item.Photo_4}
                            className="imgDetailsMaterialContainer"
                            alt="img"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ul>
    </div>
  );
}

export default Mouldings;
