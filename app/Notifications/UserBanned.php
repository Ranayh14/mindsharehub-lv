<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserBanned extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reason;

    public function __construct($reason)
    {
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Akun Anda Telah Dinonaktifkan')
            ->line('Kami ingin memberitahukan bahwa akun Anda telah dinonaktifkan.')
            ->line('Alasan: ' . $this->reason)
            ->line('Jika Anda merasa ini adalah kesalahan, silakan hubungi tim support kami.');
    }
}
