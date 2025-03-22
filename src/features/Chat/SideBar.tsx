import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupApi } from '../../shared/api/groupApi';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';

interface SideBarProps {
  group: {
    vk_group_id: number;
    name: string;
    description: string;
    subscribers_count: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const SideBar: React.FC<SideBarProps> = ({ group, loading, error }) => {
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState(group);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState<string | null>(null);

  useEffect(() => {
    setGroupData(group);
  }, [group]);

  const handleReload = async () => {
    if (!groupData) {
      return;
    }

    setIsUpdating(true);
    setErrorUpdate(null);

    try {
      const updatedGroup = await groupApi.updateCommunityData(
        groupData.vk_group_id,
      );

      setGroupData(updatedGroup);
    } catch (error) {
      if (typeof error === 'string') {
        setErrorUpdate(error);
      } else {
        setErrorUpdate('Ошибка обновления данных');
      }
    }

    setIsUpdating(false);
  };

  return (
    <aside
      className="sidebar shadow-sm d-flex flex-column align-items-center"
      style={{ maxHeight: '100vh' }}
    >
      <button
        className="btn btn-link text-decoration-none text-secondary align-self-start mb-2"
        onClick={() => navigate('/start')}
      >
        <i className="bi bi-arrow-left"></i> Назад
      </button>

      <h3 className="text-center mb-4 fw-bold">Информация о сообществе</h3>
      {loading && <Loading />}
      {error && <Error message={error} />}

      {groupData && (
        <div className="w-100 d-flex flex-column align-items-center justify-content-center words">
          <div className="d-flex flex-row align-items-center justify-content-center gap-2">
            <h5 className="fw-semibold mb-0 text-center">{groupData.name}</h5>
            {groupData.vk_group_id > 0 && (
              <button className="btn btn-sm btn-primary" onClick={handleReload}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            )}
          </div>
          {isUpdating && <Loading />}
          {errorUpdate && <Error message={errorUpdate} />}
          <hr className="w-100 mt-2 border-secondary" />
          <div className="d-flex mb-3 align-items-center gap-2">
            <span className="fs-5">
              <i className="bi bi-people-fill"></i>
            </span>
            <span className="badge bg-secondary px-3 py-2">
              {groupData.subscribers_count} подписчиков
            </span>
          </div>
          <p className="m-0 text-muted">{groupData.description}</p>
        </div>
      )}
    </aside>
  );
};
