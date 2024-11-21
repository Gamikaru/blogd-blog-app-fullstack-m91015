// src/components/modals/user-manager/ProfileTab.jsx

import { Button } from '@components';
import { userService } from '@services/api';
import { logger } from '@utils';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const ProfileTab = ({ user, setUser, showNotification, loading }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [localLoading, setLocalLoading] = useState(false);

    const profileInitialValues = {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        location: user?.location || '',
        occupation: user?.occupation || '',
        birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        profilePicture: null
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        location: Yup.string().required('Location is required'),
        occupation: Yup.string().required('Occupation is required'),
        birthDate: Yup.date()
            .required('Birth Date is required')
            .max(new Date(), 'Birth Date cannot be in the future'),
        profilePicture: Yup.mixed()
            .test('fileSize', 'File too large (Max: 5MB)', value =>
                !value || (value && value.size <= 5242880))
            .test('fileFormat', 'Unsupported Format (Only JPG, JPEG, PNG, GIF, WEBP)', value =>
                !value || (value && ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type)))
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setLocalLoading(true);
        try {
            const formData = new FormData();
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('email', values.email);
            formData.append('location', values.location);
            formData.append('occupation', values.occupation);
            formData.append('birthDate', values.birthDate);
            if (values.profilePicture) {
                formData.append('profilePicture', values.profilePicture);
            }

            const updatedUser = await userService.updateProfile(user.userId, formData);
            setUser(updatedUser);
            showNotification('Profile updated successfully!', 'success');
            navigate('/profile');
        } catch (error) {
            logger.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            showNotification(errorMessage, 'error');
            setFieldError('general', errorMessage);
        } finally {
            setLocalLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={profileInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, errors, touched, setFieldValue }) => (
                <Form className="usermanager-content__form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <Field type="text" id="firstName" name="firstName" placeholder="Enter first name" />
                        {errors.firstName && touched.firstName && (
                            <div className="error">{errors.firstName}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <Field type="text" id="lastName" name="lastName" placeholder="Enter last name" />
                        {errors.lastName && touched.lastName && (
                            <div className="error">{errors.lastName}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Field type="email" id="email" name="email" placeholder="Enter email" />
                        {errors.email && touched.email && (
                            <div className="error">{errors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <Field type="text" id="location" name="location" placeholder="Enter location" />
                        {errors.location && touched.location && (
                            <div className="error">{errors.location}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="occupation">Occupation</label>
                        <Field type="text" id="occupation" name="occupation" placeholder="Enter occupation" />
                        {errors.occupation && touched.occupation && (
                            <div className="error">{errors.occupation}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthDate">Birth Date</label>
                        <Field type="date" id="birthDate" name="birthDate" />
                        {errors.birthDate && touched.birthDate && (
                            <div className="error">{errors.birthDate}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="profilePicture">Profile Picture</label>
                        <input
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                setFieldValue('profilePicture', event.currentTarget.files[0]);
                            }}
                        />
                        {errors.profilePicture && touched.profilePicture && (
                            <div className="error">{errors.profilePicture}</div>
                        )}
                    </div>

                    {errors.general && (
                        <div className="error general-error">{errors.general}</div>
                    )}

                    <Button
                        type="submit"
                        className="usermanager-content__submit"
                        disabled={isSubmitting || loading || localLoading}
                        variant="submit"
                    >
                        {localLoading ? 'Saving...' : 'Save Profile Settings'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

ProfileTab.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        location: PropTypes.string,
        occupation: PropTypes.string,
        birthDate: PropTypes.string,
    }).isRequired,
    setUser: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

ProfileTab.displayName = 'ProfileTab';

export default ProfileTab;
