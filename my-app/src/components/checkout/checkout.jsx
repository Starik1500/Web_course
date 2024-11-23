import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/actions';
import Header from '../header/header.jsx';
import Footer from '../footer/footer.jsx';
import './checkout.css';

const validationSchema   = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  
  email: Yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format. Example: user@example.com'
    ),
    
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),

  address: Yup.string()
    .required('Address is required')
    .max(100, 'Address must be less than 100 characters'),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const user_adress = user ? user.userId : null;

  if (!user_adress) {
    console.error('User not logged in. Redirecting to login.');
    navigate('/login'); 
    return null;
  }

  return (
    <React.Fragment>
    <Header/>
    <div className="container">
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Submitted values:', values);
          dispatch(clearCart(user_adress));
          console.log('Dispatching clearCart with user_adress:', user_adress);
          navigate('/success');
        }}
      >
        <Form className="checkout-form">
          <h2 className="form-title">Checkout</h2>
          <div className="form-field">
            <label className="formik-label" htmlFor="firstName">First Name</label>
            <Field type="text" id="firstName" name="firstName" />
            <ErrorMessage name="firstName" component="div" className="error-message" />
          </div>

          <div className="form-field">
            <label className="formik-label" htmlFor="lastName">Last Name</label>
            <Field type="text" id="lastName" name="lastName" />
            <ErrorMessage name="lastName" component="div" className="error-message" />
          </div>

          <div className="form-field">
            <label className="formik-label" htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error-message" />
          </div>

          <div className="form-field">
            <label className="formik-label" htmlFor="phone">Phone</label>
            <Field type="text" id="phone" name="phone" />
            <ErrorMessage name="phone" component="div" className="error-message" />
          </div>

          <div className="form-field">
            <label className="formik-label" htmlFor="address">Address</label>
            <Field type="text" id="address" name="address" />
            <ErrorMessage name="address" component="div" className="error-message" />
          </div>

          <div className="button-container">
            <button onClick={() => navigate(-1)} className="button back-button">
              Back
            </button>
            <button className="button submit-button" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
    <Footer/>
    </React.Fragment>
  );
};

export default CheckoutPage;