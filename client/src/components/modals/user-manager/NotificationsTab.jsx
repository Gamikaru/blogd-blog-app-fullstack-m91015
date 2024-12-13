// src/components/NotificationsTab.jsx
// Desc: NotificationsTab component to manage user notification settings

import { Button } from '@components';
import { userService } from '@services/api';
import { logger } from '@utils';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const NotificationsTab = ({ user, setUser, showNotification, loading, setLoading }) => {
    const notificationInitialValues = {
        emailUpdates: true,
        emailMarketing: false,
        emailSecurity: true,
        pushComments: true,
        pushMessages: true,
        pushMentions: true,
        notificationFrequency: 'immediate'
    };

    const validationSchema = Yup.object({
        emailUpdates: Yup.boolean(),
        emailMarketing: Yup.boolean(),
        emailSecurity: Yup.boolean(),
        pushComments: Yup.boolean(),
        pushMessages: Yup.boolean(),
        pushMentions: Yup.boolean(),
        notificationFrequency: Yup.string().oneOf(['immediate', 'daily', 'weekly']).required('Notification Frequency is required'),
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

    // const handleEditNotifications = () => {
    //     // Add your edit logic here
    // };

    return (
        <div className="notifications-tab">
            <Formik
                initialValues={notificationInitialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className="notifications-tab__form">
                        <div className="notifications-tab__form-group">
                            <label>Email Notifications</label>
                            <div className="notifications-tab__notification-options">
                                <label>
                                    <Field type="checkbox" name="emailUpdates" />
                                    Account Updates
                                </label>
                                <label>
                                    <Field type="checkbox" name="emailMarketing" />
                                    Marketing Emails
                                </label>
                                <label>
                                    <Field type="checkbox" name="emailSecurity" />
                                    Security Alerts
                                </label>
                            </div>
                        </div>

                        <div className="notifications-tab__form-group">
                            <label>Push Notifications</label>
                            <div className="notifications-tab__notification-options">
                                <label>
                                    <Field type="checkbox" name="pushComments" />
                                    New Comments
                                </label>
                                <label>
                                    <Field type="checkbox" name="pushMessages" />
                                    Direct Messages
                                </label>
                                <label>
                                    <Field type="checkbox" name="pushMentions" />
                                    Mentions
                                </label>
                            </div>
                        </div>

                        <div className="notifications-tab__form-group">
                            <label htmlFor="notificationFrequency">Notification Frequency</label>
                            <Field as="select" id="notificationFrequency" name="notificationFrequency">
                                <option value="immediate">Immediate</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </Field>
                            {errors.notificationFrequency && touched.notificationFrequency && (
                                <div className="notifications-tab__error">
                                    {errors.notificationFrequency}
                                </div>
                            )}
                        </div>

                        <Button
                            variant="submit"
                            disabled={isSubmitting || loading}
                        >
                            Save Notification Settings
                        </Button>

                        {errors.general && (
                            <div className="notifications-tab__error notifications-tab__general-error">
                                {errors.general}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

NotificationsTab.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        // Add other user properties as needed
    }).isRequired,
    setUser: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
};

NotificationsTab.displayName = 'NotificationsTab';

export default NotificationsTab;