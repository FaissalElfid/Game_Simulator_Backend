import { Badge } from "../model/badge.model";

export interface IBadge {
    title: string;
    description: string;
    pronos: number;
    level: string; // none, bronze, silver, gold
}
export interface BadgeSaveI {
    badge: Badge;  // none, bronze, silver, gold
    challengeId: string;
}
export interface BadgeDeleteI {
    badgeId: string;
    challengeId: string;
}
export interface BadgeUpdateI {
    idBadge: string;
    idChallenge: string;
    badge: Badge;
}
export interface IBadgeId {
    id: string;
    title: string;
    description: string;
    pronos: number;
    level: string;
}