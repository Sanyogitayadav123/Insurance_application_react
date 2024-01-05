import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '500px',
  },
};
const OpenModal = ({ openModal, setOpenModal, getUserData }) => {
  const [numVehicles, setNumVehicles] = useState(1);

  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setOpenModal(false);
  }

  const onSubmit = async (value) => {
    try {
      const vehiclesToUpdate = value.vehicles.slice(0, numVehicles);
      const userDataToUpdate = {
        firstName: value.firstName,
        lastName: value.lastName,
        dateOfBirth: value.dateOfBirth,
        address: {
          street: value.address.street,
          city: value.address.city,
          state: value.address.state,
          zipCode: value.address.zipCode,
        },
        vehicles: vehiclesToUpdate,
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/put-application/${id}`,
        userDataToUpdate,
      );
      setOpenModal(false);
      getUserData();
      console.log('data', data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleUser();
    }
  }, []);

  const getSingleUser = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-application/${id}`,
      );
      console.log('data', data);
      setValue('firstName', data?.firstname);
      setValue('lastName', data?.lastname);
      const originalDate = new Date(data?.dateofbirth);
      const formattedDate = originalDate.toISOString().split('T')[0];
      setValue('dateOfBirth', formattedDate);
      setValue('address.street', data?.address_street);
      setValue('address.city', data?.address_city);
      setValue('address.state', data?.address_state);
      setValue('address.zipCode', data?.address_zipcode);
      data?.vehicles?.map((value, i) => {
        console.log('value', value);
        setValue(`vehicles[${i}].vin`, value?.vin);
        setValue(`vehicles[${i}].year`, value?.year);
        setValue(`vehicles[${i}].makeAndModel`, value?.makeAndModel);
      });
    } catch (error) {}
  };

  const addVehicle = () => {
    if (numVehicles < 3) {
      setNumVehicles(numVehicles + 1);
    }
  };
  const removeVehicle = (index) => {
    if (numVehicles > 1) {
      setNumVehicles(numVehicles - 1);
    }
  };

  return (
    <>
      <div>
        <Modal
          isOpen={openModal}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Edit Form</h2>
          <button onClick={closeModal} className="btn btn-primary">
            close
          </button>

          <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className="main-form">
              {/* First and Last Name */}
              <div class="form-group">
                <label>First Name</label>
                <input
                  {...register('firstName', {
                    required: 'First Name is required',
                  })}
                  className="form-control"
                />
                {errors?.firstName && (
                  <p className="text-danger">{errors?.firstName?.message}</p>
                )}
              </div>

              <div class="form-group">
                <label>Last Name</label>
                <input
                  {...register('lastName', {
                    required: 'Last Name is required',
                  })}
                  className="form-control"
                />
                {errors?.lastName && (
                  <p className="text-danger">{errors?.lastName?.message}</p>
                )}
              </div>
              <div class="form-group">
                {/* Date of Birth */}
                <label>Date of Birth</label>
                <input
                  type="date"
                  {...register('dateOfBirth', {
                    required: 'Date of Birth is required',
                    validate: (value) => {
                      const dob = new Date(value);
                      const today = new Date();
                      const age = today.getFullYear() - dob.getFullYear();
                      if (age < 16) {
                        return 'You must be at least 16 years old.';
                      }
                      return true;
                    },
                  })}
                  className="form-control"
                />

                {errors?.dateOfBirth && (
                  <p className="text-danger">{errors?.dateOfBirth?.message}</p>
                )}
              </div>
              <div class="form-group">
                {/* Address */}
                <label>Street</label>
                <input
                  {...register('address.street', {
                    required: 'Street is required',
                  })}
                  className="form-control"
                />
                {errors?.address?.street && (
                  <p className="text-danger">
                    {errors?.address?.street.message}
                  </p>
                )}
              </div>
              <div class="form-group">
                <label>City</label>
                <input
                  {...register('address.city', {
                    required: 'City is required',
                  })}
                  className="form-control"
                />
                {errors?.address?.city && (
                  <p>{errors?.address?.city?.message}</p>
                )}
              </div>
              <div class="form-group">
                <label>State</label>
                <input
                  {...register('address.state', {
                    required: 'State is required',
                  })}
                  className="form-control"
                />
                {errors?.address?.state && (
                  <p className="text-danger">
                    {errors?.address?.state?.message}
                  </p>
                )}
              </div>
              <div class="form-group">
                <label>ZipCode</label>
                <input
                  type="number"
                  {...register('address.zipCode', {
                    required: 'ZipCode is required',
                    pattern: {
                      value: /^\d+$/,
                      message: 'ZipCode must be numeric',
                    },
                  })}
                  className="form-control"
                />
                {errors?.address?.zipCode && (
                  <p className="text-danger">
                    {errors?.address?.zipCode?.message}
                  </p>
                )}

                {/* Vehicle(s) */}
                {/* Repeat the same pattern for each vehicle */}
              </div>

              {/* <div class="form-group">
                <label>VIN</label>
                <input
                  {...register('vehicles[0].vin', {
                    required: 'VIN is required',
                  })}
                  className="form-control"
                />
                {errors.vehicles &&
                  errors.vehicles[0] &&
                  errors.vehicles[0].vin && (
                    <p className="text-danger">
                      {errors.vehicles[0].vin.message}
                    </p>
                  )}
              </div>
              <div class="form-group">
                <label>Year</label>
                <input
                  type="number"
                  {...register('vehicles[0].year', {
                    required: 'Year is required',
                    min: { value: 1985, message: 'Year must be at least 1985' },
                    max: {
                      value: new Date().getFullYear() + 1,
                      message: 'Year is too high',
                    },
                  })}
                  className="form-control"
                />
                {errors.vehicles &&
                  errors.vehicles[0] &&
                  errors.vehicles[0].year && (
                    <p className="text-danger">
                      {errors.vehicles[0].year.message}
                    </p>
                  )}
              </div> */}
              {/* <div class="form-group">
                <label>Make and Model</label>
                <input
                  {...register('vehicles[0].makeAndModel', {
                    required: 'Make and Model is required',
                  })}
                  className="form-control"
                />
                {errors.vehicles &&
                  errors.vehicles[0] &&
                  errors.vehicles[0].makeModel && (
                    <p className="text-danger">
                      {errors.vehicles[0].makeAndModel.message}
                    </p>
                  )}

         
              </div> */}

              {[...Array(numVehicles)].map((_, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  {numVehicles > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="btn btn-danger"
                      style={{ position: 'absolute', right: '30px' }}
                    >
                      X
                    </button>
                  )}
                  <h2>Vehicle {index + 1}</h2>
                  <div className="form-group">
                    <label>VIN</label>
                    <input
                      {...register(`vehicles[${index}].vin`, {
                        required: 'VIN is required',
                      })}
                      className="form-control"
                    />
                    {errors.vehicles &&
                      errors.vehicles[index] &&
                      errors.vehicles[index].vin && (
                        <p className="text-danger">
                          {errors.vehicles[index].vin.message}
                        </p>
                      )}
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      {...register(`vehicles[${index}].year`, {
                        required: 'Year is required',
                        min: {
                          value: 1985,
                          message: 'Year must be at least 1985',
                        },
                        max: {
                          value: new Date().getFullYear() + 1,
                          message: 'Year is too high',
                        },
                      })}
                      className="form-control"
                    />
                    {errors.vehicles &&
                      errors.vehicles[index] &&
                      errors.vehicles[index].year && (
                        <p className="text-danger">
                          {errors.vehicles[index].year.message}
                        </p>
                      )}
                  </div>
                  <div className="form-group">
                    <label>Make and Model</label>
                    <input
                      {...register(`vehicles[${index}].makeAndModel`, {
                        required: 'Make and Model is required',
                      })}
                      className="form-control"
                    />
                    {errors.vehicles &&
                      errors.vehicles[index] &&
                      errors.vehicles[index].makeAndModel && (
                        <p className="text-danger">
                          {errors.vehicles[index].makeAndModel.message}
                        </p>
                      )}
                  </div>
                </div>
              ))}
              {numVehicles < 3 && (
                <button
                  type="button"
                  onClick={addVehicle}
                  className="btn btn-success d-block m-2 text-center"
                >
                  {' '}
                  + Add More Vehicles
                </button>
              )}

              <button type="submit" class="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default OpenModal;
