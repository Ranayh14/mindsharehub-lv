<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'comment_id',
        'reported_by',
        'reason',
        'description',
        'status'
    ];

    public function post() {
        return $this->belongsTo(Post::class);
    }

    public function comment() {
        return $this->belongsTo(Comment::class);
    }

    public function reporter() {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
