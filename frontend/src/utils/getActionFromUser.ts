import { User } from '../entities/User';

export const getUserActionType = (user: User): 'Request' | 'Unfollow' | 'Follow' | 'Remove Request' => {
    console.log(user);
    if (user.follows_back) {
        return 'Unfollow';
    } else if (user.requested) {
        return 'Remove Request';
    } else if (user.userVisibility === 'public') {
        return 'Follow';
    } else {
        return 'Request';
    }
};
