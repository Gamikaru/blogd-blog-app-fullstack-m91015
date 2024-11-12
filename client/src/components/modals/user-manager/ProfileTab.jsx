// src/components/modals/user-manager/ProfileTab.jsx

import { UserService } from '@services/api';
import { logger } from '@utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import * as Yup from 'yup';

const ProfileTab = ({ user, setUser, showNotification, loading, setLoading }) => {
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
            .test('fileFormat', 'Unsupported Format (Only JPG, JPEG, PNG)', value =>
                !value || (value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)))
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setLoading(true);
        const formData = { ...values };

        try {
            if (values.profilePicture) {
                const reader = new FileReader();
                const filePromise = new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error('File reading failed'));
                    reader.readAsDataURL(values.profilePicture);
                });

                formData.profilePicture = await filePromise;
            }

            const updatedUser = await UserService.updateProfile(user.userId, formData);
            setUser(updatedUser);
            showNotification('Settings updated successfully!', 'success');
        } catch (error) {
            logger.error('Error updating settings:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update settings';
            showNotification(errorMessage, 'error');
            setFieldError('general', errorMessage);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={profileInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, isSubmitting, errors }) => (
                <Form className="usermanager-content__form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <Field type="text" id="firstName" name="firstName" />
                        <ErrorMessage name="firstName" component="div" className="error" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <Field type="text" id="lastName" name="lastName" />
                        <ErrorMessage name="lastName" component="div" className="error" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Field type="email" id="email" name="email" />
                        <ErrorMessage name="email" component="div" className="error" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <Field type="text" id="location" name="location" />
                        <ErrorMessage name="location" component="div" className="error" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="occupation">Occupation</label>
                        <Field type="text" id="occupation" name="occupation" />
                        <ErrorMessage name="occupation" component="div" className="error" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthDate">Birth Date</label>
                        <Field type="date" id="birthDate" name="birthDate" />
                        <ErrorMessage name="birthDate" component="div" className="error" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profilePicture">Profile Picture</label>
                        <input
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                setFieldValue("profilePicture", event.currentTarget.files[0]);
                            }}
                        />
                        <ErrorMessage name="profilePicture" component="div" className="error" />
                    </div>

                    <motion.button
                        type="submit"
                        className="button button-edit"
                        disabled={isSubmitting || loading}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </motion.button>
                </Form>
            )}
        </Formik>
    );
};

export default ProfileTab;