import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBadge } from '../interface/badge.interface';

import { Badge } from '../model/badge.model';
import { Challenge } from '../model/challenge.model';

@Injectable()
export class BadgeService {
  constructor(
  ) {}

  async insertBadgeInChallenge(badge: Badge, challenge: Challenge) {
    badge.level = badge.level.toLowerCase();
    if (this.verifieLevel(badge.level)) {
      challenge = this.addBadgeToChallenge(challenge, badge);
      return await challenge.save();
    } else {
      return "we can't save this badge";
    }
  }

  findBadge(challenge: Challenge, badgeId: string): Badge{
    var arrayBadges = challenge.badges.concat(
      challenge.badgeSilver,
      challenge.badgeGold,
    );
    var badge = arrayBadges.find(obj => {
      return obj.id === badgeId;
    });
    return badge;
  }

  async updateById(challenge: Challenge, badgeId: string, newBadge: Badge){    
    // this is just temporary (because we don't need this function yet)
    await this.deleteBadgeInChallenge(challenge,badgeId);
    newBadge.id = badgeId;
    return this.insertBadgeInChallenge(newBadge,challenge);
  }

  addBadgeToChallenge(challenge: Challenge, badge: Badge): Challenge {
    badge.level = badge.level.toLowerCase();

    console.log(
      'this badge is saved on the challenge ' +
        challenge.title +
        ' on the level ' +
        badge.level,
    );
    if (!challenge.reunlockable)
      if (badge.level !== 'none') {
        badge.level = 'none';
        console.log(
          'we saved this badge with level none because we have challenge lockable once',
        );
      }
    if (challenge.badges.length < 7) {
      switch (badge.level) {
        case 'none':
          challenge.badges.push(badge);
          return challenge;
        case 'bronze':
          challenge.badges.push(badge);
          return challenge;
        case 'silver':
          challenge.badgeSilver.push(badge);
          return challenge;
        case 'gold':
          challenge.badgeGold.push(badge);
          return challenge;
      }
    }
  }
  deleteFromArray(badges: [Badge], badgeId: string): [Badge]{
    var challengesbadge = badges.filter(
      badge => badge.id !== badgeId,
    );
    badges.splice(0, badges.length);
    challengesbadge.forEach(badgeElement => {
      badges.push(badgeElement);
    });
    return badges;
  }

  deleteBadgeInChallenge(challenge: Challenge, badgeId: string) {
    if (!challenge.reunlockable) {
      challenge.badges = this.deleteFromArray(challenge.badges, badgeId)
      return challenge.save();
    } else {
      var badge = this.findBadge(challenge,badgeId);
      badge.level = badge.level.toLowerCase();

      switch (badge.level) {
        case 'bronze':
          challenge.badges = this.deleteFromArray(challenge.badges, badgeId)
          return challenge.save();
        case 'silver':
          challenge.badges = this.deleteFromArray(challenge.badgeSilver, badgeId)
          return challenge.save();
        case 'gold':
          challenge.badges = this.deleteFromArray(challenge.badgeGold, badgeId)
          return challenge.save();
      }
    }
  }

  verifieLevel(level: string) {
    const levels = ['none', 'bronze', 'silver', 'gold'];
    if (!levels.includes(level)) {
      return false;
    } else return true;
  }
}
