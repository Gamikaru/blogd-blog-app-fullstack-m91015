// src/components/AccountTab.jsx
// Desc: A tab component for the user account settings

import { Button } from '@components';
import { userService } from '@services/api';
import { logger } from '@utils';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const AccountTab = ({ user, setUser, showNotification, loading, setLoading }) => {
    const accountInitialValues = {
        username: user?.username || '',
        language: 'en',
        darkMode: false,
        accountType: 'basic'
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        language: Yup.string().required('Language is required'),
        darkMode: Yup.boolean(),
        accountType: Yup.string().oneOf(['basic', 'premium']).required('Account Type is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setLoading(true);
        try {
            const updatedUser = await userService.updateProfile(user.userId, values);
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

    const handleUpgrade = async () => {
        try {
            const updatedUser = await userService.upgradeAccount(user.userId);
            setUser(updatedUser);
            showNotification('Account upgraded successfully!', 'success');
        } catch (error) {
            logger.error('Error upgrading account:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upgrade account';
            showNotification(errorMessage, 'error');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            try {
                await userService.deleteAccount(user.userId);
                showNotification('Account deleted successfully!', 'success');
                // Redirect to login page or handle logout logic here
            } catch (error) {
                logger.error('Error deleting account:', error);
                const errorMessage = error.response?.data?.message || 'Failed to delete account';
                showNotification(errorMessage, 'error');
            }
        }
    };

    return (
        <div className="account-tab">
            <Formik
                initialValues={accountInitialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className="account-tab__form">
                        <div className="account-tab__form-group">
                            <label htmlFor="username">Username</label>
                            <Field type="text" id="username" name="username" placeholder="Change username" />
                            {errors.username && touched.username && (
                                <div className="account-tab__error">{errors.username}</div>
                            )}
                        </div>

                        <div className="account-tab__form-group">
                            <label htmlFor="language">Preferred Language</label>
                            <Field as="select" id="language" name="language">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </Field>
                            {errors.language && touched.language && (
                                <div className="account-tab__error">{errors.language}</div>
                            )}
                        </div>

                        <div className="account-tab__form-group">
                            <label>
                                <Field type="checkbox" name="darkMode" />
                                Enable Dark Mode
                            </label>
                        </div>

                        <div className="account-tab__form-group">
                            <label>
                                Account Type: {accountInitialValues.accountType.charAt(0).toUpperCase() + accountInitialValues.accountType.slice(1)}
                            </label>
                            <Button
                                type="button"
                                variant="upgrade"
                                onClick={handleUpgrade}
                            >
                                Upgrade Your Account
                            </Button>
                        </div>

                        <Button
                            type="button"
                            onClick={handleDeleteAccount}
                            variant="delete"
                            showIcon={false}
                        >
                            Delete Account
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                            variant="submit"
                        >
                            Save Account Settings
                        </Button>

                        {errors.general && (
                            <div className="account-tab__error account-tab__general-error">
                                {errors.general}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

AccountTab.propTypes = {
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
    setLoading: PropTypes.func.isRequired,
};

AccountTab.displayName = 'AccountTab';

export default AccountTab;