import { Badge } from "../model/badge.model";

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