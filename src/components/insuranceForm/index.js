import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InsuranceForm = () => {
  const [numVehicles, setNumVehicles] = useState(1);
  const history = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (value) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/post-application`,
        value,
      );
      history(`${data?.resumeRoute}`);
    } catch (error) {
      console.log('error', error);
    }
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
    <div className="container">
      <div className="header">
        <h1>Insurance Form</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="main-form">
        {/* First and Last Name */}
        <div class="form-group">
          <label>First Name</label>
          <input
            {...register('firstName', { required: 'First Name is required' })}
            className="form-control"
          />
          {errors?.firstName && (
            <p className="text-danger">{errors?.firstName?.message}</p>
          )}
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <input
            {...register('lastName', { required: 'Last Name is required' })}
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
            {...register('address.street', { required: 'Street is required' })}
            className="form-control"
          />
          {errors?.address?.street && (
            <p className="text-danger">{errors?.address?.street.message}</p>
          )}
        </div>
        <div class="form-group">
          <label>City</label>
          <input
            {...register('address.city', { required: 'City is required' })}
            className="form-control"
          />
          {errors?.address?.city && <p>{errors?.address?.city?.message}</p>}
        </div>
        <div class="form-group">
          <label>State</label>
          <input
            {...register('address.state', { required: 'State is required' })}
            className="form-control"
          />
          {errors?.address?.state && (
            <p className="text-danger">{errors?.address?.state?.message}</p>
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
            <p className="text-danger">{errors?.address?.zipCode?.message}</p>
          )}

          {/* Vehicle(s) */}
          {/* Repeat the same pattern for each vehicle */}
        </div>
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
                  min: { value: 1985, message: 'Year must be at least 1985' },
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
        <button
          type="submit"
          className="btn btn-primary m-5"
          style={{
            display: 'block',
            margin: 'auto',
            fontSize: '2.5rem',
            width: '90%',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InsuranceForm;
