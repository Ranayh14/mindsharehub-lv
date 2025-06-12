<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'users';
    protected $primaryKey = 'id';

    protected $fillable = [
        'username',
        'email',
        'password',
        'roles',
        'is_banned',
        'ban_reason',
        'ban_date',
        'profile_picture',
        'progress_percentage',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Generate random username auto
     */
    public static function generateUsername()
    {
        do {
            $u = 'user'.random_int(100, 999999);
        } while (self::where('username', $u)->exists());

        return $u;
    }

    public function contents() {
        return $this->hasMany(Content::class);
    }

    public function posts() {
        return $this->hasMany(Post::class);
    }

    public function notifications() {
        return $this->hasMany(Notification::class);
    }

    public function diaries() {
        return $this->hasMany(Diary::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function audioNotes() {
        return $this->hasMany(AudioNote::class);
    }

    public function likedPosts() {
        return $this->belongsToMany(Post::class, 'post_likes', 'user_id', 'post_id');
    }

    public function likedComments() {
        return $this->belongsToMany(Comment::class, 'comment_likes');
    }

    public function reportedPosts() {
        return $this->hasMany(Report::class, 'reported_by');
    }

    public function reports() {
        return $this->hasMany(Report::class, 'reported_by');
    }

    public function reportedComments() {
        return $this->hasMany(CommentReport::class, 'user_id');
    }
}
