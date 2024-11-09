// AccountTab.jsx
// Desc: A tab component for the user account settings
import { Button, Logger, UserService } from '@components';
import { Field, Form, Formik } from 'formik';
import React from 'react';

const AccountTab = ({ user, setUser, showNotification, loading, setLoading }) => {
    const accountInitialValues = {
        username: user?.username || '',
        language: 'en',
        darkMode: false,
        accountType: 'basic'
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
            initialValues={accountInitialValues}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="usermanager-content__form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Field type="text" id="username" name="username" placeholder="Change username" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="language">Preferred Language</label>
                        <Field as="select" id="language" name="language">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </Field>
                    </div>

                    <div className="form-group">
                        <label>
                            <Field type="checkbox" name="darkMode" />
                            Enable Dark Mode
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Account Type: Basic</label>
                        <Button
                            type="button"
                            className="upgrade-button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            variant="upgrade"
                        >
                            Upgrade to Premium
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="usermanager-content__submit"
                        disabled={isSubmitting || loading}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        variant="submit"
                    >
                        Save Account Settings
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default AccountTab;