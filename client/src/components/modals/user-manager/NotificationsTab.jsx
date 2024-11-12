// NotificationsTab.jsx
//Desc: NotificationsTab component to manage user notification settings
import { Button } from '@components';
import { UserService } from '@services/api';
import { logger } from '@utils';
import { Field, Form, Formik } from 'formik';

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

    const handleEditNotifications = () => {
        // Add your edit logic here
    };

    return (
        <Formik
            initialValues={notificationInitialValues}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="usermanager-content__form">
                    <div className="form-group">
                        <label>Email Notifications</label>
                        <div className="notification-options">
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

                    <div className="form-group">
                        <label>Push Notifications</label>
                        <div className="notification-options">
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

                    <div className="form-group">
                        <label htmlFor="notificationFrequency">Notification Frequency</label>
                        <Field as="select" id="notificationFrequency" name="notificationFrequency">
                            <option value="immediate">Immediate</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </Field>
                    </div>

                    <Button
                        variant="submit"
                        onClick={handleEditNotifications}
                        className="button button-edit"

                    >
                        Save
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default NotificationsTab;