<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PreferenceBackup extends Model
{
    protected $guarded = [];

    protected $casts = [
        'settings' => 'array'
    ];

    /**
     * Get the user that created the backup
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
} 