<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content',
        'image_path',
        'likes_count'
    ];

    /**
     * Tambahkan attribute custom otomatis di-serialize
     */
protected $appends = ['is_liked','created_at_human','total_comments','likes_count'];

    /**
     * Relasi ke User pemilik post
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi postLikes (jika perlu melacak raw PostLike)
     */
    public function postLikes()
    {
        return $this->hasMany(PostLike::class);
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'post_likes', 'post_id', 'user_id');
    }

    /**
     * Relasi many-to-many ke User yang menyukai post
     */
    public function likedUsers()
    {
        return $this->belongsToMany(User::class, 'post_likes')
                    ->withTimestamps();
    }

    /**
     * Relasi komentar
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Relasi laporan
     */
    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    /**
     * Accessor: is_liked
     */
    public function getIsLikedAttribute(): bool
    {
        if (! Auth::check()) {
            return false;
        }
        return $this->likedUsers->contains(fn($user) => $user->id === Auth::id());
    }

    /**
     * Accessor: created_at_human
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    /**
     * Accessor: total_comments
     */
    public function getTotalCommentsAttribute(): int
    {
        return $this->comments()->count();
    }

    public function getLikesCountAttribute()
    {
        return $this->likedUsers()->count();
    }
}
