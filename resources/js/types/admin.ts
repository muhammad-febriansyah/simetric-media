export type AdminNotification = {
    id: string;
    data: {
        consultation_request_id?: number;
        name?: string;
        company_name?: string;
        problem_area?: string;
    };
    read: boolean;
    created_at_human: string | null;
};

export type AdminSharedData = {
    newLeadsCount: number;
    notifications: {
        unreadCount: number;
        items: AdminNotification[];
    };
};
