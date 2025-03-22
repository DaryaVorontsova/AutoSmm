import React from 'react';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { GroupCard } from './GroupCard';

interface GroupsListProps {
  groups: { vk_group_id: number; name: string }[];
  loading: boolean;
  error: string | null;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  groups,
  loading,
  error,
}) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <>
      {!groups.length ? (
        <p>У вас пока нет групп</p>
      ) : (
        <div className="container mb-5">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
            {groups.map(group => (
              <div key={group.vk_group_id} className="col">
                <GroupCard id={group.vk_group_id} name={group.name} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
