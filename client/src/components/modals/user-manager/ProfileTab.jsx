// src/components/modals/user-manager/ProfileTab.jsx

import { UserService } from '@services/api';
import { logger } from '@utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import * as Yup from 'yup';



const ProfileTab = ({ user, setUser, showNotification }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    // Remove loading state from props and manage locally if needed

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
        try {
            await UserService.updateProfile(user.userId, values);
            setUser(updatedUser);
            showNotification('Settings updated successfully!', 'success');
        } catch (error) {
            // Handle error
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewProfile = () => {
        navigate('/profile'); // Navigate to the profile page
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

                    <div className="form-actions">
                        <motion.button
                            type="submit"
                            className="button button-edit"
                            disabled={isSubmitting}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Profile'}
                        </motion.button>

                        <motion.button
                            type="button"
                            className="button button-view-profile"
                            onClick={handleViewProfile}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View Profile
                        </motion.button>
                    </div>
                </Form>
            )}
        </Formik>
    );

};

export default ProfileTab;