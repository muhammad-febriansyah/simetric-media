<?php

namespace App\Notifications;

use App\Models\ConsultationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewConsultationRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public ConsultationRequest $consultationRequest) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * The bell notification is stored right away; only the email goes through the queue.
     *
     * @return array<string, string>
     */
    public function viaConnections(): array
    {
        return [
            'database' => 'sync',
        ];
    }

    /**
     * Get the email sent to admins.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $lead = $this->consultationRequest;

        return (new MailMessage)
            ->subject('Lead baru: '.$lead->name.' ('.$lead->company_name.')')
            ->greeting('Ada permintaan konsultasi baru')
            ->line('**'.$lead->name.'** dari **'.$lead->company_name.'** mengirim permintaan konsultasi.')
            ->line('Area masalah: '.$lead->problem_area->label())
            ->line('Kontak: '.$lead->email.' · '.$lead->phone)
            ->action('Buka lead', route('admin.leads.show', $lead))
            ->line('Segera tindak lanjuti maksimal 1 hari kerja.');
    }

    /**
     * Get the array representation of the notification shown in the admin bell.
     *
     * @return array{consultation_request_id: int, name: string, company_name: string, problem_area: string}
     */
    public function toArray(object $notifiable): array
    {
        return [
            'consultation_request_id' => $this->consultationRequest->id,
            'name' => $this->consultationRequest->name,
            'company_name' => $this->consultationRequest->company_name,
            'problem_area' => $this->consultationRequest->problem_area->label(),
        ];
    }
}
