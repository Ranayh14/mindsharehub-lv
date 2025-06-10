<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'image', 'content', 'is_published', 'send_notification'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
