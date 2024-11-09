// SecurityTab.jsx
import { Logger, UserService } from '@components';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import React from 'react';

const SecurityTab = ({ user, setUser, showNotification, loading, setLoading }) => {
    const securityInitialValues = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false
    };

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setLoading(true);
        const formData = { ...values };

        try {
            const updatedUser = await UserService.updateProfile(user._id, formData);
            setUser(updatedUser);
            showNotification('Settings updated successfully!', 'success');
        } catch (error) {
            Logger.error('Error updating settings:', error);
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
            initialValues={securityInitialValues}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="usermanager-content__form">
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <Field
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <Field
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <Field
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="form-group">
                        <label>Two-Factor Authentication</label>
                        <motion.button
                            type="button"
                            className="security-button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Enable 2FA
                        </motion.button>
                    </div>

                    <div className="form-group">
                        <label>Active Sessions</label>
                        <motion.button
                            type="button"
                            className="security-button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Manage Sessions
                        </motion.button>
                    </div>

                    <motion.button className="button button-delete" type="button">
                        Delete Account
                    </motion.button>
                    <motion.button className="button button-submit" type="button">
                        Update Security
                    </motion.button>

                </Form>
            )}
        </Formik>
    );
};

export default SecurityTab;