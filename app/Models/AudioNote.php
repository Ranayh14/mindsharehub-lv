<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AudioNote extends Model
{
    use HasFactory;

    public $timestamps = false; // Menonaktifkan timestamps

    protected $fillable = [
        'user_id', 'file_name'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
