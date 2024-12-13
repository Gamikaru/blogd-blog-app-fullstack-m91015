// src/components/SecurityTab.jsx

import { Button } from '@components';
import { userService } from '@services/api';
import { logger } from '@utils';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const SecurityTab = ({ user, setUser, showNotification, loading, setLoading }) => {
    const securityInitialValues = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false
    };

    const validationSchema = Yup.object({
        currentPassword: Yup.string().required('Current Password is required'),
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
        twoFactorEnabled: Yup.boolean()
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setLoading(true);
        try {
            const formData = { ...values };
            const updatedUser = await userService.updateProfile(user.userId, formData);
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

    const handleEditNotifications = () => {
        // Add your edit logic here
    };

    const handleManageSessions = () => {
        // Add your manage sessions logic here
    };

    return (
        <div className="security-tab">
            <Formik
                initialValues={securityInitialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form className="security-tab__form">
                        <div className="security-tab__form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <Field
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                placeholder="Enter current password"
                            />
                            {errors.currentPassword && touched.currentPassword && (
                                <div className="security-tab__error">{errors.currentPassword}</div>
                            )}
                        </div>

                        <div className="security-tab__form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <Field
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                placeholder="Enter new password"
                            />
                            {errors.newPassword && touched.newPassword && (
                                <div className="security-tab__error">{errors.newPassword}</div>
                            )}
                        </div>

                        <div className="security-tab__form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && touched.confirmPassword && (
                                <div className="security-tab__error">{errors.confirmPassword}</div>
                            )}
                        </div>

                        <div className="security-tab__form-group">
                            <label>Two-Factor Authentication</label>
                            <Button
                                onClick={handleEditNotifications}
                                variant="settings"
                            >
                                Enable 2FA
                            </Button>
                        </div>

                        <div className="security-tab__form-group">
                            <label>Active Sessions</label>
                            <Button
                                type="button"
                                onClick={handleManageSessions}
                                variant="settings2"
                            >
                                Manage Sessions
                            </Button>
                        </div>

                        {errors.general && (
                            <div className="security-tab__error security-tab__general-error">
                                {errors.general}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                            variant="submit"
                        >
                            Update Security Settings
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

SecurityTab.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        // other user properties if needed
    }).isRequired,
    setUser: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
};

SecurityTab.displayName = 'SecurityTab';

export default SecurityTab;