<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id', 'user_id', 'parent_id', 'comment', 'likes'
    ];

    public function post() {
        return $this->belongsTo(Post::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function parent() {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function likes() {
        return $this->hasMany(CommentLike::class);
    }

    public function reports() {
        return $this->hasMany(CommentReport::class);
    }

    public function likedUsers() 
    {
        return $this->belongsToMany(User::class,'comment_likes')
                    ->withTimestamps();
    }

    protected $appends = ['is_liked','likes_count','created_at_human'];

    public function getIsLikedAttribute(): bool
    {
        return Auth::check() && $this->likedUsers
               ->contains(fn ($u) => $u->id === Auth::id());
    }

    public function getTotalLikesAttribute(): int
    {
        return $this->likedUsers()->count();
    }

    public function getCreatedAtHumanAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    // app/Models/Comment.php

    public function getLikesCountAttribute(): int
    {
        return $this->likes()->count();  // Menghitung jumlah likes terkait dengan komentar ini
    }
}
