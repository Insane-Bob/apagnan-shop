export interface UserNotificationPreferences{
    active: boolean;
    activatedCount: number;
    deactivatedCount: number;
    ids: number[];
}

export interface UserNotificationPreferencesObject{
    [key: string]: UserNotificationPreferences
}