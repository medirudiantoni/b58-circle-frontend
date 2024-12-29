import Cookies from 'js-cookie';
import Suggestion from '@/components/layouts/suggestion';
import { fetchFollowerUsers } from '@/features/relation/services/follow.service';
import useUserStore from '@/hooks/userStore';
import { useEffect, useState } from 'react';

const FollowersPage = () => {
    const [followers, setFollowers] = useState<any[] | null>(null);

    const { userData } = useUserStore();

    useEffect(() => {
        retrieveFollowerUsers()
    }, [userData]);

    function retrieveFollowerUsers() {
        const token = Cookies.get('token')!;
        fetchFollowerUsers(token, userData!.id)
            .then(res => {
                setFollowers(res.data)
            })
            .catch(error => console.log(error))
    };

    const handleRefresh = () => {
        retrieveFollowerUsers()
    };

    if (!userData) return <></>
    else
        return followers?.map(item => (
            <Suggestion
                onClick={handleRefresh}
                key={item.id}
                idSubject={userData!.id}
                idObject={item.following.id}
                image={item.following.image}
                following={item.following.follower.find((item: any) => item.followingId === userData?.id) ? true : false}
                fullname={item.following.username} username={item.following.username}
            />
        ));
}

export default FollowersPage;