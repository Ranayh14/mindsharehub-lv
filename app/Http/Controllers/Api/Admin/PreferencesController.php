<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Preference;
use App\Models\PreferenceAuditLog;
use App\Models\PreferenceBackup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PreferencesController extends Controller
{
    /**
     * Get all preferences
     */
    public function index()
    {
        $preferences = Preference::first();
        
        return response()->json([
            'data' => $preferences ? $preferences->settings : $this->getDefaultPreferences()
        ]);
    }

    /**
     * Update preferences
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'site.name' => 'required|string|max:255',
            'site.description' => 'required|string',
            'site.maintenance_mode' => 'required|boolean',
            'site.registration_enabled' => 'required|boolean',
            'content.max_post_length' => 'required|integer|min:1',
            'content.max_diary_length' => 'required|integer|min:1',
            'content.max_file_size' => 'required|integer|min:1',
            'content.allowed_file_types' => 'required|array',
            'content.allowed_file_types.*' => 'string',
            'moderation.auto_flag_keywords' => 'required|array',
            'moderation.auto_flag_keywords.*' => 'string',
            'moderation.require_approval' => 'required|boolean',
            'moderation.max_reports_before_hide' => 'required|integer|min:1',
            'notifications.email_notifications' => 'required|boolean',
            'notifications.digest_frequency' => 'required|string|in:daily,weekly,monthly',
            'notifications.admin_email' => 'required_if:notifications.email_notifications,true|email|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $preferences = Preference::firstOrCreate([]);
        $oldSettings = $preferences->settings;
        $preferences->settings = $request->all();
        $preferences->save();

        // Log the changes
        $changes = $this->getChanges($oldSettings, $preferences->settings);
        if (!empty($changes)) {
            PreferenceAuditLog::create([
                'user_id' => Auth::id(),
                'changes' => $changes,
                'action' => 'Updated preferences: ' . implode(', ', array_keys($changes))
            ]);
        }

        return response()->json([
            'message' => 'Preferences updated successfully',
            'data' => $preferences->settings
        ]);
    }

    /**
     * Get audit log
     */
    public function getAuditLog()
    {
        $logs = PreferenceAuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total()
            ]
        ]);
    }

    /**
     * Get all backups
     */
    public function getBackups()
    {
        $backups = PreferenceBackup::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'data' => $backups
        ]);
    }

    /**
     * Create a new backup
     */
    public function createBackup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'preferences' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $backup = PreferenceBackup::create([
            'name' => $request->name,
            'settings' => $request->preferences,
            'created_by' => Auth::id()
        ]);

        return response()->json([
            'message' => 'Backup created successfully',
            'data' => $backup
        ]);
    }

    /**
     * Restore from backup
     */
    public function restoreBackup($id)
    {
        $backup = PreferenceBackup::findOrFail($id);
        $preferences = Preference::firstOrCreate([]);
        
        $oldSettings = $preferences->settings;
        $preferences->settings = $backup->settings;
        $preferences->save();

        // Log the restore action
        PreferenceAuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Restored preferences from backup: ' . $backup->name,
            'changes' => ['restored_from' => $backup->name]
        ]);

        return response()->json([
            'message' => 'Preferences restored successfully',
            'data' => $preferences->settings
        ]);
    }

    /**
     * Delete a backup
     */
    public function deleteBackup($id)
    {
        $backup = PreferenceBackup::findOrFail($id);
        $backup->delete();

        return response()->json([
            'message' => 'Backup deleted successfully'
        ]);
    }

    /**
     * Get default preferences
     */
    private function getDefaultPreferences()
    {
        return [
            'site' => [
                'name' => config('app.name'),
                'description' => '',
                'maintenance_mode' => false,
                'registration_enabled' => true,
            ],
            'content' => [
                'max_post_length' => 1000,
                'max_diary_length' => 5000,
                'allowed_file_types' => ['.jpg', '.jpeg', '.png', '.gif'],
                'max_file_size' => 5,
            ],
            'moderation' => [
                'auto_flag_keywords' => [],
                'require_approval' => false,
                'max_reports_before_hide' => 5,
            ],
            'notifications' => [
                'email_notifications' => true,
                'digest_frequency' => 'daily',
                'admin_email' => '',
            ]
        ];
    }

    /**
     * Get changes between old and new settings
     */
    private function getChanges($old, $new)
    {
        $changes = [];
        
        // Compare site settings
        if ($old['site']['maintenance_mode'] !== $new['site']['maintenance_mode']) {
            $changes['maintenance_mode'] = $new['site']['maintenance_mode'] ? 'enabled' : 'disabled';
        }
        if ($old['site']['registration_enabled'] !== $new['site']['registration_enabled']) {
            $changes['registration'] = $new['site']['registration_enabled'] ? 'enabled' : 'disabled';
        }

        // Compare moderation settings
        if ($old['moderation']['require_approval'] !== $new['moderation']['require_approval']) {
            $changes['post_approval'] = $new['moderation']['require_approval'] ? 'enabled' : 'disabled';
        }

        // Compare notification settings
        if ($old['notifications']['email_notifications'] !== $new['notifications']['email_notifications']) {
            $changes['email_notifications'] = $new['notifications']['email_notifications'] ? 'enabled' : 'disabled';
        }
        if ($old['notifications']['digest_frequency'] !== $new['notifications']['digest_frequency']) {
            $changes['digest_frequency'] = 'changed to ' . $new['notifications']['digest_frequency'];
        }

        return $changes;
    }
} 