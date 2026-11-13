<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Mark one of the user's notifications as read and open the related lead.
     */
    public function read(Request $request, string $notification): RedirectResponse
    {
        $databaseNotification = $request->user()->notifications()->findOrFail($notification);
        $databaseNotification->markAsRead();

        $leadId = $databaseNotification->data['consultation_request_id'] ?? null;

        return $leadId
            ? to_route('admin.leads.show', $leadId)
            : back();
    }

    /**
     * Mark all of the user's notifications as read.
     */
    public function readAll(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }
}
