import Cookies from 'js-cookie';
import Suggestion from '@/components/layouts/suggestion';
import { fetchFollowingUsers } from '@/features/relation/services/follow.service';
import useUserStore from '@/hooks/userStore';
import { useEffect, useState } from 'react';

const FollowingPage = () => {
  const [following, setFollowing] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { userData } = useUserStore();

  const retrieveFollowingUsers = async () => {
    setIsLoading(true);
    setFollowing(null);
    const token = Cookies.get('token')!;
    try {
      const res = await fetchFollowingUsers(token, userData!.id);
      setFollowing(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retrieveFollowingUsers();
  }, [userData]);

  const handleRefresh = async () => {
    await retrieveFollowingUsers();
  };

  if (!userData) return <></>;

  return (
    <div>
      {isLoading && <p>Loading...</p>} {/* Indikator loading */}
      {following?.map((item) => (
        <Suggestion
          onClick={handleRefresh}
          key={item.id}
          idSubject={userData!.id}
          idObject={item.follower.id}
          following={true}
          fullname={item.follower.username}
          username={item.follower.username}
        />
      ))}
    </div>
  );
};

export default FollowingPage;
