import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    {message}
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const Tooltip = ({ children, content }) => {
    const [show, setShow] = useState(false);
    
    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="inline-flex items-center"
            >
                {children}
                <i className="fas fa-question-circle ml-1 text-gray-400 hover:text-gray-600" />
            </div>
            {show && (
                <div className="absolute z-10 w-64 px-4 py-2 mt-2 text-sm text-gray-500 bg-white border rounded shadow-lg">
                    {content}
                </div>
            )}
        </div>
    );
};

const AuditLogEntry = ({ entry }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
        <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="fas fa-history text-purple-600" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
                {entry.user.name}
            </p>
            <p className="text-sm text-gray-500">
                {entry.action}
            </p>
            <p className="text-xs text-gray-400 mt-1">
                {new Date(entry.timestamp).toLocaleString()}
            </p>
        </div>
    </div>
);

export default function PreferencesManagement() {
    const [preferences, setPreferences] = useState({
        site: {
            name: '',
            description: '',
            maintenance_mode: false,
            registration_enabled: true,
        },
        content: {
            max_post_length: 1000,
            max_diary_length: 5000,
            allowed_file_types: [],
            max_file_size: 5,
        },
        moderation: {
            auto_flag_keywords: [],
            require_approval: false,
            max_reports_before_hide: 5,
        },
        notifications: {
            email_notifications: true,
            digest_frequency: 'daily',
            admin_email: '',
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('site');
    const [isSaving, setIsSaving] = useState(false);
    const [newKeyword, setNewKeyword] = useState('');
    const [newFileType, setNewFileType] = useState('');
    const [errors, setErrors] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
    });
    const [auditLog, setAuditLog] = useState([]);
    const [showAuditLog, setShowAuditLog] = useState(false);
    const [isAuditLogLoading, setIsAuditLogLoading] = useState(false);
    const [backups, setBackups] = useState([]);
    const [showBackups, setShowBackups] = useState(false);
    const [isBackupsLoading, setIsBackupsLoading] = useState(false);
    const [backupName, setBackupName] = useState('');
    const [isCreatingBackup, setIsCreatingBackup] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    useEffect(() => {
        if (showAuditLog) {
            loadAuditLog();
        }
    }, [showAuditLog]);

    useEffect(() => {
        if (showBackups) {
            loadBackups();
        }
    }, [showBackups]);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPreferences();
            setPreferences(response.data);
        } catch (error) {
            setError('Failed to load preferences');
            console.error('Error loading preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAuditLog = async () => {
        try {
            setIsAuditLogLoading(true);
            const response = await adminService.getPreferencesAuditLog();
            setAuditLog(response.data);
        } catch (error) {
            console.error('Error loading audit log:', error);
            setError('Failed to load audit log');
        } finally {
            setIsAuditLogLoading(false);
        }
    };

    const loadBackups = async () => {
        try {
            setIsBackupsLoading(true);
            const response = await adminService.getPreferencesBackups();
            setBackups(response.data);
        } catch (error) {
            console.error('Error loading backups:', error);
            setError('Failed to load backups');
        } finally {
            setIsBackupsLoading(false);
        }
    };

    const validatePreferences = () => {
        const newErrors = {};

        // Site validation
        if (!preferences.site.name.trim()) {
            newErrors.siteName = 'Site name is required';
        }
        if (!preferences.site.description.trim()) {
            newErrors.siteDescription = 'Site description is required';
        }

        // Content validation
        if (preferences.content.max_post_length < 1) {
            newErrors.maxPostLength = 'Maximum post length must be at least 1';
        }
        if (preferences.content.max_diary_length < 1) {
            newErrors.maxDiaryLength = 'Maximum diary length must be at least 1';
        }
        if (preferences.content.max_file_size < 1) {
            newErrors.maxFileSize = 'Maximum file size must be at least 1MB';
        }

        // Moderation validation
        if (preferences.moderation.max_reports_before_hide < 1) {
            newErrors.maxReports = 'Number of reports must be at least 1';
        }

        // Notification validation
        if (preferences.notifications.email_notifications && !preferences.notifications.admin_email) {
            newErrors.adminEmail = 'Admin email is required when notifications are enabled';
        }
        if (preferences.notifications.admin_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(preferences.notifications.admin_email)) {
            newErrors.adminEmail = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validatePreferences()) {
            return;
        }

        try {
            setIsSaving(true);
            await adminService.updatePreferences(preferences);
            // Log the changes
            const changes = [];
            if (preferences.site.maintenance_mode) {
                changes.push('Enabled maintenance mode');
            }
            if (!preferences.site.registration_enabled) {
                changes.push('Disabled user registration');
            }
            if (preferences.moderation.require_approval) {
                changes.push('Enabled post approval requirement');
            }
            // Add the change to the audit log immediately for better UX
            setAuditLog(prev => [{
                id: Date.now(),
                user: { name: 'Current Admin' }, // Replace with actual user info
                action: `Updated preferences: ${changes.join(', ')}`,
                timestamp: new Date().toISOString()
            }, ...prev]);
            
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error('Error saving preferences:', error);
            setError('Failed to save preferences. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddKeyword = (e) => {
        e.preventDefault();
        const keyword = newKeyword.trim();
        
        if (!keyword) return;
        
        // Check for duplicate keywords
        if (preferences.moderation.auto_flag_keywords.includes(keyword)) {
            setErrors(prev => ({
                ...prev,
                keyword: 'This keyword already exists'
            }));
            return;
        }

        setPreferences(prev => ({
            ...prev,
            moderation: {
                ...prev.moderation,
                auto_flag_keywords: [...prev.moderation.auto_flag_keywords, keyword]
            }
        }));
        setNewKeyword('');
        setErrors(prev => ({ ...prev, keyword: null }));
    };

    const handleRemoveKeyword = (keyword) => {
        setPreferences(prev => ({
            ...prev,
            moderation: {
                ...prev.moderation,
                auto_flag_keywords: prev.moderation.auto_flag_keywords.filter(k => k !== keyword)
            }
        }));
    };

    const handleAddFileType = (e) => {
        e.preventDefault();
        const fileType = newFileType.trim();
        
        if (!fileType) return;
        
        // Basic file type validation
        if (!fileType.startsWith('.')) {
            setErrors(prev => ({
                ...prev,
                fileType: 'File type must start with a dot (e.g., .jpg)'
            }));
            return;
        }

        setPreferences(prev => ({
            ...prev,
            content: {
                ...prev.content,
                allowed_file_types: [...prev.content.allowed_file_types, fileType]
            }
        }));
        setNewFileType('');
        setErrors(prev => ({ ...prev, fileType: null }));
    };

    const handleRemoveFileType = (fileType) => {
        setPreferences(prev => ({
            ...prev,
            content: {
                ...prev.content,
                allowed_file_types: prev.content.allowed_file_types.filter(t => t !== fileType)
            }
        }));
    };

    // Update site maintenance mode with confirmation
    const handleMaintenanceModeChange = (checked) => {
        if (checked) {
            setConfirmationConfig({
                title: 'Enable Maintenance Mode?',
                message: 'This will make the site inaccessible to regular users. Only administrators will be able to access the site.',
                onConfirm: () => {
                    setPreferences(prev => ({
                        ...prev,
                        site: { ...prev.site, maintenance_mode: true }
                    }));
                    setShowConfirmation(false);
                }
            });
            setShowConfirmation(true);
        } else {
            setPreferences(prev => ({
                ...prev,
                site: { ...prev.site, maintenance_mode: false }
            }));
        }
    };

    // Update registration status with confirmation
    const handleRegistrationChange = (checked) => {
        if (!checked) {
            setConfirmationConfig({
                title: 'Disable User Registration?',
                message: 'This will prevent new users from registering on the site. Existing users will not be affected.',
                onConfirm: () => {
                    setPreferences(prev => ({
                        ...prev,
                        site: { ...prev.site, registration_enabled: false }
                    }));
                    setShowConfirmation(false);
                }
            });
            setShowConfirmation(true);
        } else {
            setPreferences(prev => ({
                ...prev,
                site: { ...prev.site, registration_enabled: true }
            }));
        }
    };

    // Update post approval requirement with confirmation
    const handleRequireApprovalChange = (checked) => {
        if (checked) {
            setConfirmationConfig({
                title: 'Enable Post Approval Requirement?',
                message: 'This will require all new posts to be approved by a moderator before they become visible. This may increase moderator workload.',
                onConfirm: () => {
                    setPreferences(prev => ({
                        ...prev,
                        moderation: { ...prev.moderation, require_approval: true }
                    }));
                    setShowConfirmation(false);
                }
            });
            setShowConfirmation(true);
        } else {
            setPreferences(prev => ({
                ...prev,
                moderation: { ...prev.moderation, require_approval: false }
            }));
        }
    };

    const handleCreateBackup = async (e) => {
        e.preventDefault();
        if (!backupName.trim()) return;

        try {
            setIsCreatingBackup(true);
            await adminService.createPreferencesBackup({
                name: backupName.trim(),
                preferences
            });
            setBackupName('');
            loadBackups();
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error('Error creating backup:', error);
            setError('Failed to create backup');
        } finally {
            setIsCreatingBackup(false);
        }
    };

    const handleRestoreBackup = async (backupId) => {
        try {
            setIsRestoring(true);
            const response = await adminService.restorePreferencesBackup(backupId);
            setPreferences(response.data);
            setShowBackups(false);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error('Error restoring backup:', error);
            setError('Failed to restore backup');
        } finally {
            setIsRestoring(false);
        }
    };

    const handleDeleteBackup = async (backupId) => {
        if (!confirm('Are you sure you want to delete this backup?')) return;

        try {
            await adminService.deletePreferencesBackup(backupId);
            loadBackups();
        } catch (error) {
            console.error('Error deleting backup:', error);
            setError('Failed to delete backup');
        }
    };

    const SuccessMessage = () => (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
            <div className="flex items-center">
                <i className="fas fa-check-circle mr-2" />
                <span>Preferences saved successfully!</span>
            </div>
        </div>
    );

    const ErrorMessage = ({ message }) => (
        <p className="mt-1 text-sm text-red-600">{message}</p>
    );

    const AuditLogDialog = () => {
        if (!showAuditLog) return null;

        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Preferences Audit Log
                        </h3>
                        <button
                            onClick={() => setShowAuditLog(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
                        {isAuditLogLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : auditLog.length > 0 ? (
                            <div className="space-y-2">
                                {auditLog.map(entry => (
                                    <AuditLogEntry key={entry.id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No changes have been recorded yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const BackupsDialog = () => {
        if (!showBackups) return null;

        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Preferences Backups
                        </h3>
                        <button
                            onClick={() => setShowBackups(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <div className="px-6 py-4">
                        <form onSubmit={handleCreateBackup} className="mb-6">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={backupName}
                                    onChange={(e) => setBackupName(e.target.value)}
                                    placeholder="Backup name"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isCreatingBackup}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {isCreatingBackup ? 'Creating...' : 'Create Backup'}
                                </button>
                            </div>
                        </form>

                        <div className="overflow-y-auto max-h-[50vh]">
                            {isBackupsLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                </div>
                            ) : backups.length > 0 ? (
                                <div className="space-y-4">
                                    {backups.map(backup => (
                                        <div
                                            key={backup.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {backup.name}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    Created {new Date(backup.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleRestoreBackup(backup.id)}
                                                    disabled={isRestoring}
                                                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                                >
                                                    {isRestoring ? 'Restoring...' : 'Restore'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBackup(backup.id)}
                                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    No backups available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveSection('site')}
                        className={`px-4 py-2 rounded-md ${
                            activeSection === 'site'
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Site Settings
                    </button>
                    <button
                        onClick={() => setActiveSection('content')}
                        className={`px-4 py-2 rounded-md ${
                            activeSection === 'content'
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Content Settings
                    </button>
                    <button
                        onClick={() => setActiveSection('moderation')}
                        className={`px-4 py-2 rounded-md ${
                            activeSection === 'moderation'
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Moderation
                    </button>
                    <button
                        onClick={() => setActiveSection('notifications')}
                        className={`px-4 py-2 rounded-md ${
                            activeSection === 'notifications'
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Notifications
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowBackups(true)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center"
                    >
                        <i className="fas fa-save mr-2" />
                        Backups
                    </button>
                    <button
                        onClick={() => setShowAuditLog(true)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center"
                    >
                        <i className="fas fa-history mr-2" />
                        View Changes
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {activeSection === 'site' && (
                    <div className="space-y-6">
                        <div>
                            <Tooltip content="The name that appears in the browser title and throughout the site">
                                <label className="block text-sm font-medium text-gray-700">
                                    Site Name
                                </label>
                            </Tooltip>
                            <input
                                type="text"
                                value={preferences.site.name}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    site: { ...prev.site, name: e.target.value }
                                }))}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                                    errors.siteName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.siteName && <ErrorMessage message={errors.siteName} />}
                        </div>
                        <div>
                            <Tooltip content="A brief description of your site that appears in search results">
                                <label className="block text-sm font-medium text-gray-700">
                                    Site Description
                                </label>
                            </Tooltip>
                            <textarea
                                value={preferences.site.description}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    site: { ...prev.site, description: e.target.value }
                                }))}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <Tooltip content="When enabled, only administrators can access the site">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={preferences.site.maintenance_mode}
                                        onChange={(e) => handleMaintenanceModeChange(e.target.checked)}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
                                </label>
                            </Tooltip>
                            <Tooltip content="Controls whether new users can create accounts">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={preferences.site.registration_enabled}
                                        onChange={(e) => handleRegistrationChange(e.target.checked)}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Enable Registration</span>
                                </label>
                            </Tooltip>
                        </div>
                    </div>
                )}

                {activeSection === 'content' && (
                    <div className="space-y-6">
                        <div>
                            <Tooltip content="Maximum number of characters allowed in a single post">
                                <label className="block text-sm font-medium text-gray-700">
                                    Maximum Post Length
                                </label>
                            </Tooltip>
                            <input
                                type="number"
                                value={preferences.content.max_post_length}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    content: { ...prev.content, max_post_length: parseInt(e.target.value) }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <Tooltip content="Maximum number of characters allowed in a single diary entry">
                                <label className="block text-sm font-medium text-gray-700">
                                    Maximum Diary Length
                                </label>
                            </Tooltip>
                            <input
                                type="number"
                                value={preferences.content.max_diary_length}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    content: { ...prev.content, max_diary_length: parseInt(e.target.value) }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <Tooltip content="Maximum file size allowed for uploads">
                                <label className="block text-sm font-medium text-gray-700">
                                    Maximum File Size (MB)
                                </label>
                            </Tooltip>
                            <input
                                type="number"
                                value={preferences.content.max_file_size}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    content: { ...prev.content, max_file_size: parseInt(e.target.value) }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <Tooltip content="Allowed file types for uploads">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Allowed File Types
                                </label>
                            </Tooltip>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {preferences.content.allowed_file_types.map(type => (
                                    <span
                                        key={type}
                                        className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {type}
                                        <button
                                            onClick={() => handleRemoveFileType(type)}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <form onSubmit={handleAddFileType} className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={newFileType}
                                        onChange={(e) => setNewFileType(e.target.value)}
                                        placeholder="Add file type (e.g., .jpg)"
                                        className={`w-full rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                                            errors.fileType ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.fileType && <ErrorMessage message={errors.fileType} />}
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeSection === 'moderation' && (
                    <div className="space-y-6">
                        <div>
                            <Tooltip content="Keywords that will automatically flag posts">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Auto-flag Keywords
                                </label>
                            </Tooltip>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {preferences.moderation.auto_flag_keywords.map(keyword => (
                                    <span
                                        key={keyword}
                                        className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {keyword}
                                        <button
                                            onClick={() => handleRemoveKeyword(keyword)}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <form onSubmit={handleAddKeyword} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    placeholder="Add keyword to auto-flag"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Tooltip content="Require all new posts to be approved by a moderator">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={preferences.moderation.require_approval}
                                        onChange={(e) => handleRequireApprovalChange(e.target.checked)}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Require Approval for New Posts
                                    </span>
                                </label>
                            </Tooltip>
                        </div>
                        <div>
                            <Tooltip content="Content will be automatically hidden after this many reports">
                                <label className="block text-sm font-medium text-gray-700">
                                    Auto-hide Content After Reports
                                </label>
                            </Tooltip>
                            <input
                                type="number"
                                value={preferences.moderation.max_reports_before_hide}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    moderation: { ...prev.moderation, max_reports_before_hide: parseInt(e.target.value) }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'notifications' && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Tooltip content="Enable email notifications for important system updates">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications.email_notifications}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            notifications: { ...prev.notifications, email_notifications: e.target.checked }
                                        }))}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Enable Email Notifications
                                    </span>
                                </label>
                            </Tooltip>
                        </div>
                        <div>
                            <Tooltip content="Frequency of digest emails">
                                <label className="block text-sm font-medium text-gray-700">
                                    Digest Frequency
                                </label>
                            </Tooltip>
                            <select
                                value={preferences.notifications.digest_frequency}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    notifications: { ...prev.notifications, digest_frequency: e.target.value }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <Tooltip content="Important system notifications will be sent to this address">
                                <label className="block text-sm font-medium text-gray-700">
                                    Admin Email Address
                                </label>
                            </Tooltip>
                            <input
                                type="email"
                                value={preferences.notifications.admin_email}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    notifications: { ...prev.notifications, admin_email: e.target.value }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationDialog
                isOpen={showConfirmation}
                onConfirm={confirmationConfig.onConfirm}
                onCancel={() => setShowConfirmation(false)}
                title={confirmationConfig.title}
                message={confirmationConfig.message}
            />

            <AuditLogDialog />
            <BackupsDialog />

            {showSuccessMessage && <SuccessMessage />}
        </div>
    );
} 