import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OpenModal from '../OpenModal';

const SingleUser = () => {
  const history = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [quotedPrice, setQuotedPrice] = useState();

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-application/${id}`,
      );
      setUserData(data);
    } catch (error) {
      if (!(error.response?.status === 200)) {
        history('/');
      }
    }
  };

  useEffect(() => {
    if (id) {
      getUserData();
    } else {
      history('/');
    }
  }, []);

  const originalDate = new Date(userData?.dateofbirth);
  const formattedDate = originalDate.toLocaleDateString('en-GB');

  const generatePrice = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/application/${id}/validate`,
      );
      setQuotedPrice(data?.price);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Insurance Details</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6 className="card-subtitle mb-2 text-muted">
                Personal Information
              </h6>
              <p>
                <strong>Name:</strong> {userData?.firstname}{' '}
                {userData?.lastname}
              </p>
              <p>
                <strong>Date of Birth:</strong> {formattedDate}
              </p>
              <p>
                <strong>Address:</strong> {userData?.address_city},
                {userData?.address_state},{userData?.address_street},
                {userData?.address_zipCode}
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="card-subtitle mb-2 text-muted">
                Vehicle Information
              </h6>
              {userData?.vehicles?.map((value, i) => (
                <React.Fragment key={i}>
                  <h4>Vehicle {i + 1} :</h4>

                  <p>
                    <strong>VIN:</strong> {value?.vin}
                  </p>
                  <p>
                    <strong>Year:</strong> {value?.year}
                  </p>
                  <p>
                    <strong>Make and Model:</strong> {value?.makeAndModel}
                  </p>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-info btn-lg"
          onClick={() => setOpenModal(true)}
        >
          Edit
        </button>
        {openModal && (
          <OpenModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            getUserData={getUserData}
          />
        )}
      </div>
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-info btn-lg"
          onClick={generatePrice}
        >
          Get Price
        </button>
      </div>
      <div className="container mt-5">
        {/* ... other code */}
        {quotedPrice && (
          <div className="mt-3">
            <h2 className="quoted-price-title">
              Quoted price to purchase insurance:{' '}
              <span className="quoted-price">{quotedPrice}</span>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUser;
