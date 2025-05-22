<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    /**
     * Siapa pun yang login boleh membuat komentar.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Hanya pemilik komentar atau admin yang boleh meng‑edit.
     */
    public function update(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id || $user->roles === 'admin';
    }

    /**
     * Hanya pemilik komentar atau admin yang boleh meng‑hapus.
     */
    public function delete(User $user, Comment $comment): bool
    {
        return $this->update($user, $comment);
    }

    /**
     * Pengguna boleh menyukai komentar orang lain.
     */
    public function like(User $user, Comment $comment): bool
    {
        return $user->id !== $comment->user_id;
    }

    /**
     * Pengguna boleh melaporkan komentar orang lain.
     */
    public function report(User $user, Comment $comment): bool
    {
        return $this->like($user, $comment);
    }
}
