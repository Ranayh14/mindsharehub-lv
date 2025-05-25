<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PreferenceAuditLog extends Model
{
    protected $guarded = [];

    protected $casts = [
        'changes' => 'array'
    ];

    /**
     * Get the user that made the change
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 