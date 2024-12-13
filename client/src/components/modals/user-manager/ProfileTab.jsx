// src/components/modals/user-manager/ProfileTab.jsx

import { Button } from '@components';
import { useUserUpdate } from '@contexts';
import { logger } from '@utils';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';

const ProfileTab = ({ user, showNotification, loading }) => {
    const { updateUser } = useUserUpdate(); // Get updateUser from context
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

            // Use updateUser from context instead of setUser
            await updateUser(user.userId, formData);

            showNotification('Profile updated successfully!', 'success');
        } catch (error) {
            logger.error('Error updating profile:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Failed to update profile';
            showNotification(errorMessage, 'error');
            setFieldError('general', errorMessage);
        } finally {
            setLocalLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="profile-tab">
            <Formik
                initialValues={profileInitialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, setFieldValue }) => (
                    <Form className="profile-tab__form">
                        <div className="profile-tab__form-group">
                            <label htmlFor="firstName">First Name</label>
                            <Field type="text" id="firstName" name="firstName" placeholder="Enter first name" />
                            {errors.firstName && touched.firstName && (
                                <div className="profile-tab__error">{errors.firstName}</div>
                            )}
                        </div>

                        <div className="profile-tab__form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <Field type="text" id="lastName" name="lastName" placeholder="Enter last name" />
                            {errors.lastName && touched.lastName && (
                                <div className="profile-tab__error">{errors.lastName}</div>
                            )}
                        </div>

                        <div className="profile-tab__form-group">
                            <label htmlFor="email">Email</label>
                            <Field type="email" id="email" name="email" placeholder="Enter email" />
                            {errors.email && touched.email && (
                                <div className="profile-tab__error">{errors.email}</div>
                            )}
                        </div>

                        <div className="profile-tab__form-group">
                            <label htmlFor="location">Location</label>
                            <Field type="text" id="location" name="location" placeholder="Enter location" />
                            {errors.location && touched.location && (
                                <div className="profile-tab__error">{errors.location}</div>
                            )}
                        </div>

                        <div className="profile-tab__form-group">
                            <label htmlFor="occupation">Occupation</label>
                            <Field type="text" id="occupation" name="occupation" placeholder="Enter occupation" />
                            {errors.occupation && touched.occupation && (
                                <div className="profile-tab__error">{errors.occupation}</div>
                            )}
                        </div>

                        <div className="profile-tab__form-group">
                            <label htmlFor="birthDate">Birth Date</label>
                            <Field type="date" id="birthDate" name="birthDate" />
                            {errors.birthDate && touched.birthDate && (
                                <div className="profile-tab__error">{errors.birthDate}</div>
                            )}
                        </div>

                        <div className="profile-tab__form-group">
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
                                <div className="profile-tab__error">{errors.profilePicture}</div>
                            )}
                        </div>

                        {errors.general && (
                            <div className="profile-tab__error profile-tab__general-error">
                                {errors.general}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting || loading || localLoading}
                            variant="submit"
                        >
                            {localLoading ? 'Saving...' : 'Save Profile Settings'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
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
    showNotification: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

ProfileTab.displayName = 'ProfileTab';

export default ProfileTab;