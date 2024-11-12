// SecurityTab.jsx
import { UserService } from '@services/api';
import { logger } from '@utils';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';

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
                            className="button swiper-button-next"
                        >
                            Enable 2FA
                        </motion.button>
                    </div>

                    <div className="form-group">
                        <label>Active Sessions</label>
                        <motion.button
                            type="button"
                            className="button button-general"
                        >
                            Manage Sessions
                        </motion.button>
                    </div>

                    <motion.button className="button button-delete" type="button">
                        Delete Account
                    </motion.button>

                </Form>
            )}
        </Formik>
    );
};

export default SecurityTab;