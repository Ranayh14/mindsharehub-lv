<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    /**
     * User mana pun dapat membuat laporan.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Hanya admin yang boleh melihat daftar laporan.
     */
    public function viewAny(User $user): bool
    {
        return $user->roles === 'admin';
    }

    /**
     * Hanya admin yang boleh melihat detail laporan.
     */
    public function view(User $user, Report $report): bool
    {
        return $user->roles === 'admin';
    }

    /**
     * Hanya admin yang boleh meng‑hapus / men‑tindak laporan.
     */
    public function delete(User $user, Report $report): bool
    {
        return $user->roles === 'admin';
    }
}
